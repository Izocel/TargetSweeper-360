import z from "zod";
import { BaseModel } from "./BaseModel";
import { Target } from "./Target";

export const ParallelTrackPatternSchema = z.object({
    vector: Target.Schema,
    speed: z.number().min(0),
    spacing: z.number().min(0),
    targets: z.array(Target.Schema),
});

export class ParallelTrackPattern extends BaseModel<typeof ParallelTrackPatternSchema> {
    constructor(data?: z.infer<typeof ParallelTrackPatternSchema>) {
        super(ParallelTrackPatternSchema, {
            vector: data?.vector ?? new Target(),
            speed: data?.speed ?? 10,
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
        if (this.vector.stepDistance <= 0 || this.speed <= 0 || this.spacing <= 0) {
            this.targets = [];
            return;
        }

        const numTargets = Math.floor(this.vector.stepDistance / this.spacing);
        this.targets = Array.from({ length: numTargets }, (_, i) => {
            const target = new Target();
            target.stepDistance = this.vector.stepDistance;
            target.stepSpeed = this.speed;
            target.stepHeading = this.vector.heading;
            target.longitude = this.vector.longitude + i * this.spacing;
            target.latitude = this.vector.latitude;
            target.altitude = this.vector.altitude;
            return target;
        });
    }

    /**
     * Generates KML placemarks for each target in the search pattern.
     * @returns An array of KML placemark strings.
     */
    generateKmlPlacemarks(): string[] {
        const placemarks: string[] = [];
        const datum = this.targets[0]!;

        // Add datum placemark
        placemarks.push(`        <Placemark>
            <styleUrl>#datumStyle</styleUrl>
            <name>${datum.name}</name>
            <description>
                Speed:${datum.speed}
                <br />
                Heading:${datum.heading}
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
        this.targets.forEach((target) => {
            placemarks.push(`        <Placemark>
            <styleUrl>#targetStyle</styleUrl>
            <name>${target.name}</name>
            <description>
                Vessel Speed:${target.stepSpeed}
                <br />
                Vessel Heading:${target.stepHeading}
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
     * Generates KML polygons (triangles) for each sector in the search pattern.
     * @returns An array of KML polygon strings.
     */
    generateKmlPolygons(): string[] {
        const polygons: string[] = [];
        this.targets.forEach((target, i) => {
            if (i === 0) return; // Skip the datum

            const prevTarget = this.targets[i - 1]!;
            polygons.push(`        <Placemark>
            <styleUrl>#polygonStyle</styleUrl>
            <name>Sector ${i}</name>
            <Polygon>
                <outerBoundaryIs>
                    <LinearRing>
                        <coordinates>
                            ${prevTarget.longitude},${prevTarget.latitude},${prevTarget.altitude}
                            ${target.longitude},${target.latitude},${target.altitude}
                        </coordinates>
                    </LinearRing>
                </outerBoundaryIs>
            </Polygon>
        </Placemark>`);
        });

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
        <description>Sector Search - Victor Sierra (VS)</description>

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
