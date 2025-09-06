import z from "zod";
import { GeoCalculator } from "../utils/GeoCalculator";
import { BaseModel } from "./BaseModel";
import { Target } from "./Target";

export const ParallelTrackPatternSchema = z.object({
    vector: Target.Schema,
    speed: z.number().min(0),
    height: z.number().min(0),
    spacing: z.number().min(0),
    targets: z.array(Target.Schema),
});

export class ParallelTrackPattern extends BaseModel<typeof ParallelTrackPatternSchema> {
    constructor(data?: z.infer<typeof ParallelTrackPatternSchema>) {
        super(ParallelTrackPatternSchema, {
            vector: data?.vector ?? new Target(),
            speed: data?.speed ?? 10,
            height: data?.height ?? 20,
            spacing: data?.spacing ?? 20,
            targets: data?.targets ?? [],
        });

        this.update();
        this.validate();
    }

    get vector(): Target {
        return this._data.vector;
    }

    set vector(vector: Target) {
        this._data.vector = vector;
        this.updateTargets();
    }

    get speed(): number {
        return this._data.speed;
    }

    set speed(speed: number) {
        const newSpeed = Math.max(0, speed);
        if (this._data.speed !== newSpeed) {
            this._data.speed = newSpeed;
            this.updateTargets();
        }
    }

    get height(): number {
        return this._data.height;
    }

    set height(height: number) {
        const newHeight = Math.max(0, height);
        if (this._data.height !== newHeight) {
            this._data.height = newHeight;
            this.updateTargets();
        }
    }

    get spacing(): number {
        return this._data.spacing;
    }

    set spacing(spacing: number) {
        const newSpacing = Math.max(0, spacing);
        if (this._data.spacing !== newSpacing) {
            this._data.spacing = newSpacing;
            this.updateTargets();
        }
    }

    get targets(): Target[] {
        return this._data.targets;
    }

    set targets(targets: Target[]) {
        this._data.targets = targets;
        // Note: No update call here as this is typically used internally
    }

    /**
     * Updates the internal state of the search pattern.
     * @param vector Optional new vector target to update the pattern with.
     */
    update(vector?: Target): void {
        if (vector) {
            this._data.vector = vector;
        }
        this.updateTargets();
    }

    /**
     * Batch update multiple properties without triggering multiple recalculations.
     * More efficient than setting properties individually.
     */
    batchUpdate(updates: {
        vector?: Target;
        speed?: number;
        height?: number;
        spacing?: number;
    }): void {
        let hasChanges = false;

        if (updates.vector !== undefined) {
            this._data.vector = updates.vector;
            hasChanges = true;
        }

        if (updates.speed !== undefined) {
            const newSpeed = Math.max(0, updates.speed);
            if (this._data.speed !== newSpeed) {
                this._data.speed = newSpeed;
                hasChanges = true;
            }
        }

        if (updates.height !== undefined) {
            const newHeight = Math.max(0, updates.height);
            if (this._data.height !== newHeight) {
                this._data.height = newHeight;
                hasChanges = true;
            }
        }

        if (updates.spacing !== undefined) {
            const newSpacing = Math.max(0, updates.spacing);
            if (this._data.spacing !== newSpacing) {
                this._data.spacing = newSpacing;
                hasChanges = true;
            }
        }

        if (hasChanges) {
            this.updateTargets();
        }
    }

