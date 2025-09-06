# 🌐 TargetSweeper-360 Server

> **RESTful API Server for Advanced Search Pattern Generation**

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)](https://expressjs.com/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)

## 📋 Table of Contents

- [Overview](#-overview)
- [Quick Start](#-quick-start)
- [API Endpoints](#-api-endpoints)
- [Request Models](#-request-models)
- [API Client Usage](#-api-client-usage)
- [Authentication](#-authentication)
- [Error Handling](#-error-handling)
- [File Uploads](#-file-uploads)
- [CORS Configuration](#-cors-configuration)
- [SSL/HTTPS Setup](#-ssl-https-setup)
- [Development](#-development)

## 🌟 Overview

The TargetSweeper-360 Server API provides a full-featured REST API for remote pattern generation and project management. Built with Express.js and TypeScript, it offers secure HTTPS endpoints for generating tactical search patterns, managing projects, and handling file uploads.

### Key Features

- 🔗 **RESTful API** - Standard HTTP methods with JSON responses
- 🔒 **HTTPS Support** - Secure connections with SSL/TLS certificates
- 📁 **Project Management** - Upload, store, and manage search projects
- 📤 **File Processing** - Handle KML/KMZ uploads and conversions
- 🌐 **CORS Support** - Cross-origin resource sharing for web applications
- ⚡ **High Performance** - Efficient request handling and validation
- 🛡️ **Request Validation** - Zod-based schema validation for all endpoints

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ (22+ recommended)
- npm or yarn package manager

### Installation & Setup

```bash
# Install dependencies
npm install

# Generate SSL certificates (for HTTPS)
npm run certs

# Start development server
npm run dev:server

# Start production server
npm run start:server
```

The server will be available at:

- **Development**: `http://localhost:3000` or `https://localhost:3000`
- **Production**: `https://localhost:3000`

## 🔌 API Endpoints

### Projects Management

| Method | Endpoint               | Description                       | Request Model          |
| ------ | ---------------------- | --------------------------------- | ---------------------- |
| GET    | `/api/projects`        | Get project by name (query param) | `GetProjectRequest`    |
| PUT    | `/api/projects`        | Generate/update project pattern   | `PutProjectRequest`    |
| PUT    | `/api/projects/upload` | Upload KML/KMZ files              | `UploadProjectRequest` |

### GET /api/projects

Retrieve project files by name with various output options.

**Query Parameters:**

- `name` (string, required) - Project name to retrieve
- `type` (string, optional) - File type: `"kml"`, `"json"`, `"csv"` (default: `"kml"`)
- `output` (string, optional) - Output format: `"content"`, `"file"`, `"download"` (default: `"file"`)

**Example:**

```http
GET /api/projects?name=example-1&type=kml&output=content
```

### PUT /api/projects

Generate or update a search pattern project.

**Request Body:**

```json
{
  "name": "Urban_Search_Alpha",
  "target": {
    "name": "Primary LZ",
    "latitude": 37.7749,
    "longitude": -122.4194
  },
  "sweeperConfigs": {
    "type": "SECTOR_SEARCH",
    "radiusStep": 25,
    "maxRadius": 500,
    "angleStepMOA": 300
  },
  "labelFormat": "TACTICAL"
}
```

### PUT /api/projects/upload

Upload KML/KMZ files for processing.

**Content-Type:** `multipart/form-data`
**Form Field:** `file` - The KML/KMZ file to upload

## 📋 Request Models

### GetProjectRequest

Schema for retrieving projects:

```typescript
{
  name: string;        // Project name (max 100 chars)
  type?: string;       // File type (default: "kml")
  output?: string;     // Output format (default: "file")
}
```

### PutProjectRequest

Schema for creating/updating projects:

```typescript
{
  name: string;
  target: {
    name: string;
    latitude: number;
    longitude: number;
  };
  sweeperConfigs: {
    type: PatternType;
    radiusStep: number;
    maxRadius: number;
    angleStepMOA: number;
  };
  labelFormat?: LabelFormat; // Optional (default: "SIMPLE")
}
```

### UploadProjectRequest

Schema for file uploads:

```typescript
{
  file: MulterFile; // Uploaded file object
}
```

## 💻 API Client Usage

### TypeScript/JavaScript Client

```typescript
import {
  TargetSweeperApi,
  GetProjectRequest,
  PutProjectRequest,
  UploadProjectRequest,
} from "targetsweeper-360";

const api = new TargetSweeperApi("https://localhost:3000");

// Get an existing project by name
const getRequest = new GetProjectRequest({
  name: "example-1",
  type: "kml",
  output: "content",
});
const project = await api.Projects.get(getRequest);

// Generate a new search pattern
const putRequest = new PutProjectRequest({
  name: "Urban_Search_Alpha",
  target: {
    name: "Primary LZ",
    latitude: 37.7749,
    longitude: -122.4194,
  },
  sweeperConfigs: {
    type: "SECTOR_SEARCH",
    radiusStep: 25,
    maxRadius: 500,
    angleStepMOA: 300,
  },
  labelFormat: "TACTICAL",
});
const generated = await api.Projects.put(putRequest);

// Upload a KML/KMZ file
const uploadRequest = new UploadProjectRequest({ file: fileBuffer });
const uploaded = await api.Projects.upload(uploadRequest);

// Download project files
const downloadRequest = new GetProjectRequest({
  name: "Urban_Search_Alpha",
  type: "kml",
  output: "download",
});
const fileDownload = await api.Projects.get(downloadRequest);
```

### cURL Examples

```bash
# Get project content
curl -X GET "https://localhost:3000/api/projects?name=example-1&type=kml&output=content"

# Generate new pattern
curl -X PUT "https://localhost:3000/api/projects" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test_Pattern",
    "target": {
      "name": "Target Alpha",
      "latitude": 37.7749,
      "longitude": -122.4194
    },
    "sweeperConfigs": {
      "type": "SECTOR_SEARCH",
      "radiusStep": 25,
      "maxRadius": 500,
      "angleStepMOA": 300
    },
    "labelFormat": "TACTICAL"
  }'

# Upload file
curl -X PUT "https://localhost:3000/api/projects/upload" \
  -F "file=@pattern.kml"
```

## 🔐 Authentication

Currently, the API operates without authentication for development purposes. For production deployments, consider implementing:

- **API Keys** - Simple token-based authentication
- **JWT Tokens** - JSON Web Tokens for stateless authentication
- **OAuth 2.0** - Industry-standard authorization framework
- **Basic Auth** - Username/password authentication

## ⚠️ Error Handling

The API uses standard HTTP status codes and returns structured error responses:

### Success Responses

- `200 OK` - Request successful
- `201 Created` - Resource created successfully

### Error Responses

- `400 Bad Request` - Invalid request data or validation errors
- `404 Not Found` - Project or resource not found
- `500 Internal Server Error` - Server-side errors

### Error Response Format

```json
{
  "error": "Validation failed",
  "message": "Invalid project configuration",
  "details": {
    "field": "target.latitude",
    "issue": "Expected number, received string"
  }
}
```

## 📤 File Uploads

### Supported Formats

- **KML** - Keyhole Markup Language files
- **KMZ** - Compressed KML files
- **Maximum Size** - 10MB per file (configurable)

### Upload Configuration

```typescript
// Multer configuration in FileUploadsHandler
const upload = multer({
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/vnd.google-earth.kml+xml",
      "application/vnd.google-earth.kmz",
    ];
    cb(null, allowedTypes.includes(file.mimetype));
  },
});
```

## 🌐 CORS Configuration

The server supports Cross-Origin Resource Sharing (CORS) for web applications:

```typescript
// CORS configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "PUT", "POST", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
```

### Environment Variables

| Variable      | Default | Description              |
| ------------- | ------- | ------------------------ |
| `CORS_ORIGIN` | `*`     | Allowed origins for CORS |
| `PORT`        | `3000`  | Server port number       |
| `HTTPS`       | `true`  | Enable HTTPS server      |
| `NODE_ENV`    | `dev`   | Environment mode         |

## 🔒 SSL/HTTPS Setup

### Self-Signed Certificates (Development)

```bash
# Generate certificates using provided script
npm run certs

# Or manually with OpenSSL
openssl req -x509 -newkey rsa:4096 -keyout certs/key.pem -out certs/cert.pem -days 365 -nodes
```

### Production Certificates

For production, use certificates from a trusted Certificate Authority:

```bash
# Mount certificates in Docker
docker run -v /path/to/certs:/app/certs targetsweeper-360

# Or place certificates in the certs/ directory
cp your-cert.pem certs/cert.pem
cp your-key.pem certs/key.pem
```

### Certificate Configuration

```typescript
// Server.ts HTTPS configuration
const options = {
  key: fs.readFileSync("certs/key.pem"),
  cert: fs.readFileSync("certs/cert.pem"),
};

const server = https.createServer(options, app);
```

## 🛠️ Development

### Project Structure

```
src/server/
├── index.ts                    # Server entry point
├── Server.ts                   # Express server setup
├── controllers/
│   └── ProjectController.ts    # Request handlers
├── requests/
│   ├── BaseRequest.ts         # Base request validation
│   ├── GetProjectRequest.ts   # Get project schema
│   ├── PutProjectRequest.ts   # Put project schema
│   └── UploadProjectRequest.ts # Upload schema
├── routes/
│   └── ProjectRoutes.ts       # API route definitions
├── storages/
│   └── FileUploadsHandler.ts  # File upload handling
└── README.md                  # This file
```

### Development Scripts

```bash
# Start development server with hot reload
npm run dev:server

# Start production server
npm run start:server

# Build TypeScript
npm run build

# Run tests
npm test

# Generate SSL certificates
npm run certs
```

### Adding New Endpoints

1. **Define Request Model** in `requests/`
2. **Add Controller Method** in `controllers/`
3. **Register Route** in `routes/`
4. **Update API Client** in `../api/`

Example:

```typescript
// 1. requests/NewRequest.ts
export class NewRequest extends BaseRequest {
  readonly schema = z.object({
    // Define schema
  });
}

// 2. controllers/ProjectController.ts
static async newMethod(req: Request, res: Response, next: NextFunction) {
  try {
    const request = new NewRequest(req.body);
    // Handle request
  } catch (error) {
    next(error);
  }
}

// 3. routes/ProjectRoutes.ts
router.route('/new-endpoint')
  .post(ProjectController.newMethod);
```

### Environment Configuration

Create a `.env` file for local development:

```env
PORT=3000
HTTPS=true
NODE_ENV=development
CORS_ORIGIN=http://localhost:3001
```

### Logging

The server uses Morgan for HTTP request logging:

```typescript
// Development logging
app.use(morgan("dev"));

// Production logging
app.use(morgan("combined"));
```

---

## 📚 Related Documentation

- [Main Project README](../../README.md) - Complete project overview
- [API Client Documentation](../api/README.md) - Client library usage
- [Pattern Generation](../lib/README.md) - Core pattern algorithms
- [Docker Deployment](../../docker-compose.yml) - Container setup

---

<div align="center">

**🌐 TargetSweeper-360 Server API**

_RESTful API for Advanced Search Pattern Generation_

[GitHub Repository](https://github.com/Izocel/TargetSweeper-360) • [Main README](../../README.md) • [Contributing Guidelines](../../CONTRIBUTING.md)

Made with ❤️ by [Izocel](https://github.com/Izocel)

</div>
