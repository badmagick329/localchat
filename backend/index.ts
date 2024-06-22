import { serve, ServerWebSocket } from 'bun';

const clients = new Set<ServerWebSocket>();
const serverPort = process.env.SERVER_PORT;

const server = serve({
  port: serverPort,
  fetch(req, server) {
    if (server.upgrade(req)) {
      return;
    }
    return new Response('WebSocket server is running');
  },
  websocket: {
    open(ws) {
      clients.add(ws);
      console.log('Client connected');
      ws.send('Hi!');
    },
    message(ws, message) {
      console.log('Received message:', message);
      for (const client of clients) {
        client.send(message);
      }
    },
    close(ws) {
      clients.delete(ws);
      console.log('Client disconnected');
    },
  },
});

console.log(`WebSocket server running on port ${server.port}`);
