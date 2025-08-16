# 🎯 TargetSweeper-360

> **Advanced Tactical Sweep Pattern Generator for Search & Rescue Operations**

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

## 📋 Table of Contents

- [Overview](#-overview)
- [Demo](#-demo)
- [Features](#-features)
- [Quick Start](#-quick-start)
- [Configuration](#-configuration)
- [Label Formats](#-label-formats)
- [Output Files](#-output-files)
- [Project Structure](#-project-structure)
- [API Reference](#-api-reference)
- [Contributing](#-contributing)
- [License](#-license)

## 🌟 Overview

TargetSweeper-360 is a professional-grade tactical sweep pattern generator designed for search and rescue operations, surveillance missions, and systematic area coverage. Generate precise search patterns around target locations with customizable parameters and multiple output formats.

### Key Capabilities

- 🎯 **Precision Targeting** - GPS-accurate coordinate generation
- 📐 **MOA-Based Patterns** - Military-grade angular precision using Minutes of Angle
- 🗺️ **Multiple Formats** - CSV, KML, and KMZ outputs for various mapping platforms
- 🏷️ **8 Label Styles** - From tactical military to descriptive civilian formats
- 📦 **Batch Processing** - Generate multiple projects from configuration files
- ⚡ **High Performance** - Efficient algorithms for large-scale pattern generation

## 🎬 Demo

See the TargetSweeper-360 output in action! This video demonstrates importing a generated KMZ file into Google Earth:

https://github.com/Izocel/TargetSweeper-360/raw/master/Live.mp4

_Video: Demonstration of importing TargetSweeper-360 generated KMZ file into Google Earth with tactical sweep pattern visualization_

**What you'll see in the demo:**

- 🎯 Visualizing the complete sweep pattern around target location
- � Tactical sweep points with MOA-based precision
- 🏷️ Point labels showing distance, direction, and timing
- 🎨 Color-coded rings and styling for operational clarity

---

## ✨ Features

### 🎨 **8 Professional Label Formats**

Choose from multiple labeling styles to match your operational requirements:

| Format               | Example                        | Use Case              |
| -------------------- | ------------------------------ | --------------------- |
| **TACTICAL**         | `NNE-050-1500-0025`            | Military operations   |
| **DESCRIPTIVE**      | `50m NNE @1h (25min/1500MOA)`  | Training & briefings  |
| **CLOCK_NAVIGATION** | `R50 @01:00 NNE (30°/1500MOA)` | Navigation teams      |
| **COMPACT_GRID**     | `NNE50-00:25-1500`             | Radio communications  |
| **BEARING_RANGE**    | `BRG030-RNG050-MOA1500-T0025`  | Artillery & surveying |
| **SEARCH_PATTERN**   | `SP-NNE-050m-00:25-1500MOA`    | Search & rescue       |
| **AVIATION**         | `RADIAL030/050M/1500/0025Z`    | Aviation operations   |
| **SIMPLE**           | `NNE 50m @00:25 (1500MOA)`     | General purpose       |

### 🎯 **Precision Pattern Generation**

- **Concentric Circles** - Systematic radius-based coverage
- **MOA Angular Steps** - Military-standard angular precision (1/60th degree)
- **Customizable Density** - Adjustable radius and angle step sizes
- **GPS Accuracy** - Sub-meter coordinate precision

### 📊 **Multiple Output Formats**

- **CSV** - Raw data for analysis and custom applications
- **KML** - Google Earth and GIS platform compatibility
- **KMZ** - Compressed format with styling and metadata

## 🚀 Quick Start

### Prerequisites

- Node.js 16+
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/TargetSweeper-360.git
cd TargetSweeper-360

# Install dependencies
npm install

# Build the project
npm run build
```

### Basic Usage

```bash
# Generate all projects from configuration
npm run dev

# Development mode with auto-reload
npm run dev:watch
```

### Example Output

```
🎯 TargetSweeper-360 - Project Batch Generation
================================================

📋 Found 1 project(s) to process

🔄 Processing Project 1/1: "Urban Surveillance Zone Alpha"
  📁 Output directory: ./projects/Urban_Surveillance_Zone_Alpha
  📄 Generating CSV: Urban_Surveillance_Zone_Alpha.csv
  📄 Generating KML: Urban_Surveillance_Zone_Alpha.kml
  🗺️  Generating KMZ: Urban_Surveillance_Zone_Alpha.kmz
  ✅ Project completed successfully
     📊 Generated 3,600 sweep points
     🎯 Target: San Francisco Target (37.7749, -122.4194)
     📏 Max Radius: 500m

🎉 All projects generated successfully!
```

## ⚙️ Configuration

### Project Configuration (`conf/projects.json`)

```json
{
  "$schema": "./projects.schema.json",
  "generations": [
    {
      "ProjectName": "Urban Surveillance Zone Alpha",
      "Target": {
        "name": "San Francisco Target",
        "longitude": -122.4194,
        "latitude": 37.7749
      },
      "Sweeper": {
        "radiusStep": 10,
        "maxRadius": 500,
        "angleStepMOA": 300,
        "format": "SIMPLE"
      }
    }
  ]
}
```

### Configuration Parameters

| Parameter              | Type   | Description                          | Example           |
| ---------------------- | ------ | ------------------------------------ | ----------------- |
| `ProjectName`          | string | Human-readable project identifier    | `"Mission Alpha"` |
| `Target.name`          | string | Display name for the target          | `"Primary LZ"`    |
| `Target.longitude`     | number | Target longitude coordinate          | `-122.4194`       |
| `Target.latitude`      | number | Target latitude coordinate           | `37.7749`         |
| `Sweeper.radiusStep`   | number | Distance between rings (meters)      | `10`              |
| `Sweeper.maxRadius`    | number | Maximum search radius (meters)       | `500`             |
| `Sweeper.angleStepMOA` | number | Angular step size (Minutes of Angle) | `300`             |
| `Sweeper.format`       | string | Label format style                   | `"TACTICAL"`      |

## 🏷️ Label Formats

### Military & Tactical

**TACTICAL**: Hyphen-separated military format

```
N-010-0300-0000, NNE-050-1500-0025, E-100-5400-0090
```

**BEARING_RANGE**: Military bearing and range format

```
BRG000-RNG010-MOA0300-T0000, BRG030-RNG050-MOA1500-T0025
```

**AVIATION**: Aviation radial format with Zulu time

```
RADIAL000/010M/0300/0000Z, RADIAL030/050M/1500/0025Z
```

### Navigation & Field Use

**CLOCK_NAVIGATION**: Clock position with bearing

```
R10 @12:00 N (0°/300MOA), R50 @01:00 NNE (30°/1500MOA)
```

**SEARCH_PATTERN**: Search pattern with SP prefix

```
SP-N-010m-00:00-300MOA, SP-NNE-050m-00:25-1500MOA
```

### Communication & Compact

**COMPACT_GRID**: Minimal characters for radio

```
N10-00:00-300, NNE50-00:25-1500, E100-01:30-5400
```

### Training & Documentation

**DESCRIPTIVE**: Human-readable with full context

```
10m N @12h (0min/300MOA), 50m NNE @1h (25min/1500MOA)
```

**SIMPLE**: Clean format for general use

```
N 10m @00:00 (300MOA), NNE 50m @00:25 (1500MOA)
```

## 📄 Output Files

### CSV Format

Raw tabular data with coordinates and metadata:

```csv
Label,Longitude,Latitude,Radius,Angle,MOA,TimeMinutes,Direction
N 10m @00:00 (300MOA),-122.419489,37.774990,10,0.00,300.00,0.00,N
```

### KML Format

Google Earth compatible markup:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
    <Document>
        <name>Target Sweeper - Mission Alpha</name>
        <Placemark>
            <name>N 10m @00:00 (300MOA)</name>
            <Point>
                <coordinates>-122.419489,37.774990,0</coordinates>
            </Point>
        </Placemark>
    </Document>
</kml>
```

### KMZ Format

Compressed KML with enhanced styling:

- Color-coded rings (inner=green, middle=yellow, outer=red)
- Cardinal direction vectors
- Detailed placemark descriptions
- Optimized for Google Earth

## 📁 Project Structure

```
TargetSweeper-360/
├── 📁 conf/                    # Configuration files
│   ├── projects.json           # Project definitions
│   └── projects.schema.json    # JSON schema validation
├── 📁 src/                     # Source code
│   ├── 📁 constants/
│   │   └── 📁 enums/
│   │       └── LabelFormats.ts # Label format definitions
│   ├── 📁 models/              # Data models
│   │   ├── SweepConfiguration.ts
│   │   ├── SweepPoint.ts
│   │   └── Target.ts
│   ├── 📁 services/            # Business logic
│   │   ├── KMZGenerator.ts     # KML/KMZ file generation
│   │   ├── ProjectManager.ts   # Project batch processing
│   │   └── SweepPatternGenerator.ts
│   ├── 📁 utils/               # Utility functions
│   │   ├── DirectionCalculator.ts
│   │   └── GeoCalculator.ts
│   └── index.ts                # Application entry point
├── 📁 projects/                # Generated output files
│   └── 📁 Project_Name/
│       ├── Project_Name.csv
│       ├── Project_Name.kml
│       └── Project_Name.kmz
├── package.json
├── tsconfig.json
└── README.md
```

## 🔧 API Reference

### Core Classes

#### `Target`

Represents a target location with coordinates and metadata.

```typescript
const target = new Target(
  -122.4194, // longitude
  37.7749, // latitude
  "SF Target" // name
);
```

#### `SweepConfiguration`

Defines sweep pattern parameters.

```typescript
const config = new SweepConfiguration(
  10, // radiusStep (meters)
  500, // maxRadius (meters)
  300 // angleStepMOA
);
```

#### `ProjectManager`

Handles batch project generation from configuration files.

```typescript
const manager = new ProjectManager();
const results = await manager.generateAllProjects();
```

#### `KMZGenerator`

Generates KML/KMZ files with tactical styling.

```typescript
const generator = new KMZGenerator(target, config, LabelFormat.TACTICAL);
await generator.generateKMZ("output.kmz");
```

## 🔬 Technical Specifications

### Coordinate System

- **Datum**: WGS84 (World Geodetic System 1984)
- **Precision**: Sub-meter accuracy using double-precision floating point
- **Format**: Decimal degrees

### Angular Measurements

- **Primary Unit**: Minutes of Angle (MOA)
- **Conversion**: 1° = 60 MOA
- **Precision**: 1 MOA ≈ 1.047 inches at 100 yards

### Performance

- **Generation Speed**: ~10,000 points/second
- **Memory Usage**: <50MB for typical patterns
- **File Sizes**: CSV ~100KB, KMZ ~200KB per 1000 points

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Setup

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev:watch

# Run tests
npm test

# Build for production
npm run build
```

### Code Style

- TypeScript with strict type checking
- ESLint configuration included
- Prettier code formatting
- Comprehensive JSDoc documentation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with TypeScript and Node.js
- KML generation inspired by Google Earth standards
- MOA calculations based on military surveying principles
- Geodetic algorithms adapted from standard GIS libraries

---

<div align="center">

**🎯 TargetSweeper-360 - Precision Search Pattern Generation**

_Made with ❤️ for search and rescue professionals_

</div>
