import Server from './Server';

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const server = new Server(port);
server.start();
