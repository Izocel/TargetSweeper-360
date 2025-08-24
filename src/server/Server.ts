

import cors from 'cors';
import express, { Application, NextFunction, Request, Response, Router } from 'express';

import fs from 'fs';
import https from 'https';
import morgan from 'morgan';
import ProjectRoutes from './routes/ProjectRoutes';

class Server {
    private app: Application;
    private port: number;

    constructor(port: number = 3000) {
        this.app = express();
        this.port = port;
        this.middlewares();
        this.routes();
        this.errorHandler();
    }

    private middlewares() {
        this.app.use(express.json());
        this.app.use(morgan('dev'));
        this.app.use(cors());
    }

    private routes() {
        this.app.get('/', (_req: Request, res: Response) => {
            res.json({ message: 'Welcome to TargetSweeper-360 API!' });
        });

        const router = Router();
        ProjectRoutes.register(router);
        this.app.use('/api', router);
    }

    private errorHandler() {
        this.app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
            console.error(err.stack);
            res.status(500).json({ error: 'Internal Server Error' });
        });
    }

    public start(useHttps: boolean = true) {
        if (useHttps) {
            this.startHttps();
        } else {
            this.startHttp();
        }
    }

    private startHttp() {
        this.app.listen(this.port, () => {
            console.log(`HTTP server running on http://localhost:${this.port}`);
        });
    }

    private startHttps() {
        const keyPath = 'certs/key.pem';
        const certPath = 'certs/cert.pem';
        if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
            const key = fs.readFileSync(keyPath);
            const cert = fs.readFileSync(certPath);
            https.createServer({ key, cert }, this.app).listen(this.port, () => {
                console.log(`HTTPS server running on https://localhost:${this.port}`);
            });
        } else {
            console.error('SSL certificate or key not found. Please mount your certs directory.');
            process.exit(1);
        }
    }
}

export default Server;