    updateTargets(): void {
        const numTracks = Math.ceil(this.vector.stepDistance / this.spacing) + 1;
        const totalTargets = numTracks * 2;

        // Pre-calculate all constant values to avoid redundant calculations
        const trackBearing = (this.vector.heading + 90) % 360;

        // Pre-calculate the only 3 possible step headings used in the entire pattern
        const headingToTrackEnd = trackBearing;           // Perpendicular out (90° from vector)
        const headingToVector = (trackBearing + 180) % 360; // Perpendicular back (270° from vector)
        const headingAlongVector = this.vector.heading;   // Along vector direction

        // Cache frequently accessed values
        const vectorAltitude = this.vector.altitude;
        const speed = this.speed;
        const height = this.height;
        const spacing = this.spacing;

        // Resize targets array only if necessary
        if (this.targets.length !== totalTargets) {
            // Reuse existing targets when possible to avoid object creation
            const newTargets = new Array<Target>(totalTargets);
            for (let i = 0; i < totalTargets; i++) {
                newTargets[i] = i < this.targets.length ? this.targets[i]! : new Target();
            }
            this.targets = newTargets;
        }

        // Pre-calculate vector positions for all tracks to minimize GeoCalculator calls
        const vectorPositions = new Array<{ latitude: number; longitude: number }>(numTracks);
        for (let i = 0; i < numTracks; i++) {
            vectorPositions[i] = GeoCalculator.offsetTarget(this.vector, i * spacing, this.vector.heading);
        }

        // Batch process targets for better cache locality
        for (let trackIndex = 0; trackIndex < numTracks; trackIndex++) {
            const vectorPosition = vectorPositions[trackIndex]!;
            const isForwardTrack = (trackIndex & 1) === 0; // Use bitwise operation for better performance

            const startTargetIndex = trackIndex << 1; // Use bit shift instead of multiplication
            const endTargetIndex = startTargetIndex + 1;

            const startTarget = this.targets[startTargetIndex]!;
            const endTarget = this.targets[endTargetIndex]!;

            let startPosition: { latitude: number; longitude: number };
            let endPosition: { latitude: number; longitude: number };
            let startStepHeading: number;
            let endStepHeading: number;

            if (isForwardTrack) {
                // Forward track: start at vector position, extend in track bearing direction
                startPosition = vectorPosition;
                endPosition = GeoCalculator.offsetTarget(
                    { ...this.vector, longitude: vectorPosition.longitude, latitude: vectorPosition.latitude },
                    height,
                    trackBearing
                );
                startStepHeading = headingToTrackEnd;  // Go perpendicular to track end
                endStepHeading = headingAlongVector;   // Go along vector to next track
            } else {
                // Backward track: start at extended position, end at vector position
                startPosition = GeoCalculator.offsetTarget(
                    { ...this.vector, longitude: vectorPosition.longitude, latitude: vectorPosition.latitude },
                    height,
                    trackBearing
                );
                endPosition = vectorPosition;
                startStepHeading = headingToVector;    // Go perpendicular back to vector line
                endStepHeading = headingAlongVector;   // Go along vector to next track
            }

            // Batch update start target properties
            startTarget.name = trackIndex === 0 ? "Datum" : `Track ${trackIndex + 1} Start`;
            startTarget.longitude = startPosition.longitude;
            startTarget.latitude = startPosition.latitude;
            startTarget.altitude = vectorAltitude;
            startTarget.heading = startStepHeading;
            startTarget.speed = speed;
            startTarget.stepDistance = height;
            startTarget.stepSpeed = speed;
            startTarget.stepHeading = startStepHeading;

            // Batch update end target properties
            endTarget.name = `Track ${trackIndex + 1} End`;
            endTarget.longitude = endPosition.longitude;
            endTarget.latitude = endPosition.latitude;
            endTarget.altitude = vectorAltitude;
            endTarget.heading = endStepHeading;
            endTarget.speed = speed;
            endTarget.stepDistance = trackIndex < numTracks - 1 ? spacing : 0;
            endTarget.stepSpeed = speed;
            endTarget.stepHeading = endStepHeading;
        }

        // Single validation call at the end instead of on every property change
        this.validate();
    }

    /**
     * Generates KML placemarks for each target in the search pattern.
     * @returns An array of KML placemark strings.
     */
    generateKmlPlacemarks(): string[] {
        const placemarks: string[] = [];

        if (this.targets.length === 0) {
            return placemarks;
        }

        const datum = this.targets[0]!;

        // Add datum placemark
        placemarks.push(`        <Placemark>
            <styleUrl>#datumStyle</styleUrl>
            <name>${datum.name}</name>
            <description>
                Step Speed:${datum.stepSpeed}
                <br />
                Step Heading:${datum.stepHeading}
                <br />
                Step Distance:${datum.stepDistance}
                <br />
                Longitude:${datum.longitude}
                <br />
                Latitude:${datum.latitude}
                <br />
                Altitude:${datum.altitude}
            </description>
            <Point>
                <coordinates>${datum.longitude},${datum.latitude},${datum.altitude}</coordinates>
            </Point>
        </Placemark>`);

        // Add target placemarks
        this.targets.forEach((target, i) => {
            if (i === 0) return; // Skip datum, already added

            placemarks.push(`        <Placemark>
            <styleUrl>#targetStyle</styleUrl>
            <name>${target.name}</name>
            <description>
                Step Speed:${target.stepSpeed}
                <br />
                Step Heading:${target.stepHeading}
                <br />
                Step Distance:${target.stepDistance}
                <br />
                Longitude:${target.longitude}
                <br />
                Latitude:${target.latitude}
                <br />
                Altitude:${target.altitude}
            </description>
            <Point>
                <coordinates>${target.longitude},${target.latitude},${target.altitude}</coordinates>
            </Point>
        </Placemark>`);
        });

        return placemarks;
    }

