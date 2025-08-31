import Server from './Server';

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const https = process.env.HTTPS ? Boolean(process.env.HTTPS) : true;

const server = new Server(port);
server.start(https);