

import cors from 'cors';
import express, { Application, NextFunction, Request, Response, Router } from 'express';
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

    public start() {
        this.app.listen(this.port, () => {
            console.log(`HTTP server running on localhost:${this.port}`);
        });
    }
}

export default Server;
