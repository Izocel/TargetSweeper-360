"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpandingSquarePattern = exports.ExpandingSquarePatternSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const GeoCalculator_1 = require("../utils/GeoCalculator");
const BaseModel_1 = require("./BaseModel");
const Target_1 = require("./Target");
exports.ExpandingSquarePatternSchema = zod_1.default.object({
    datum: Target_1.Target.Schema,
    speed: zod_1.default.number().min(0),
    height: zod_1.default.number().min(0), // Total search area height in meters
    width: zod_1.default.number().min(0), // Total search area width in meters
    vesselVisualDistance: zod_1.default.number().min(0), // Effective visual search distance in meters
    targets: zod_1.default.array(Target_1.Target.Schema),
});
class ExpandingSquarePattern extends BaseModel_1.BaseModel {
    constructor(data) {
        super(exports.ExpandingSquarePatternSchema, {
            datum: data?.datum ?? new Target_1.Target(),
            speed: data?.speed ?? 10,
            height: data?.height ?? 200,
            width: data?.width ?? 200,
            vesselVisualDistance: data?.vesselVisualDistance ?? 50,
            targets: data?.targets ?? [],
        });
        this.update();
        this.validate();
    }
    get datum() {
        return this._data.datum;
    }
    set datum(datum) {
        this._data.datum = datum;
        this.update();
    }
    get speed() {
        return this._data.speed;
    }
    set speed(speed) {
        this._data.speed = Math.max(0, speed);
        this.update();
    }
    get height() {
        return this._data.height;
    }
    set height(height) {
        this._data.height = Math.max(0, height);
        this.update();
    }
    get width() {
        return this._data.width;
    }
    set width(width) {
        this._data.width = Math.max(0, width);
        this.update();
    }
    get vesselVisualDistance() {
        return this._data.vesselVisualDistance;
    }
    set vesselVisualDistance(vesselVisualDistance) {
        this._data.vesselVisualDistance = Math.max(0, vesselVisualDistance);
        this.update();
    }
    get targets() {
        return this._data.targets;
    }
    set targets(targets) {
        this._data.targets = targets;
        this.update();
    }
    /**
     * Updates the internal state of the search pattern.
     * @param datum Optional new datum target to update the pattern with.
     */
    update(datum) {
        if (datum) {
            this.datum = datum;
            return;
        }
        this.updateTargets();
    }
    updateTargets() {
        if (this.height <= 0 || this.width <= 0 || this.speed <= 0 || this.vesselVisualDistance <= 0) {
            this.targets = [];
            return;
        }
        const targets = [];
        let currentPosition = {
            longitude: this.datum.longitude,
            latitude: this.datum.latitude
        };
        // Add datum as first target
        const datumTarget = new Target_1.Target();
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
            baseHeading, // Same as datum heading
            (baseHeading + 90) % 360, // Turn right 90°
            (baseHeading + 180) % 360, // Turn right 180°
            (baseHeading + 270) % 360 // Turn right 270° (same as left 90°)
        ];
        let legNumber = 1;
        let directionIndex = 0;
        // Calculate maximum radius we can search within the specified area
        const maxRadius = Math.min(this.height / 2, this.width / 2);
        while (true) { // No safety limit - rely on search area bounds only
            // Each leg length: 1n, 1n, 2n, 2n, 3n, 3n, 4n, 4n...
            const legMultiplier = Math.ceil(legNumber / 2);
            const legDistance = legMultiplier * this.vesselVisualDistance;
            const currentDirection = directions[directionIndex];
            const nextDirection = directions[(directionIndex + 1) % 4];
            // Calculate end position of this leg
            const endPosition = GeoCalculator_1.GeoCalculator.offsetTarget({ ...this.datum, longitude: currentPosition.longitude, latitude: currentPosition.latitude }, legDistance, currentDirection);
            // Check if this target is within our search area bounds
            const distanceFromDatum = GeoCalculator_1.GeoCalculator.getDistance({ longitude: this.datum.longitude, latitude: this.datum.latitude }, endPosition);
            // Stop if this leg would take us beyond the search area
            if (distanceFromDatum > maxRadius) {
                break;
            }
            // Calculate next leg distance for stepDistance (distance TO next target)
            const nextLegMultiplier = Math.ceil((legNumber + 1) / 2);
            const nextLegDistance = nextLegMultiplier * this.vesselVisualDistance;
            // Create target for end of this leg
            const target = new Target_1.Target();
            target.name = `T${legNumber}`;
            target.longitude = endPosition.longitude;
            target.latitude = endPosition.latitude;
            target.altitude = this.datum.altitude;
            target.heading = currentDirection;
            target.speed = this.speed;
            target.stepDistance = nextLegDistance; // Distance TO the next target
            target.stepSpeed = this.speed;
            target.stepHeading = nextDirection; // Turn 90° right for next leg
            targets.push(target);
            // Update current position for next leg
            currentPosition = endPosition;
            // Move to next direction (turn 90° right)
            directionIndex = (directionIndex + 1) % 4;
            legNumber++;
        }
        this._data.targets = targets;
        this.validate();
    }
    /**
     * Generates KML placemarks for each target in the search pattern.
     * @returns An array of KML placemark strings.
     */
    generateKmlPlacemarks() {
        const placemarks = [];
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
    generateKmlPolygons() {
        const polygons = [];
        if (this.targets.length === 0) {
            return polygons;
        }
        // Generate connecting lines between consecutive targets
        for (let i = 0; i < this.targets.length - 1; i++) {
            const currentTarget = this.targets[i];
            const nextTarget = this.targets[i + 1];
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
    generateKml() {
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
exports.ExpandingSquarePattern = ExpandingSquarePattern;
//# sourceMappingURL=ExpandingSquarePattern.js.map