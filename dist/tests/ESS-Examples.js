"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const ExpandingSquarePattern_1 = require("../lib/models/ExpandingSquarePattern");
const Target_1 = require("../lib/models/Target");
const Math_1 = require("../lib/utils/Math");
const ExpandingSquareDatum = new Target_1.Target();
ExpandingSquareDatum.name = "Search Buoy";
ExpandingSquareDatum.heading = (0, Math_1.handleFlooredOverflow)(0, 0, 360);
ExpandingSquareDatum.longitude = (0, Math_1.handleOverflow)(-78.81167, -180, 180);
ExpandingSquareDatum.latitude = (0, Math_1.handleOverflow)(43.58222, -90, 90);
const ExpandingSquareSpeed = 10; // knots
const ExpandingSquareHeight = 40000; // Total search area height in meters
const ExpandingSquareWidth = 60000; // Total search area width in meters
const VesselVisualDistance = 1500; // Effective visual search distance in meters
const data = {
    datum: ExpandingSquareDatum,
    speed: ExpandingSquareSpeed,
    height: ExpandingSquareHeight,
    width: ExpandingSquareWidth,
    vesselVisualDistance: VesselVisualDistance,
    targets: [],
};
const pattern = new ExpandingSquarePattern_1.ExpandingSquarePattern(data);
(0, fs_1.mkdirSync)('projects/ExpandingSquarePatterns', { recursive: true });
(0, fs_1.writeFileSync)('projects/ExpandingSquarePatterns/example-1.kml', pattern.generateKml());
//# sourceMappingURL=ESS-Examples.js.map