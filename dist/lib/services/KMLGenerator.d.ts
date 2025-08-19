import { LabelFormat } from '../constants/enums/LabelFormats';
import { SweepConfiguration } from '../models/SweepConfiguration';
import { Target } from '../models/Target';
import { SweepPatternGenerator } from './SweepPatternGenerator';
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
    constructor(target: Target, config: SweepConfiguration, labelFormat?: LabelFormat);
    private offsetInDegrees;
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
    getPatternGenerator(): SweepPatternGenerator;
}
