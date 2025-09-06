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
            radius: data?.radius ?? 1_500,
            datum: data?.datum ?? new Target(),
            sectors: data?.sectors ?? [
                [new Target(), new Target(), new Target()],
                [new Target(), new Target(), new Target()],
                [new Target(), new Target(), new Target()]
            ]
        });

        this.update();
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

        this.datum.speed = this.speed;
        this.datum.stepDistance = this.radius;
        this.datum.name = datum.name || "Datum";
        this.datum.heading = handleFlooredOverflow(datum.heading, 0, 360);
        this.datum.latitude = handleOverflow(datum.latitude, -90, 90);
        this.datum.longitude = handleOverflow(datum.longitude, -180, 180);

        this.updateAllSectors();
    }

    /**
     * Gets the speed of the search vessel.
     * @returns The speed of the search vessel.
     */
    get speed(): number {
        return this.data.speed;
    }

    set speed(speed: number) {
        const newSpeed = Math.max(0, speed);
        if (this._data.speed !== newSpeed) {
            this._data.speed = newSpeed;
            this.updateAllSectors();
        }
    }

    /**
     * Gets the radius of the search pattern.
     * @returns The radius of the search pattern.
     */
    get radius(): number {
        return this.data.radius;
    }

    set radius(radius: number) {
        const newRadius = Math.max(1, radius);
        if (this._data.radius !== newRadius) {
            this._data.radius = newRadius;
            this.updateAllSectors();
        }
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
        // Note: No update call here as this is typically used internally
    }

    /**
     * Updates the internal state of the search pattern.
     * @param datum Optional new datum target to update the pattern with.
     */
    update(datum?: Target): void {
        if (datum) {
            this._data.datum = datum;
        }
        this.updateAllSectors();
    }

    /**
     * Optimized method to update all sectors at once.
     * Reduces redundant calculations and object creations.
     */
    updateAllSectors(): void {
        // Pre-calculate constant values to avoid redundant calculations
        const datumHeading = this.datum.heading;
        const datumSpeed = this.datum.speed;
        const datumAltitude = this.datum.altitude;
        const datumLat = this.datum.latitude;
        const datumLon = this.datum.longitude;
        const radius = this.radius;
        const speed = this.speed;

        // Pre-calculate sector headings for all sectors
        const sectorHeadings = [
            datumHeading,                      // Sector 0
            datumHeading + 240,               // Sector 1  
            datumHeading + 120                // Sector 2
        ].map(h => handleFlooredOverflow(h, 0, 360));

        // Process all sectors in batch
        for (let sectorIndex = 0; sectorIndex < 3; sectorIndex++) {
            // Ensure sector exists and has correct structure
            if (!this.sectors[sectorIndex]) {
                this._data.sectors[sectorIndex] = [new Target(), new Target(), new Target()];
            }

            const sector = this._data.sectors[sectorIndex]!;
            while (sector.length < 3) {
                sector.push(new Target());
            }

            const apexHeading = sectorHeadings[sectorIndex]!;
            const legHeading = handleFlooredOverflow(apexHeading + 60, 0, 360);

            // Pre-calculate coordinates for this sector
            const apexCoords = GeoCalculator.offsetTarget(this.datum, radius, apexHeading);
            const legCoords = GeoCalculator.offsetTarget(this.datum, radius, legHeading);

            // Batch update all targets in this sector
            const sectorTargets = [
                {
                    coords: apexCoords,
                    stepHeading: handleFlooredOverflow(apexHeading + 120, 0, 360)
                },
                {
                    coords: legCoords,
                    stepHeading: handleFlooredOverflow(apexHeading + 240, 0, 360)
                },
                {
                    coords: { latitude: datumLat, longitude: datumLon },
                    stepHeading: handleFlooredOverflow(apexHeading + 180, 0, 360)
                }
            ];

            // Update all targets in this sector
            for (let targetIndex = 0; targetIndex < 3; targetIndex++) {
                const target = sector[targetIndex]!;
                const targetData = sectorTargets[targetIndex]!;

                // Batch assign all properties to minimize property access overhead
                target.speed = datumSpeed;
                target.heading = datumHeading;
                target.altitude = datumAltitude;
                target.name = `S${sectorIndex + 1} - T${targetIndex + 1}`;
                target.stepSpeed = speed;
                target.stepDistance = radius;
                target.latitude = targetData.coords.latitude;
                target.longitude = targetData.coords.longitude;
                target.stepHeading = targetData.stepHeading;
            }
        }

        // Single validation call at the end
        this.validate();
    }

    /**
     * Updates the specified sector with new target positions.
     * @deprecated Use updateAllSectors() for better performance. This method is kept for backward compatibility.
     * @param index The index of the sector to update (0-2).
     */
    updateSector(index: number): void {
        if (index < 0 || index >= 3) return;

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
            target.speed = this.datum.speed;
            target.heading = this.datum.heading;
            target.altitude = this.datum.altitude;
            target.name = `S${index + 1} - T${i + 1}`;
            target.stepSpeed = this.speed;

            if (i === 0) {
                target.stepDistance = this.radius;
                target.latitude = apexCoords.latitude;
                target.longitude = apexCoords.longitude;
                target.stepHeading = handleFlooredOverflow(apexHeading + 120, 0, 360);
            } else if (i === 1) {
                target.stepDistance = this.radius;
                target.latitude = legCoords.latitude;
                target.longitude = legCoords.longitude;
                target.stepHeading = handleFlooredOverflow(apexHeading + 240, 0, 360);
            } else {
                target.stepDistance = this.radius;
                target.latitude = this.datum.latitude;
                target.longitude = this.datum.longitude;
                target.stepHeading = handleFlooredOverflow(apexHeading + 180, 0, 360);

            }
        });
    }

    /**
     * Batch update multiple properties without triggering multiple recalculations.
     * More efficient than setting properties individually.
     */
    batchUpdate(updates: {
        datum?: Target;
        speed?: number;
        radius?: number;
    }): void {
        let hasChanges = false;

        if (updates.datum !== undefined) {
            this._data.datum = updates.datum;
            this.datum.speed = this.speed;
            this.datum.stepDistance = this.radius;
            this.datum.name = updates.datum.name || "Datum";
            this.datum.heading = handleFlooredOverflow(updates.datum.heading, 0, 360);
            this.datum.latitude = handleOverflow(updates.datum.latitude, -90, 90);
            this.datum.longitude = handleOverflow(updates.datum.longitude, -180, 180);
            hasChanges = true;
        }

        if (updates.speed !== undefined) {
            const newSpeed = Math.max(0, updates.speed);
            if (this._data.speed !== newSpeed) {
                this._data.speed = newSpeed;
                hasChanges = true;
            }
        }

        if (updates.radius !== undefined) {
            const newRadius = Math.max(1, updates.radius);
            if (this._data.radius !== newRadius) {
                this._data.radius = newRadius;
                hasChanges = true;
            }
        }

        if (hasChanges) {
            this.updateAllSectors();
        }
    }

    /**
     * Generates KML placemarks for each target in the search pattern.
     * @returns An array of KML placemark strings.
     */
    generateKmlPlacemarks(): string[] {
        const placemarks: string[] = [];

        // Add datum placemark
        placemarks.push(`        <Placemark>
            <styleUrl>#datumStyle</styleUrl>
            <name>${this.datum.name}</name>
            <description>
                Speed:${this.datum.speed}
                <br />
                Heading:${this.datum.heading}
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

        // Add sector target placemarks
        for (const sector of this.sectors) {
            for (let j = 0; j < sector.length - 1; j++) {
                const target = sector[j]!;
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
            }
        }

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
            <name>Sector ${i + 1}</name>
            <description>Search sector ${i + 1} path</description>
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
