import express, { Application, Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import cors from 'cors';

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

    }

    private errorHandler() {
        this.app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
            console.error(err.stack);
            res.status(500).json({ error: 'Internal Server Error' });
        });
    }

    public start() {
        this.app.listen(this.port, () => {
            console.log(`Server running on http://localhost:${this.port}`);
        });
    }
}

export default Server;
