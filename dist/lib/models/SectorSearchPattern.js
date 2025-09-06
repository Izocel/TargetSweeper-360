"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SectorSearchPattern = exports.SectorSearchPatternSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const GeoCalculator_1 = require("../utils/GeoCalculator");
const Math_1 = require("../utils/Math");
const BaseModel_1 = require("./BaseModel");
const Target_1 = require("./Target");
exports.SectorSearchPatternSchema = zod_1.default.object({
    datum: Target_1.Target.Schema,
    speed: zod_1.default.number().min(0),
    radius: zod_1.default.number().gt(0),
    sectors: zod_1.default.array(zod_1.default.array(Target_1.Target.Schema)).length(3).refine(sector => sector.length === 3, {
        message: "Each sector must contain exactly 3 targets",
    }),
});
class SectorSearchPattern extends BaseModel_1.BaseModel {
    constructor(data) {
        super(exports.SectorSearchPatternSchema, data ?? {
            speed: 10,
            radius: 200,
            datum: new Target_1.Target(),
            sectors: [
                [new Target_1.Target(), new Target_1.Target(), new Target_1.Target()],
                [new Target_1.Target(), new Target_1.Target(), new Target_1.Target()],
                [new Target_1.Target(), new Target_1.Target(), new Target_1.Target()]
            ]
        });
        this.updateDatum(this._data.datum);
    }
    /**
     * Gets the datum target.
     * Represents the central reference point, or the current position of the search buoy
     * @returns The datum target.
     */
    get datum() {
        return this.data.datum;
    }
    set datum(datum) {
        this._data.datum = datum;
    }
    /**
     * Gets the speed of the search vessel.
     * @returns The speed of the search vessel.
     */
    get speed() {
        return this.data.speed;
    }
    set speed(speed) {
        this._data.speed = Math.max(0, speed);
    }
    /**
     * Gets the radius of the search pattern.
     * @returns The radius of the search pattern.
     */
    get radius() {
        return this.data.radius;
    }
    set radius(radius) {
        this._data.radius = Math.max(1, radius);
    }
    /**
     * Gets the sectors of the search pattern.
     * Each sector is an array of 3 targets representing the vertices of a triangle.
     * @returns An array containing 3 sectors, each with 3 targets.
     */
    get sectors() {
        return this.data.sectors;
    }
    set sectors(sectors) {
        this._data.sectors = sectors;
    }
    /**
     * Updates the search pattern with new values.
     * @param datum The new values to update the search pattern with.
     * @param radius The new radius of the search pattern.
     * @param speed The new speed of the search pattern.
     */
    updateDatum(datum) {
        this.datum.name = datum.name || "Datum";
        this.datum.latitude = (0, Math_1.handleOverflow)(datum.latitude, -90, 90);
        this.datum.longitude = (0, Math_1.handleOverflow)(datum.longitude, -180, 180);
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
    updateSector(index) {
        let apexHeading = index === 0 ? this.datum.heading
            : index === 1 ? this.datum.heading + 240
                : this.datum.heading + 120;
        apexHeading = (0, Math_1.handleOverflow)(apexHeading, 0, 360);
        const legHeading = (0, Math_1.handleOverflow)(apexHeading + 60, 0, 360);
        const apexCoords = GeoCalculator_1.GeoCalculator.offsetTarget(this.datum, this.radius, apexHeading);
        const legCoords = GeoCalculator_1.GeoCalculator.offsetTarget(this.datum, this.radius, legHeading);
        this.sectors[index]?.forEach((target, i) => {
            target.fixedSpeed = this.speed;
            target.speed = this.datum.speed;
            target.heading = this.datum.heading;
            target.altitude = this.datum.altitude;
            target.name = `S${index + 1} - T${i + 1}`;
            // TODO: fix targets vessel headings
            if (i === 0) {
                target.latitude = apexCoords.latitude;
                target.longitude = apexCoords.longitude;
                target.fixedHeading = apexHeading;
            }
            else if (i === 1) {
                target.latitude = legCoords.latitude;
                target.longitude = legCoords.longitude;
                target.fixedHeading = legHeading;
            }
            else {
                target.latitude = this.datum.latitude;
                target.longitude = this.datum.longitude;
                target.fixedHeading = (0, Math_1.handleOverflow)(legHeading + 180, 0, 360);
            }
        });
    }
    /**
     * Generates KML placemarks for each target in the search pattern.
     * @returns An array of KML placemark strings.
     */
    generateKmlPlacemarks() {
        const placemarks = [];
        for (const sector of this.sectors) {
            for (let j = 0; j < sector.length - 1; j++) {
                const target = sector[j];
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
    generateKmlPolygons() {
        const polygons = [];
        for (let i = 0; i < this.sectors.length; i++) {
            const sector = this.sectors[i];
            // Repeat the first coordinate at the end to close the polygon
            const coordsArr = sector.map(target => `${target.longitude},${target.latitude},${target.altitude}`);
            if (coordsArr.length > 0) {
                coordsArr.push(coordsArr[0]);
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
    generateKml() {
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
exports.SectorSearchPattern = SectorSearchPattern;
//# sourceMappingURL=SectorSearchPattern.js.map