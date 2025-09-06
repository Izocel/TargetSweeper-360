import z from "zod";
import { GeoCalculator } from "../utils/GeoCalculator";
import { handleFlooredOverflow, handleOverflow } from "../utils/Math";
import { BaseModel } from "./BaseModel";
import { Target } from "./Target";

export const SectorSearchPatternSchema = z.object({
    datum: Target.Schema,
    speed: z.number().min(0),
    radius: z.number().min(1),
    sectors: z.array(z.array(Target.Schema)).length(3).refine(sector => sector.length === 3, {
        message: "Each sector must contain exactly 3 targets",
    }),
});

export class SectorSearchPattern extends BaseModel<typeof SectorSearchPatternSchema> {
    constructor(data?: z.infer<typeof SectorSearchPatternSchema>) {
        super(SectorSearchPatternSchema, {
            speed: data?.speed ?? 10,
            radius: data?.radius ?? 200,
            datum: data?.datum ?? new Target(),
            sectors: data?.sectors ?? [
                [new Target(), new Target(), new Target()],
                [new Target(), new Target(), new Target()],
                [new Target(), new Target(), new Target()]
            ]
        });

        this.updateDatum(this._data.datum);
        this.validate();
    }

    /**
     * Gets the datum target.
     * Represents the central reference point, or the current position of the search buoy
     * @returns The datum target.
     */
    get datum(): Target {
        return this.data.datum;
    }

    set datum(datum: Target) {
        this._data.datum = datum;
    }

    /**
     * Gets the speed of the search vessel.
     * @returns The speed of the search vessel.
     */
    get speed(): number {
        return this.data.speed;
    }

    set speed(speed: number) {
        this._data.speed = Math.max(0, speed);
    }

    /**
     * Gets the radius of the search pattern.
     * @returns The radius of the search pattern.
     */
    get radius(): number {
        return this.data.radius;
    }

    set radius(radius: number) {
        this._data.radius = Math.max(1, radius);
    }

    /**
     * Gets the sectors of the search pattern.
     * Each sector is an array of 3 targets representing the vertices of a triangle.
     * @returns An array containing 3 sectors, each with 3 targets.
     */
    get sectors(): Target[][] {
        return this.data.sectors;
    }

    set sectors(sectors: Target[][]) {
        this._data.sectors = sectors;
    }

    /**
     * Updates the search pattern with new values.
     * @param datum The new values to update the search pattern with.
     * @param radius The new radius of the search pattern.
     * @param speed The new speed of the search pattern.
     */
    updateDatum(datum: Target) {
        this.datum.name = datum.name || "Datum";
        this.datum.latitude = handleOverflow(datum.latitude, -90, 90);
        this.datum.longitude = handleOverflow(datum.longitude, -180, 180);
        this.datum.altitude = datum.altitude;
        this.datum.speed = datum.speed; // Search Buoy speed (drift speed)
        this.datum.heading = datum.heading; // Search Buoy direction (drift direction)
        this.datum.fixedSpeed = this.speed; // Search Vessel speed
        this.datum.fixedHeading = datum.heading; // Search Vessel heading

        this.updateSector(0);
        this.updateSector(1);
        this.updateSector(2);
    }

