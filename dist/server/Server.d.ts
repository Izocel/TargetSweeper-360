declare class Server {
    private app;
    private port;
    constructor(port?: number);
    private middlewares;
    private routes;
    private errorHandler;
    start(useHttps?: boolean): void;
    private startHttp;
    private startHttps;
}
export default Server;
