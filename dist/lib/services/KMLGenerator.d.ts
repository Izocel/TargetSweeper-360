import z from "zod";
import { LabelFormat } from '../constants/enums/LabelFormats';
import { SweeperConfigs } from "../models/SweeperConfigs";
import { Target } from '../models/Target';
import { PatternGenerator } from './PatternGenerator';
export interface PlacemarkStyle {
    iconUrl?: string;
    iconScale?: number;
    iconColor?: string;
    lineColor?: string;
    lineWidth?: number;
    polyColor?: string;
    polyOutline?: boolean;
}
export interface SweepPoint_Legacy {
    lon: number;
    lat: number;
    radius: number;
    angle: number;
    description?: string;
}
export interface SweepConfig {
    target: {
        lon: number;
        lat: number;
        name?: string;
    };
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
export declare class KMLGenerator {
    private zip;
    private target;
    private config;
    private patternGenerator;
    static readonly Schema: z.ZodObject<{
        target: z.ZodObject<{
            name: z.ZodString;
            longitude: z.ZodNumber;
            latitude: z.ZodNumber;
            altitude: z.ZodNumber;
            heading: z.ZodNumber;
            speed: z.ZodNumber;
            accuracy: z.ZodNumber;
            altitudeAccuracy: z.ZodNumber;
            stepTime: z.ZodNumber;
            stepSpeed: z.ZodNumber;
            stepHeading: z.ZodNumber;
            stepDistance: z.ZodNumber;
        }, z.core.$strip>;
        config: z.ZodObject<{
            radiusStep: z.ZodNumber;
            maxRadius: z.ZodNumber;
            angleStepMOA: z.ZodNumber;
            angleStepDegrees: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>;
        labelFormat: z.ZodEnum<typeof LabelFormat>;
    }, z.core.$strip>;
    constructor(target: Target, config: SweeperConfigs, labelFormat?: LabelFormat);
    getPatternGenerator(): PatternGenerator;
    private getTacticalDirection;
    private generateTacticalLabel;
    private generateSweepPoints;
    private generateStyles;
    private generateTargetPlacemark;
    private generateSweepPlacemarks;
    private generateCardinalVectors;
    private generateSweepCircles;
    private generateKML;
    generateKMZ(outputPath: string): Promise<{
        content: Buffer;
        path: string;
    }>;
    generateKMLFile(outputPath: string): {
        content: string;
        path: string;
    };
    generateCSVFile(outputPath: string): {
        content: string;
        path: string;
    };
    generateJsonFile(outputPath: string, configs: any): {
        content: string;
        path: string;
    };
    generateAllFiles(outputPath: string, configs: any): Promise<{
        content: string | Buffer;
        path: string;
    }[]>;
}