    /**
     * Updates the specified sector with new target positions.
     * @param index The index of the sector to update (0-2).
     */
    updateSector(index: number): void {
        if (!this.sectors[index]) {
            this._data.sectors[index] = [new Target(), new Target(), new Target()];
        }

        while (this._data.sectors[index]!.length < 3) {
            this._data.sectors[index]!.push(new Target());
        }

        let apexHeading = index === 0 ? this.datum.heading
            : index === 1 ? this.datum.heading + 240
                : this.datum.heading + 120;

        apexHeading = handleFlooredOverflow(apexHeading, 0, 360);
        const legHeading = handleFlooredOverflow(apexHeading + 60, 0, 360);

        const apexCoords = GeoCalculator.offsetTarget(this.datum, this.radius, apexHeading);
        const legCoords = GeoCalculator.offsetTarget(this.datum, this.radius, legHeading);

        this.sectors[index]?.forEach((target, i) => {
            target.fixedSpeed = this.speed;
            target.speed = this.datum.speed;
            target.heading = this.datum.heading;
            target.altitude = this.datum.altitude;
            target.name = `S${index + 1} - T${i + 1}`;

            if (i === 0) {
                target.latitude = apexCoords.latitude;
                target.longitude = apexCoords.longitude;
                target.fixedHeading = handleFlooredOverflow(apexHeading + 120, 0, 360);
            } else if (i === 1) {
                target.latitude = legCoords.latitude;
                target.longitude = legCoords.longitude;
                target.fixedHeading = handleFlooredOverflow(legHeading + 120, 0, 360);
            } else {
                target.latitude = this.datum.latitude;
                target.longitude = this.datum.longitude;
                target.fixedHeading = handleFlooredOverflow(legHeading + 180 + 120, 0, 360);
            }
        });
    }

    /**
     * Generates KML placemarks for each target in the search pattern.
     * @returns An array of KML placemark strings.
     */
    generateKmlPlacemarks(): string[] {
        const placemarks: string[] = [];
        for (const sector of this.sectors) {
            for (let j = 0; j < sector.length - 1; j++) {
                const target = sector[j]!;
                placemarks.push(`        <Placemark>
            <styleUrl>#targetStyle</styleUrl>
            <name>${target.name}</name>
            <description>
                Vessel Heading:${target.fixedHeading}
                <br />
                Vessel Speed:${target.fixedSpeed}
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
            }
        }

        // Add datum placemark
        placemarks.push(`        <Placemark>
            <styleUrl>#datumStyle</styleUrl>
            <name>${this.datum.name}</name>
            <description>
                Heading:${this.datum.heading}
                <br />
                Speed:${this.datum.speed}
                <br />
                Longitude:${this.datum.longitude}
                <br />
                Latitude:${this.datum.latitude}
                <br />
                Altitude:${this.datum.altitude}
            </description>
            <Point>
                <coordinates>${this.datum.longitude},${this.datum.latitude},${this.datum.altitude}</coordinates>
            </Point>
        </Placemark>`);

        return placemarks;
    }

    /**
     * Generates KML polygons (triangles) for each sector in the search pattern.
     * @returns An array of KML polygon strings.
     */
    generateKmlPolygons(): string[] {
        const polygons: string[] = [];
        for (let i = 0; i < this.sectors.length; i++) {
            const sector = this.sectors[i]!;
            // Repeat the first coordinate at the end to close the polygon
            const coordsArr = sector.map(target => `${target.longitude},${target.latitude},${target.altitude}`);
            if (coordsArr.length > 0) {
                coordsArr.push(coordsArr[0]!);
            }
            const coords = coordsArr.join(" ");
            polygons.push(`        <Placemark>
            <name>Sector ${i + 1} Triangle</name>
            <description>Search sector ${i + 1} triangle path</description>
            <styleUrl>#polygonStyle</styleUrl>
            <Polygon>
                <outerBoundaryIs>
                    <LinearRing>
                        <coordinates>${coords}</coordinates>
                    </LinearRing>
                </outerBoundaryIs>
            </Polygon>
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
        <description>Sector Search - Victor Sierra (VS)</description>

        <Style id="polygonStyle">
            <LineStyle>
                <color>ff0000ff</color>
                <width>2</width>
            </LineStyle>
            <PolyStyle>
                <color>4d0000ff</color>
                <fill>1</fill>
                <outline>1</outline>
            </PolyStyle>
        </Style>

        <Style id="targetStyle">
            <IconStyle>
                <Icon>
                    <href>http://maps.google.com/mapfiles/kml/shapes/placemark_circle.png</href>
                </Icon>
                <scale>1.0</scale>
                <color>ff0000ff</color>
            </IconStyle>
            <LabelStyle>
                <color>ffffffff</color>
                <scale>1.0</scale>
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
