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
        this.update();
    }

    get speed(): number {
        return this._data.speed;
    }

    set speed(speed: number) {
        this._data.speed = Math.max(0, speed);
        this.update();
    }

    get height(): number {
        return this._data.height;
    }

    set height(height: number) {
        this._data.height = Math.max(0, height);
        this.update();
    }

    get spacing(): number {
        return this._data.spacing;
    }

    set spacing(spacing: number) {
        this._data.spacing = Math.max(0, spacing);
        this.update();
    }

    get targets(): Target[] {
        return this._data.targets;
    }

    set targets(targets: Target[]) {
        this._data.targets = targets;
        this.update();
    }

    /**
     * Updates the internal state of the search pattern.
     * @param vector Optional new vector target to update the pattern with.
     */
    update(vector?: Target): void {
        if (vector) {
            this.vector = vector;
            return;
        }

        this.updateTargets();
    }

    updateTargets(): void {
        const numTracks = Math.ceil(this.vector.stepDistance / this.spacing) + 1;

        // Each track has 2 targets (start and end), so total targets = numTracks * 2
        const totalTargets = numTracks * 2;

        // Calculate the perpendicular bearing for track direction (90° from vector heading)
        const trackBearing = (this.vector.heading + 90) % 360;

        // Calculate the three constant headings for the perpendicular turns
        const headingToTrackEnd = trackBearing;           // Perpendicular out (e.g., 90° for north vector)
        const headingAlongVector = this.vector.heading;   // Along vector line (e.g., 0° for north vector)  
        const headingToVector = (trackBearing + 180) % 360; // Perpendicular back (e.g., 270° for north vector)

        if (this.targets.length !== totalTargets) {
            this.targets = Array.from({ length: totalTargets }, () => new Target());
        }

        for (let trackIndex = 0; trackIndex < numTracks; trackIndex++) {
            // Calculate position along the vector line for this track
            const vectorDistance = trackIndex * this.spacing;
            const vectorPosition = GeoCalculator.offsetTarget(this.vector, vectorDistance, this.vector.heading);

            // For alternating pattern: even tracks go one way, odd tracks go the other way
            const isForwardTrack = trackIndex % 2 === 0;

            let startPosition, endPosition;
            let startStepHeading, endStepHeading;

            if (isForwardTrack) {
                // Forward track: start at vector position, extend in track bearing direction
                startPosition = vectorPosition;
                endPosition = GeoCalculator.offsetTarget(
                    { ...this.vector, longitude: vectorPosition.longitude, latitude: vectorPosition.latitude },
                    this.height,
                    trackBearing
                );
                startStepHeading = headingToTrackEnd;  // Go perpendicular out to track end
                endStepHeading = headingAlongVector;   // Go along vector to next track start
            } else {
                // Backward track: start at extended position, end at vector position
                const extendedPosition = GeoCalculator.offsetTarget(
                    { ...this.vector, longitude: vectorPosition.longitude, latitude: vectorPosition.latitude },
                    this.height,
                    trackBearing
                );
                startPosition = extendedPosition;
                endPosition = vectorPosition;
                startStepHeading = headingToVector;    // Go perpendicular back to vector line
                endStepHeading = headingAlongVector;   // Go along vector to next track start
            }

            // Start target (even indices: 0, 2, 4...)
            const startTarget = this.targets[trackIndex * 2]!;
            startTarget.name = trackIndex === 0 ? "Datum" : `Track ${trackIndex + 1} Start`;
            startTarget.longitude = startPosition.longitude;
            startTarget.latitude = startPosition.latitude;
            startTarget.altitude = this.vector.altitude;
            startTarget.heading = startStepHeading;
            startTarget.speed = this.speed;
            startTarget.stepDistance = this.height;
            startTarget.stepSpeed = this.speed;
            startTarget.stepHeading = startStepHeading;

            // End target (odd indices: 1, 3, 5...)
            const endTarget = this.targets[trackIndex * 2 + 1]!;
            endTarget.name = `Track ${trackIndex + 1} End`;
            endTarget.longitude = endPosition.longitude;
            endTarget.latitude = endPosition.latitude;
            endTarget.altitude = this.vector.altitude;
            endTarget.heading = endStepHeading;
            endTarget.speed = this.speed;
            endTarget.stepDistance = trackIndex < numTracks - 1 ? this.spacing : 0; // Last track has no next step
            endTarget.stepSpeed = this.speed;
            endTarget.stepHeading = endStepHeading;
        }

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
