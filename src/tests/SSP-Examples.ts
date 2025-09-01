import { mkdirSync, writeFileSync } from "fs";
import { SectorSearchPattern } from "../lib/models/SectorSearchPattern";
import { Target } from "../lib/models/Target";

const datum = new Target();
datum.name = "Rescue Buoy";
datum.latitude = 25.309029191286708; // Rescue Buoy latitude
datum.longitude = -90.06723415861805; // Rescue Buoy longitude
datum.heading = 0; // Rescue Buoy direction (current/drift direction) north = 0 east = 90 south = 180 west = 270
datum.speed = 2; // Rescue Buoy speed (drift speed knots)

const SearchSpeed = 10; // Rescue vessel speed (knots)
const SearchRadius = 200; // Rescue vessel search radius (meters)
const pattern = new SectorSearchPattern(datum, SearchRadius, SearchSpeed);

mkdirSync('projects/SectorSearchPatterns', { recursive: true });
writeFileSync('projects/SectorSearchPatterns/example-1.kml', pattern.generateKml());
