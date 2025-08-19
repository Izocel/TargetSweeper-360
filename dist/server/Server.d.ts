declare class Server {
    private app;
    private port;
    constructor(port?: number);
    private middlewares;
    private routes;
    private errorHandler;
    start(): void;
}
export default Server;
