"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const SectorSearchPattern_1 = require("../lib/models/SectorSearchPattern");
const Target_1 = require("../lib/models/Target");
const Math_1 = require("../lib/utils/Math");
const SearchBuoy = new Target_1.Target();
SearchBuoy.name = "Rescue Buoy";
SearchBuoy.speed = 2; // Rescue Buoy speed (drift speed knots)
SearchBuoy.heading = (0, Math_1.handleFlooredOverflow)(0, 0, 360); // Rescue Buoy direction
SearchBuoy.latitude = (0, Math_1.handleOverflow)(25.309029191286708, -90, 90); // Rescue Buoy latitude
SearchBuoy.longitude = (0, Math_1.handleOverflow)(-90.06723415861805, -180, 180); // Rescue Buoy longitude
const SearchSpeed = 10; // Rescue vessel speed (knots)
const SearchRadius = 1500; // Rescue vessel search radius (meters)
const data = {
    datum: SearchBuoy,
    speed: SearchSpeed,
    radius: SearchRadius,
    sectors: [],
};
const pattern = new SectorSearchPattern_1.SectorSearchPattern(data);
(0, fs_1.mkdirSync)('projects/SectorSearchPatterns', { recursive: true });
(0, fs_1.writeFileSync)('projects/SectorSearchPatterns/example-1.kml', pattern.generateKml());
//# sourceMappingURL=SSP-Examples.js.map