import * as fs from "fs";
import JSZip from 'jszip';
import { Target } from '../models/Target';
import { SweepPoint } from '../models/SweepPoint';
import { SweepConfiguration } from '../models/SweepConfiguration';
import { SweepPatternGenerator } from './SweepPatternGenerator';
import { LabelFormat } from '../constants/enums/LabelFormats';

// 🎨 Style definitions for different sweep rings
export interface PlacemarkStyle {
    iconUrl?: string;
    iconScale?: number;
    iconColor?: string;
    lineColor?: string;
    lineWidth?: number;
    polyColor?: string;
    polyOutline?: boolean;
}

// Legacy interface for backward compatibility
export interface SweepPoint_Legacy {
    lon: number;
    lat: number;
    radius: number;
    angle: number;
    description?: string;
}

export interface SweepConfig {
    target: { lon: number; lat: number; name?: string };
    diameterStep: number;
    angleStep: number;
    maxDiameter: number;
    styles?: {
        target?: PlacemarkStyle;
        innerRing?: PlacemarkStyle;
        middleRing?: PlacemarkStyle;
        outerRing?: PlacemarkStyle;
        cardinalVector?: PlacemarkStyle;
    };
}

export class KMZGenerator {
    private target: Target;
    private config: SweepConfiguration;
    private zip: JSZip;
    private patternGenerator: SweepPatternGenerator;

    constructor(
        target: Target,
        config: SweepConfiguration,
        labelFormat: LabelFormat = LabelFormat.TACTICAL
    ) {
        this.target = target;
        this.config = config;
        this.zip = new JSZip();
        this.patternGenerator = new SweepPatternGenerator(target, config, labelFormat);
    }

    // Legacy constructor for backward compatibility
    static fromLegacyConfig(legacyConfig: SweepConfig): KMZGenerator {
        const target = new Target(
            legacyConfig.target.lon,
            legacyConfig.target.lat,
            legacyConfig.target.name || "Target"
        );

        const config = new SweepConfiguration(
            legacyConfig.diameterStep,
            legacyConfig.maxDiameter,
            legacyConfig.angleStep * 60 // Convert degrees back to MOA
        );

        return new KMZGenerator(target, config, LabelFormat.TACTICAL);
    }

    // 🌍 Earth radius in meters
    private readonly EARTH_RADIUS = 6371000;

    // 📐 Converts meters to degrees (approximate, valid for small distances)
    private offsetInDegrees(meters: number, latitude: number): { dx: number; dy: number } {
        const latRad = (latitude * Math.PI) / 180;
        const dx = (meters / this.EARTH_RADIUS) * (180 / Math.PI) / Math.cos(latRad);
        const dy = (meters / this.EARTH_RADIUS) * (180 / Math.PI);
        return { dx, dy };
    }

    // 🧭 Converts degrees to tactical cardinal direction
    private getTacticalDirection(angle: number): string {
        const normalizedAngle = ((angle % 360) + 360) % 360;

        const directions = [
            { min: 348.75, max: 360, code: "N" },
            { min: 0, max: 11.25, code: "N" },
            { min: 11.25, max: 33.75, code: "NNE" },
            { min: 33.75, max: 56.25, code: "NE" },
            { min: 56.25, max: 78.75, code: "ENE" },
            { min: 78.75, max: 101.25, code: "E" },
            { min: 101.25, max: 123.75, code: "ESE" },
            { min: 123.75, max: 146.25, code: "SE" },
            { min: 146.25, max: 168.75, code: "SSE" },
            { min: 168.75, max: 191.25, code: "S" },
            { min: 191.25, max: 213.75, code: "SSW" },
            { min: 213.75, max: 236.25, code: "SW" },
            { min: 236.25, max: 258.75, code: "WSW" },
            { min: 258.75, max: 281.25, code: "W" },
            { min: 281.25, max: 303.75, code: "WNW" },
            { min: 303.75, max: 326.25, code: "NW" },
            { min: 326.25, max: 348.75, code: "NNW" }
        ];

        for (const dir of directions) {
            if (normalizedAngle >= dir.min && normalizedAngle < dir.max) {
                return dir.code;
            }
        }

        return "N"; // fallback
    }

    // 🏷️ Generate tactical label using SweepPatternGenerator
    private generateTacticalLabel(point: SweepPoint): string {
        return this.patternGenerator.generateLabel(point);
    }

