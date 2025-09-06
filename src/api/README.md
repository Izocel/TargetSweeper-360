# 📡 TargetSweeper-360 API SDK

> **TypeScript/JavaScript Client Library for TargetSweeper-360 Server API**

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)](https://axios-http.com/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)

## 📋 Table of Contents

- [Overview](#-overview)
- [Installation](#-installation)
- [Quick Start](#-quick-start)
- [API Client](#-api-client)
- [Request Models](#-request-models)
- [Usage Examples](#-usage-examples)
- [Error Handling](#-error-handling)
- [Configuration](#-configuration)
- [TypeScript Support](#-typescript-support)
- [Browser Support](#-browser-support)

## 🌟 Overview

The TargetSweeper-360 API SDK provides a clean, type-safe interface for interacting with the TargetSweeper-360 server API. Built with TypeScript and Axios, it offers seamless integration for web applications, Node.js services, and other JavaScript environments.

> **📍 Purpose**: This SDK is specifically for **remote API communication** with the TargetSweeper-360 server. For direct pattern generation and core library functionality, see the [Core Library Documentation](../lib/README.md).

### Key Features

- 🔷 **Full TypeScript Support** - Complete type definitions and IntelliSense
- 🛡️ **Request Validation** - Zod-based schema validation for all requests
- 🌐 **Universal Compatibility** - Works in browsers, Node.js, and React Native
- ⚡ **Promise-based API** - Modern async/await support with Axios
- 🔧 **Configurable** - Custom base URLs, timeouts, and request interceptors
- 📦 **Lightweight** - Minimal dependencies and optimized bundle size

### SDK Capabilities

- 📡 **Remote Pattern Generation** - Generate patterns via server API calls
- 📤 **File Upload/Download** - Handle KML/KMZ file operations
- 🔍 **Project Management** - Retrieve, create, and manage search projects
- ⚙️ **Request Validation** - Automatic validation before API calls
- 🛡️ **Error Handling** - Structured error responses with detailed information

## 📦 Installation

```bash
# npm
npm install targetsweeper-360

# yarn
yarn add targetsweeper-360

# pnpm
pnpm add targetsweeper-360
```

## 🚀 Quick Start

### Basic Setup

```typescript
import { TargetSweeperApi } from "targetsweeper-360";

// Initialize the API client
const api = new TargetSweeperApi("https://localhost:3000");

// Use the Projects API
const result = await api.Projects.get(
  new GetProjectRequest({
    name: "example-1",
    type: "kml",
    output: "content",
  })
);
```

### ES Modules (Browser)

```html
<script type="module">
  import { TargetSweeperApi } from "https://unpkg.com/targetsweeper-360@latest/dist/index.js";

  const api = new TargetSweeperApi("https://your-server.com");
  // Use the API...
</script>
```

### CommonJS (Node.js)

```javascript
const { TargetSweeperApi } = require("targetsweeper-360");

const api = new TargetSweeperApi("https://localhost:3000");
```

## 🔌 API Client

### TargetSweeperApi Class

The main entry point for all API interactions.

```typescript
class TargetSweeperApi {
  constructor(apiUrl: string, config?: AxiosRequestConfig);

  // API endpoints
  public readonly Projects: ProjectsApi;

  // Direct HTTP methods
  public get<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>>;
  public post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>>;
  public put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>>;
  public delete<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>>;
}
```

### Constructor Options

```typescript
const api = new TargetSweeperApi("https://localhost:3000", {
  timeout: 30000, // Request timeout in ms
  headers: {
    Authorization: "Bearer your-token",
    "X-API-Key": "your-api-key",
  },
  httpsAgent: customAgent, // Custom HTTPS agent
  proxy: {
    // Proxy configuration
    host: "proxy.company.com",
    port: 8080,
  },
});
```

### ProjectsApi Class

Handles all project-related operations.

```typescript
class ProjectsApi {
  // Get project by name
  get<T>(request: GetProjectRequest): Promise<AxiosResponse<T>>;

  // Create/update project pattern
  put<T>(request: PutProjectRequest): Promise<AxiosResponse<T>>;

  // Upload KML/KMZ files
  upload<T>(request: UploadProjectRequest): Promise<AxiosResponse<T>>;
}
```

## 📋 Request Models

All request models extend `BaseRequest` and include automatic validation.

### GetProjectRequest

Retrieve project files with various output options.

```typescript
import { GetProjectRequest } from "targetsweeper-360";

const request = new GetProjectRequest({
  name: "mission-alpha", // Required: Project name
  type: "kml", // Optional: "kml", "json", "csv" (default: "kml")
  output: "content", // Optional: "content", "file", "download" (default: "file")
});

// Validation
if (request.isValid) {
  const response = await api.Projects.get(request);
}
```

### PutProjectRequest

Create or update search pattern projects.

```typescript
import { PutProjectRequest } from "targetsweeper-360";

const request = new PutProjectRequest({
  name: "urban-search-alpha",
  target: {
    name: "Landing Zone Alpha",
    latitude: 37.7749,
    longitude: -122.4194,
  },
  sweeperConfigs: {
    type: "SECTOR_SEARCH", // Pattern type
    radiusStep: 25, // Distance between rings (meters)
    maxRadius: 500, // Maximum search radius (meters)
    angleStepMOA: 300, // Angular step in Minutes of Angle
  },
  labelFormat: "TACTICAL", // Optional: Label format (default: "SIMPLE")
});

const response = await api.Projects.put(request);
```

### UploadProjectRequest

Upload KML/KMZ files for processing.

```typescript
import { UploadProjectRequest } from "targetsweeper-360";

// From file input (browser)
const fileInput = document.getElementById("file") as HTMLInputElement;
const file = fileInput.files[0];

const request = new UploadProjectRequest({ file });
const response = await api.Projects.upload(request);

// From file system (Node.js)
import fs from "fs";

const fileBuffer = fs.readFileSync("pattern.kml");
const fileObject = new File([fileBuffer], "pattern.kml", {
  type: "application/vnd.google-earth.kml+xml",
});

const request = new UploadProjectRequest({ file: fileObject });
```

### BaseRequest

All request models inherit from `BaseRequest` for consistent validation.

```typescript
abstract class BaseRequest {
  abstract readonly schema: ZodSchema;
  readonly data?: any;

  get isValid(): boolean;
  get errors(): ZodError | null;

  enforce(): void; // Throws if invalid
  toObject(): object; // Returns validation result
}
```

## 💡 Usage Examples

### Complete Project Workflow

```typescript
import {
  TargetSweeperApi,
  GetProjectRequest,
  PutProjectRequest,
  UploadProjectRequest,
} from "targetsweeper-360";

const api = new TargetSweeperApi("https://localhost:3000");

async function projectWorkflow() {
  try {
    // 1. Create a new search pattern
    const createRequest = new PutProjectRequest({
      name: "coastal-search-2024",
      target: {
        name: "Missing Vessel LKP",
        latitude: 36.9741,
        longitude: -122.0308,
      },
      sweeperConfigs: {
        type: "EXPANDING_SQUARE_SEARCH",
        radiusStep: 50,
        maxRadius: 2000,
        angleStepMOA: 450,
      },
      labelFormat: "SEARCH_PATTERN",
    });

    const created = await api.Projects.put(createRequest);
    console.log("Pattern created:", created.data);

    // 2. Retrieve the generated KML content
    const getRequest = new GetProjectRequest({
      name: "coastal-search-2024",
      type: "kml",
      output: "content",
    });

    const content = await api.Projects.get(getRequest);
    console.log("KML content:", content.data);

    // 3. Download the KMZ file
    const downloadRequest = new GetProjectRequest({
      name: "coastal-search-2024",
      type: "kmz",
      output: "download",
    });

    const download = await api.Projects.get(downloadRequest);
    // Handle file download...
  } catch (error) {
    console.error("Workflow error:", error);
  }
}
```

### API Request Examples

The SDK provides three main request types for interacting with the server:

#### Creating Projects via API

```typescript
// Generate a sector search pattern via API
const createRequest = new PutProjectRequest({
  name: "mission-bravo-2024",
  target: {
    name: "Search Zone Bravo",
    latitude: 40.7128,
    longitude: -74.006,
  },
  sweeperConfigs: {
    type: "SECTOR_SEARCH",
    radiusStep: 30,
    maxRadius: 600,
    angleStepMOA: 300,
  },
  labelFormat: "TACTICAL",
});

const response = await api.Projects.put(createRequest);
console.log("Project created:", response.data);
```

#### Retrieving Projects

```typescript
// Get project content in different formats
const contentRequest = new GetProjectRequest({
  name: "mission-bravo-2024",
  type: "kml",
  output: "content",
});

const kmlContent = await api.Projects.get(contentRequest);

// Download project file
const downloadRequest = new GetProjectRequest({
  name: "mission-bravo-2024",
  type: "kmz",
  output: "download",
});

const fileResponse = await api.Projects.get(downloadRequest);
```

#### File Upload Operations

```typescript
// Upload existing KML/KMZ files
const fileInput = document.getElementById("file") as HTMLInputElement;
const file = fileInput.files[0];

const uploadRequest = new UploadProjectRequest({ file });
const uploadResponse = await api.Projects.upload(uploadRequest);

console.log("File uploaded:", uploadResponse.data);
```

### File Upload Handling

```typescript
// Browser file upload with progress
async function uploadWithProgress(file: File) {
  const request = new UploadProjectRequest({ file });

  const response = await api.Projects.upload(request, {
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      console.log(`Upload progress: ${percentCompleted}%`);
    },
  });

  return response.data;
}

// Multiple file validation
function validateFiles(files: FileList): File[] {
  const validFiles: File[] = [];
  const allowedTypes = [
    "application/vnd.google-earth.kml+xml",
    "application/vnd.google-earth.kmz",
  ];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (allowedTypes.includes(file.type)) {
      validFiles.push(file);
    } else {
      console.warn(`Invalid file type: ${file.type}`);
    }
  }

  return validFiles;
}
```

## ⚠️ Error Handling

### API Errors

```typescript
import { AxiosError } from "axios";

try {
  const response = await api.Projects.get(request);
} catch (error) {
  if (error instanceof AxiosError) {
    // HTTP errors
    console.error("Status:", error.response?.status);
    console.error("Data:", error.response?.data);
    console.error("Headers:", error.response?.headers);
  } else {
    // Network or other errors
    console.error("Error:", error.message);
  }
}
```

### Request Validation Errors

```typescript
const request = new PutProjectRequest({
  name: "", // Invalid: empty name
  target: {
    name: "Target",
    latitude: "invalid", // Invalid: string instead of number
    longitude: -122.4194,
  },
  // Missing required sweeperConfigs
});

if (!request.isValid) {
  console.error("Validation errors:", request.errors);
  // Handle validation errors...
} else {
  // Proceed with valid request
  const response = await api.Projects.put(request);
}
```

## 🔷 TypeScript Support

### Type Definitions

```typescript
// Import types for better development experience
import type {
  GetProjectResponse,
  PutProjectResponse,
  UploadProjectResponse,
  PatternType,
  LabelFormat,
  SweeperConfigs,
  Target,
} from "targetsweeper-360";

// Strongly typed responses
const response: AxiosResponse<GetProjectResponse> = await api.Projects.get(
  request
);
const projectData: GetProjectResponse = response.data;
```

### Generic Type Support

```typescript
// Specify response type
interface CustomProjectData {
  id: string;
  name: string;
  createdAt: Date;
}

const response = await api.Projects.get<CustomProjectData>(request);
const customData: CustomProjectData = response.data;
```

### Enum Types

```typescript
import { PatternTypes, LabelFormats } from "targetsweeper-360";

// Use enums for type safety
const patternType: PatternTypes = PatternTypes.SECTOR_SEARCH;
const labelFormat: LabelFormats = LabelFormats.TACTICAL;

const request = new PutProjectRequest({
  name: "typed-project",
  target: { name: "Target", latitude: 0, longitude: 0 },
  sweeperConfigs: {
    type: patternType,
    radiusStep: 25,
    maxRadius: 500,
    angleStepMOA: 300,
  },
  labelFormat: labelFormat,
});
```

## 🌐 Browser Support

### Modern Browsers (ES2018+)

```html
<!DOCTYPE html>
<html>
  <head>
    <title>TargetSweeper-360 Web App</title>
  </head>
  <body>
    <script type="module">
      import {
        TargetSweeperApi,
        PutProjectRequest,
      } from "https://unpkg.com/targetsweeper-360@latest/dist/index.js";

      const api = new TargetSweeperApi("https://localhost:3000");

      async function generatePattern() {
        const request = new PutProjectRequest({
          name: "web-pattern",
          target: {
            name: "Web Target",
            latitude: 37.7749,
            longitude: -122.4194,
          },
          sweeperConfigs: {
            type: "SECTOR_SEARCH",
            radiusStep: 25,
            maxRadius: 500,
            angleStepMOA: 300,
          },
        });

        try {
          const response = await api.Projects.put(request);
          console.log("Pattern generated:", response.data);
        } catch (error) {
          console.error("Error:", error);
        }
      }

      // Expose to global scope
      window.generatePattern = generatePattern;
    </script>

    <button onclick="generatePattern()">Generate Pattern</button>
  </body>
</html>
```

### Legacy Browser Support (ES5)

For legacy browsers, use a bundler like Webpack or Rollup with Babel:

```javascript
// webpack.config.js
module.exports = {
  entry: "./src/index.js",
  target: ["web", "es5"],
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
};
```

### React Integration

```typescript
import React, { useState, useCallback } from "react";
import { TargetSweeperApi, PutProjectRequest } from "targetsweeper-360";

const api = new TargetSweeperApi(
  process.env.REACT_APP_API_URL || "https://localhost:3000"
);

export const PatternGenerator: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const generatePattern = useCallback(async () => {
    setLoading(true);
    try {
      const request = new PutProjectRequest({
        name: `pattern-${Date.now()}`,
        target: {
          name: "React Target",
          latitude: 37.7749,
          longitude: -122.4194,
        },
        sweeperConfigs: {
          type: "SECTOR_SEARCH",
          radiusStep: 25,
          maxRadius: 500,
          angleStepMOA: 300,
        },
        labelFormat: "SIMPLE",
      });

      const response = await api.Projects.put(request);
      setResult(response.data);
    } catch (error) {
      console.error("Error generating pattern:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div>
      <button onClick={generatePattern} disabled={loading}>
        {loading ? "Generating..." : "Generate Pattern"}
      </button>
      {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
    </div>
  );
};
```

---

## 📚 Related Documentation

- [Core Library Documentation](../lib/README.md) - Pattern generation algorithms, direct usage, and mathematical models
- [Server API Documentation](../server/README.md) - Express server setup, endpoints, and authentication
- [Main Project README](../../README.md) - Project overview, installation, and getting started
- [Request Models](./ProjectsApi.ts) - API client implementation details

---

<div align="center">

**📡 TargetSweeper-360 API SDK**

_TypeScript/JavaScript Client Library for Advanced Search Pattern Generation_

[GitHub Repository](https://github.com/Izocel/TargetSweeper-360) • [Server API Docs](../server/README.md) • [Main README](../../README.md)

Made with ❤️ by [Izocel](https://github.com/Izocel)

</div>
