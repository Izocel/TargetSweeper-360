import { mkdirSync, writeFileSync } from "fs";
import { SectorSearchPattern } from "../lib/models/SectorSearchPattern";
import { Target } from "../lib/models/Target";

const SearchBuoy = new Target();
SearchBuoy.name = "Rescue Buoy";
SearchBuoy.latitude = 25.309029191286708; // Rescue Buoy latitude
SearchBuoy.longitude = -90.06723415861805; // Rescue Buoy longitude
SearchBuoy.heading = 0; // Rescue Buoy direction (current/drift direction) north = 0 east = 90 south = 180 west = 270
SearchBuoy.speed = 2; // Rescue Buoy speed (drift speed knots)

const SearchSpeed = 10; // Rescue vessel speed (knots)
const SearchRadius = 200; // Rescue vessel search radius (meters)

const data = {
    datum: SearchBuoy,
    speed: SearchSpeed,
    radius: SearchRadius,
    sectors: [] as Target[][],
}

const pattern = new SectorSearchPattern(data);

mkdirSync('projects/SectorSearchPatterns', { recursive: true });
writeFileSync('projects/SectorSearchPatterns/example-1.kml', pattern.generateKml());
