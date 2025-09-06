"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const ParallelTrackPattern_1 = require("../lib/models/ParallelTrackPattern");
const Target_1 = require("../lib/models/Target");
const Math_1 = require("../lib/utils/Math");
const ParallelTrackVector = new Target_1.Target();
ParallelTrackVector.stepDistance = 42000; // meters
ParallelTrackVector.heading = (0, Math_1.handleFlooredOverflow)(0, 0, 360); //63
ParallelTrackVector.latitude = (0, Math_1.handleOverflow)(43.30186, -90, 90);
ParallelTrackVector.longitude = (0, Math_1.handleOverflow)(-79.78602, -180, 180);
const ParallelTrackSpeed = 10; // knots/s
const ParallelTrackSpacing = 1500; // meters
const ParallelTrackHeight = 10000; // meters
const ParallelTrackTargets = [];
const data = {
    speed: ParallelTrackSpeed,
    height: ParallelTrackHeight,
    vector: ParallelTrackVector,
    targets: ParallelTrackTargets,
    spacing: ParallelTrackSpacing,
};
const pattern = new ParallelTrackPattern_1.ParallelTrackPattern(data);
(0, fs_1.mkdirSync)('projects/ParallelTrackPatterns', { recursive: true });
(0, fs_1.writeFileSync)('projects/ParallelTrackPatterns/example-1.kml', pattern.generateKml());
//# sourceMappingURL=PTS-Examples.js.map