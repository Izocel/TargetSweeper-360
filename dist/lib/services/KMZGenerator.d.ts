import { Target } from '../models/Target';
import { SweepConfiguration } from '../models/SweepConfiguration';
import { SweepPatternGenerator } from './SweepPatternGenerator';
import { LabelFormat } from '../constants/enums/LabelFormats';
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
export declare class KMZGenerator {
    private target;
    private config;
    private zip;
    private patternGenerator;
    constructor(target: Target, config: SweepConfiguration, labelFormat?: LabelFormat);
    static fromLegacyConfig(legacyConfig: SweepConfig): KMZGenerator;
    private readonly EARTH_RADIUS;
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
    generateKMZ(outputPath: string): Promise<void>;
    generateKMLFile(outputPath: string): void;
    generateCSVFile(outputPath: string): void;
    getPatternGenerator(): SweepPatternGenerator;
}