    // 🔁 Generate sweep points using SweepPatternGenerator
    private generateSweepPoints(): SweepPoint[] {
        return this.patternGenerator.generateSweepPoints();
    }

    // 🎨 Generate style definitions
    private generateStyles(): string {
        return `
        <Style id="targetStyle">
            <IconStyle>
                <Icon>
                    <href>http://maps.google.com/mapfiles/kml/shapes/target.png</href>
                </Icon>
                <scale>1.2</scale>
                <color>ff0000ff</color>
            </IconStyle>
            <LabelStyle>
                <scale>1.1</scale>
                <color>ff0000ff</color>
            </LabelStyle>
        </Style>
        
        <Style id="innerRingStyle">
            <IconStyle>
                <Icon>
                    <href>http://maps.google.com/mapfiles/kml/shapes/placemark_circle.png</href>
                </Icon>
                <scale>0.8</scale>
                <color>ff00ff00</color>
            </IconStyle>
        </Style>
        
        <Style id="middleRingStyle">
            <IconStyle>
                <Icon>
                    <href>http://maps.google.com/mapfiles/kml/shapes/placemark_circle.png</href>
                </Icon>
                <scale>0.6</scale>
                <color>ffffff00</color>
            </IconStyle>
        </Style>
        
        <Style id="outerRingStyle">
            <IconStyle>
                <Icon>
                    <href>http://maps.google.com/mapfiles/kml/shapes/placemark_circle.png</href>
                </Icon>
                <scale>0.4</scale>
                <color>ffff0000</color>
            </IconStyle>
        </Style>
        
        <Style id="sweepCircleStyle">
            <LineStyle>
                <color>7f00ffff</color>
                <width>2</width>
            </LineStyle>
            <PolyStyle>
                <color>3f00ffff</color>
                <outline>1</outline>
            </PolyStyle>
        </Style>
        
        <Style id="cardinalVectorStyle">
            <LineStyle>
                <color>ff00ffff</color>
                <width>3</width>
            </LineStyle>
        </Style>`;
    }

    // 🎯 Generate target placemark
    private generateTargetPlacemark(): string {
        return `
        <Placemark>
            <name>${this.target.name || 'Target'}</name>
            <description>Main target location</description>
            <styleUrl>#targetStyle</styleUrl>
            <Point>
                <coordinates>${this.target.longitude},${this.target.latitude},0</coordinates>
            </Point>
        </Placemark>`;
    }

    // 📍 Generate sweep point placemarks
    private generateSweepPlacemarks(points: SweepPoint[]): string {
        return points.map(point => {
            // Determine style based on radius
            let style = 'outerRingStyle';
            if (point.radius <= this.config.maxRadius / 3) {
                style = 'innerRingStyle';
            } else if (point.radius <= (this.config.maxRadius * 2) / 3) {
                style = 'middleRingStyle';
            }

            return `
            <Placemark>
                <name>${this.generateTacticalLabel(point)}</name>
                <description>
                    <![CDATA[
                        <b>Tactical ID:</b> ${this.generateTacticalLabel(point)}<br/>
                        <b>Distance:</b> ${point.radius}m<br/>
                        <b>Bearing:</b> ${point.angle}°<br/>
                        <b>Direction:</b> ${this.getTacticalDirection(point.angle)}<br/>
                        <b>MOA:</b> ${(point.angle * 60).toFixed(0)}<br/>
                        <b>Coordinates:</b> ${point.latitude.toFixed(6)}, ${point.longitude.toFixed(6)}
                    ]]>
                </description>
                <styleUrl>#${style}</styleUrl>
                <Point>
                    <coordinates>${point.longitude},${point.latitude},0</coordinates>
                </Point>
            </Placemark>`;
        }).join('');
    }