    /**
     * Generates KML polygons (track lines and connecting lines) for the search pattern.
     * @returns An array of KML polygon strings.
     */
    generateKmlPolygons(): string[] {
        const polygons: string[] = [];

        if (this.targets.length === 0) {
            return polygons;
        }

        const numTracks = this.targets.length / 2;

        // Generate track lines (parallel tracks)
        for (let trackIndex = 0; trackIndex < numTracks; trackIndex++) {
            const startTarget = this.targets[trackIndex * 2]!;
            const endTarget = this.targets[trackIndex * 2 + 1]!;

            polygons.push(`        <Placemark>
            <styleUrl>#trackStyle</styleUrl>
            <name>Track ${trackIndex + 1}</name>
            <LineString>
                <coordinates>
                    ${startTarget.longitude},${startTarget.latitude},${startTarget.altitude}
                    ${endTarget.longitude},${endTarget.latitude},${endTarget.altitude}
                </coordinates>
            </LineString>
        </Placemark>`);
        }

        // Generate connecting lines between tracks
        for (let trackIndex = 0; trackIndex < numTracks - 1; trackIndex++) {
            const currentTrackEnd = this.targets[trackIndex * 2 + 1]!;
            const nextTrackStart = this.targets[(trackIndex + 1) * 2]!;

            polygons.push(`        <Placemark>
            <styleUrl>#connectionStyle</styleUrl>
            <name>Connection ${trackIndex + 1}-${trackIndex + 2}</name>
            <LineString>
                <coordinates>
                    ${currentTrackEnd.longitude},${currentTrackEnd.latitude},${currentTrackEnd.altitude}
                    ${nextTrackStart.longitude},${nextTrackStart.latitude},${nextTrackStart.altitude}
                </coordinates>
            </LineString>
        </Placemark>`);
        }

        return polygons;
    }

    /**
     * Generates the KML representation of the search pattern.
     * @returns The KML string.
     */
    generateKml(): string {
        const placemarks = this.generateKmlPlacemarks();
        const polygons = this.generateKmlPolygons();

        return `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2" xmlns:gx="http://www.google.com/kml/ext/2.2">
    <Document>
        <name>${this.vector.name}</name>
        <description>Parallel Track - Papa Sierra (PS)</description>

        <Style id="trackStyle">
            <LineStyle>
                <color>ff0000ff</color>
                <width>2</width>
            </LineStyle>
        </Style>

        <Style id="connectionStyle">
            <LineStyle>
                <color>ff00ff00</color>
                <width>1</width>
            </LineStyle>
        </Style>

        <Style id="polygonStyle">
            <LineStyle>
                <color>ff0000ff</color>
                <width>1</width>
            </LineStyle>
            <PolyStyle>
                <color>4d0000ff</color>
                <fill>0</fill>
                <outline>1</outline>
            </PolyStyle>
        </Style>

        <Style id="targetStyle">
            <IconStyle>
                <Icon>
                    <href>http://maps.google.com/mapfiles/kml/shapes/placemark_circle.png</href>
                </Icon>
                <scale>1.2</scale>
                <color>ea2e00ff</color>
            </IconStyle>
            <LabelStyle>
                <color>ffffffff</color>
                <scale>1</scale>
            </LabelStyle>
        </Style>
        
        <Style id="datumStyle">
            <IconStyle>
                <Icon>
                    <href>http://maps.google.com/mapfiles/kml/shapes/target.png</href>
                </Icon>
                <scale>1.2</scale>
                <color>ff00ff00</color>
            </IconStyle>
            <LabelStyle>
                <color>ffffffff</color>
                <scale>1.1</scale>
            </LabelStyle>
        </Style>

${polygons.join("")}
${placemarks.join("")}
    </Document>
</kml>`;
    }
}
