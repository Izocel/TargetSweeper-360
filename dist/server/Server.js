"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
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
    }
    errorHandler() {
        this.app.use((err, _req, res, _next) => {
            console.error(err.stack);
            res.status(500).json({ error: 'Internal Server Error' });
        });
    }
    start() {
        this.app.listen(this.port, () => {
            console.log(`Server running on http://localhost:${this.port}`);
        });
    }
}
exports.default = Server;
//# sourceMappingURL=Server.js.map