"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importStar(require("express"));
const fs_1 = __importDefault(require("fs"));
const https_1 = __importDefault(require("https"));
const morgan_1 = __importDefault(require("morgan"));
const ProjectRoutes_1 = __importDefault(require("./routes/ProjectRoutes"));
class Server {
    constructor(port = 3000) {
        this.app = (0, express_1.default)();
        this.port = port;
        this.middlewares();
        this.routes();
        this.errorHandler();
    }
    middlewares() {
        this.app.use(express_1.default.json());
        this.app.use((0, morgan_1.default)('dev'));
        this.app.use((0, cors_1.default)());
    }
    routes() {
        this.app.get('/', (_req, res) => {
            res.json({ message: 'Welcome to TargetSweeper-360 API!' });
        });
        const router = (0, express_1.Router)();
        ProjectRoutes_1.default.register(router);
        this.app.use('/api', router);
    }
    errorHandler() {
        this.app.use((err, _req, res, _next) => {
            console.error(err.stack);
            res.status(500).json({ error: 'Internal Server Error' });
        });
    }
    start() {
        const keyPath = __dirname + '/certs/key.pem';
        const certPath = __dirname + '/certs/cert.pem';
        if (fs_1.default.existsSync(keyPath) && fs_1.default.existsSync(certPath)) {
            const key = fs_1.default.readFileSync(keyPath);
            const cert = fs_1.default.readFileSync(certPath);
            https_1.default.createServer({ key, cert }, this.app).listen(this.port, () => {
                console.log(`HTTPS server running on https://localhost:${this.port}`);
            });
        }
        else {
            console.error('SSL certificate or key not found. Run the certificate generation script first.');
            process.exit(1);
        }
    }
}
exports.default = Server;
//# sourceMappingURL=Server.js.map