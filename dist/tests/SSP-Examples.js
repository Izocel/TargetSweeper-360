"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const SectorSearchPattern_1 = require("../lib/models/SectorSearchPattern");
const Target_1 = require("../lib/models/Target");
const datum = new Target_1.Target();
datum.name = "Rescue Buoy";
datum.latitude = 25.309029191286708; // Rescue Buoy latitude
datum.longitude = -90.06723415861805; // Rescue Buoy longitude
datum.heading = 0; // Rescue Buoy direction (current/drift direction) north = 0 east = 90 south = 180 west = 270
datum.speed = 2; // Rescue Buoy speed (drift speed knots)
const SearchSpeed = 10; // Rescue vessel speed (knots)
const SearchRadius = 200; // Rescue vessel search radius (meters)
const pattern = new SectorSearchPattern_1.SectorSearchPattern(datum, SearchRadius, SearchSpeed);
(0, fs_1.mkdirSync)('projects/SectorSearchPatterns', { recursive: true });
(0, fs_1.writeFileSync)('projects/SectorSearchPatterns/example-1.kml', pattern.generateKml());
//# sourceMappingURL=SSP-Examples.js.map