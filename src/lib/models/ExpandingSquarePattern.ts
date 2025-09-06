import z from "zod";
import { GeoCalculator } from "../utils/GeoCalculator";
import { BaseModel } from "./BaseModel";
import { Target } from "./Target";

export const ExpandingSquarePatternSchema = z.object({
    datum: Target.Schema,
    speed: z.number().min(0),
    height: z.number().min(0), // Total search area height in meters
    width: z.number().min(0),  // Total search area width in meters
    vesselVisualDistance: z.number().min(0), // Effective visual search distance in meters
    targets: z.array(Target.Schema),
});

export class ExpandingSquarePattern extends BaseModel<typeof ExpandingSquarePatternSchema> {
    constructor(data?: z.infer<typeof ExpandingSquarePatternSchema>) {
        super(ExpandingSquarePatternSchema, {
            datum: data?.datum ?? new Target(),
            speed: data?.speed ?? 10,
            height: data?.height ?? 200,
            width: data?.width ?? 200,
            vesselVisualDistance: data?.vesselVisualDistance ?? 50,
            targets: data?.targets ?? [],
        });

        this.update();
        this.validate();
    }

    get datum(): Target {
        return this._data.datum;
    }

    set datum(datum: Target) {
        this._data.datum = datum;
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

    get width(): number {
        return this._data.width;
    }

    set width(width: number) {
        this._data.width = Math.max(0, width);
        this.update();
    }

    get vesselVisualDistance(): number {
        return this._data.vesselVisualDistance;
    }

    set vesselVisualDistance(vesselVisualDistance: number) {
        this._data.vesselVisualDistance = Math.max(0, vesselVisualDistance);
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
     * @param datum Optional new datum target to update the pattern with.
     */
    update(datum?: Target): void {
        if (datum) {
            this.datum = datum;
            return;
        }

        this.updateTargets();
    }

    updateTargets(): void {
        if (this.height <= 0 || this.width <= 0 || this.speed <= 0 || this.vesselVisualDistance <= 0) {
            this.targets = [];
            return;
        }

        const targets: Target[] = [];
        let currentPosition = {
            longitude: this.datum.longitude,
            latitude: this.datum.latitude
        };

        // Add datum as first target
        const datumTarget = new Target();
        datumTarget.name = "Start (Datum)";
        datumTarget.longitude = currentPosition.longitude;
        datumTarget.latitude = currentPosition.latitude;
        datumTarget.altitude = this.datum.altitude;
        datumTarget.heading = this.datum.heading; // Use actual datum heading
        datumTarget.speed = this.speed;
        datumTarget.stepDistance = this.vesselVisualDistance; // Distance to first leg (1n)
        datumTarget.stepSpeed = this.speed;
        datumTarget.stepHeading = this.datum.heading; // First leg follows datum heading
        targets.push(datumTarget);

        // Expanding square spiral pattern: n, n, 2n, 2n, 3n, 3n, 4n, 4n...
        // Directions relative to datum heading: datum direction, +90°, +180°, +270°
        const baseHeading = this.datum.heading;
        const directions = [
            baseHeading,                    // Same as datum heading
            (baseHeading + 90) % 360,      // Turn right 90°
            (baseHeading + 180) % 360,     // Turn right 180°
            (baseHeading + 270) % 360      // Turn right 270° (same as left 90°)
        ];

        // Calculate maximum radius we can search within the specified area
        const maxRadius = Math.min(this.height / 2, this.width / 2);

        // Pre-calculate maximum number of legs needed
        // The spiral reaches maximum radius when the cumulative distance equals maxRadius
        // For expanding square: each complete square cycle uses 4 legs of same length
        // Pattern: 1n, 1n, 2n, 2n, 3n, 3n, 4n, 4n...
        let maxLegMultiplier = Math.floor(maxRadius / this.vesselVisualDistance);
        let maxLegs = maxLegMultiplier * 4; // 4 legs per square cycle

        // Pre-calculate direction constants
        const directionOffsets = [
            { x: 0, y: 1 },   // Forward (North relative to heading)
            { x: 1, y: 0 },   // Right (East relative to heading)  
            { x: 0, y: -1 },  // Back (South relative to heading)
            { x: -1, y: 0 }   // Left (West relative to heading)
        ];

        let currentX = 0, currentY = 0; // Position relative to datum in normalized coordinates

        for (let legNumber = 1; legNumber <= maxLegs; legNumber++) {
            // Calculate leg multiplier and distance using math instead of iteration
            const legMultiplier = Math.ceil(legNumber / 2);
            const legDistance = legMultiplier * this.vesselVisualDistance;

            // Calculate direction index using modulo
            const directionIndex = (legNumber - 1) % 4;
            const direction = directions[directionIndex]!;
            const nextDirection = directions[legNumber % 4]!;

            // Calculate relative movement for this leg
            const offset = directionOffsets[directionIndex]!;
            currentX += offset.x * legDistance;
            currentY += offset.y * legDistance;

            // Convert relative position to actual geographic coordinates
            // Apply rotation based on datum heading
            const headingRad = (this.datum.heading * Math.PI) / 180;
            const cosHeading = Math.cos(headingRad);
            const sinHeading = Math.sin(headingRad);

            const rotatedX = currentX * cosHeading - currentY * sinHeading;
            const rotatedY = currentX * sinHeading + currentY * cosHeading;

            // Calculate actual geographic position
            const endPosition = GeoCalculator.offsetTarget(
                this.datum,
                Math.sqrt(rotatedX * rotatedX + rotatedY * rotatedY),
                Math.atan2(rotatedX, rotatedY) * 180 / Math.PI
            );

            // Check if this target is within our search area bounds
            const distanceFromDatum = Math.sqrt(rotatedX * rotatedX + rotatedY * rotatedY);

            // Stop if this leg would take us beyond the search area
            if (distanceFromDatum > maxRadius) {
                break;
            }

            // Calculate next leg distance for stepDistance (distance TO next target)
            const nextLegMultiplier = Math.ceil((legNumber + 1) / 2);
            const nextLegDistance = nextLegMultiplier * this.vesselVisualDistance;

            // Create target for end of this leg
            const target = new Target();
            target.name = `T${legNumber}`;
            target.longitude = endPosition.longitude;
            target.latitude = endPosition.latitude;
            target.altitude = this.datum.altitude;
            target.heading = direction;
            target.speed = this.speed;
            target.stepDistance = nextLegDistance; // Distance TO the next target
            target.stepSpeed = this.speed;
            target.stepHeading = nextDirection; // Turn 90° right for next leg

            targets.push(target);
        }

        this._data.targets = targets;
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

        this.targets.forEach((target, index) => {
            const styleUrl = index === 0 ? '#datumStyle' : '#targetStyle';

            placemarks.push(`        <Placemark>
            <styleUrl>${styleUrl}</styleUrl>
            <name>${target.name}</name>
            <description>
                Step Speed: ${target.stepSpeed}
                <br />
                Step Heading: ${target.stepHeading}
                <br />
                Step Distance: ${target.stepDistance}
                <br />
                Longitude: ${target.longitude}
                <br />
                Latitude: ${target.latitude}
                <br />
                Altitude: ${target.altitude}
            </description>
            <Point>
                <coordinates>${target.longitude},${target.latitude},${target.altitude}</coordinates>
            </Point>
        </Placemark>`);
        });

        return placemarks;
    }

    /**
     * Generates KML polygons for the expanding square pattern.
     * @returns An array of KML polygon strings.
     */
    generateKmlPolygons(): string[] {
        const polygons: string[] = [];

        if (this.targets.length === 0) {
            return polygons;
        }

        // Generate connecting lines between consecutive targets
        for (let i = 0; i < this.targets.length - 1; i++) {
            const currentTarget = this.targets[i]!;
            const nextTarget = this.targets[i + 1]!;

            polygons.push(`        <Placemark>
            <styleUrl>#trackStyle</styleUrl>
            <name>Leg ${i + 1}</name>
            <LineString>
                <coordinates>
                    ${currentTarget.longitude},${currentTarget.latitude},${currentTarget.altitude}
                    ${nextTarget.longitude},${nextTarget.latitude},${nextTarget.altitude}
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
        <name>${this.datum.name}</name>
        <description>Expanding Square Search (SS) - ${this.height}m × ${this.width}m area, ${this.vesselVisualDistance}m visual range</description>

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