    // ➡️ Generate 12 cardinal vector lines
    private generateCardinalVectors(): string {
        const cardinalDirections = [
            { name: 'N', angle: 0 },
            { name: 'NNE', angle: 30 },
            { name: 'NE', angle: 60 },
            { name: 'ENE', angle: 90 },
            { name: 'E', angle: 120 },
            { name: 'ESE', angle: 150 },
            { name: 'SE', angle: 180 },
            { name: 'SSE', angle: 210 },
            { name: 'S', angle: 240 },
            { name: 'SSW', angle: 270 },
            { name: 'SW', angle: 300 },
            { name: 'WSW', angle: 330 }
        ];

        return cardinalDirections.map((direction, index) => {
            const radians = (direction.angle * Math.PI) / 180;
            const { dx, dy } = this.offsetInDegrees(this.config.maxRadius, this.target.latitude);

            // Calculate end point of the vector line
            const endLon = this.target.longitude + dx * Math.cos(radians);
            const endLat = this.target.latitude + dy * Math.sin(radians);

            // Create different colors for different directions
            const colors = [
                'ff0000ff', 'ff0080ff', 'ff00ffff', 'ff00ff80',
                'ff00ff00', 'ff80ff00', 'ffffff00', 'ffff8000',
                'ffff0000', 'ffff0080', 'ffff00ff', 'ff8000ff'
            ];

            return `
            <Placemark>
                <name>Cardinal Vector ${direction.name}</name>
                <description>
                    <![CDATA[
                        <b>Direction:</b> ${direction.name} (${direction.angle}°)<br/>
                        <b>Length:</b> ${this.config.maxRadius}m
                    ]]>
                </description>
                <Style>
                    <LineStyle>
                        <color>${colors[index % colors.length]}</color>
                        <width>3</width>
                    </LineStyle>
                </Style>
                <LineString>
                    <tessellate>1</tessellate>
                    <coordinates>
                        ${this.target.longitude},${this.target.latitude},0
                        ${endLon},${endLat},0
                    </coordinates>
                </LineString>
            </Placemark>`;
        }).join('');
    }

    // ⭕ Generate concentric circles around target
    private generateSweepCircles(): string {
        let circles = '';

        for (let radius = this.config.radiusStep; radius <= this.config.maxRadius; radius += this.config.radiusStep) {
            const circlePoints: string[] = [];

            // Generate circle points
            for (let angle = 0; angle <= 360; angle += 5) { // 5-degree steps for smooth circles
                const radians = (angle * Math.PI) / 180;
                const { dx, dy } = this.offsetInDegrees(radius, this.target.latitude);
                const lon = this.target.longitude + dx * Math.cos(radians);
                const lat = this.target.latitude + dy * Math.sin(radians);
                circlePoints.push(`${lon},${lat},0`);
            }

            circles += `
            <Placemark>
                <name>Sweep Circle ${radius}m</name>
                <description>Search perimeter at ${radius}m from target</description>
                <styleUrl>#sweepCircleStyle</styleUrl>
                <LineString>
                    <tessellate>1</tessellate>
                    <coordinates>
                        ${circlePoints.join('\n                        ')}
                    </coordinates>
                </LineString>
            </Placemark>`;
        }

        return circles;
    }

    // 🗺️ Generate complete KML content
    private generateKML(): string {
        const points = this.generateSweepPoints();

        // Convert to XML manually for better control
        return `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
    <Document>
        <name>Target Sweeper - ${this.target.name || 'Mission'}</name>
        <description>Sweep pattern with ${points.length} points around target location</description>
        
        ${this.generateStyles()}
        ${this.generateTargetPlacemark()}
        ${this.generateCardinalVectors()}
        ${this.generateSweepPlacemarks(points)}
        ${this.generateSweepCircles()}
        
    </Document>
</kml>`;
    }

    // 📦 Generate KMZ file
    async generateKMZ(outputPath: string): Promise<void> {
        const kmlContent = this.generateKML();

        // Add KML to ZIP
        this.zip.file("doc.kml", kmlContent);

        // Optionally add custom icons (you can add your own icon files)
        // this.zip.file("files/target.png", fs.readFileSync("path/to/target.png"));

        // Generate ZIP buffer
        const zipBuffer = await this.zip.generateAsync({
            type: "nodebuffer",
            compression: "DEFLATE",
            compressionOptions: {
                level: 9
            }
        });

        // Write to file
        fs.writeFileSync(outputPath, zipBuffer);
    }

    // 📄 Generate standalone KML file
    generateKMLFile(outputPath: string): void {
        const kmlContent = this.generateKML();
        fs.writeFileSync(outputPath, kmlContent);
    }

    // 📊 Generate CSV file using SweepPatternGenerator
    generateCSVFile(outputPath: string): void {
        const csvContent = this.patternGenerator.generateCSV();
        fs.writeFileSync(outputPath, csvContent);
    }

    // 🎯 Get pattern generator for advanced usage
    getPatternGenerator(): SweepPatternGenerator {
        return this.patternGenerator;
    }
}
