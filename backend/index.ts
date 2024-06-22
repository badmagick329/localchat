import { serve } from 'bun';

const serverPort = process.env.SERVER_PORT;
let users: string[] = [];
const messages: string[] = [];

type WebSocketData = {
  type: string;
  sender: string;
  data: string;
};

const server = serve<WebSocketData>({
  port: serverPort,
  fetch(req, server) {
    const newUser = `User_${users.length}`;
    if (
      server.upgrade(req, {
        data: {
          type: 'assign_user',
          sender: 'server',
          data: newUser,
        },
      })
    ) {
      return;
    }
    return new Response('WebSocket server is running');
  },
  websocket: {
    open(ws) {
      const username = ws.data.data;
      users.push(username);
      ws.subscribe('chat');
      ws.subscribe('notification');
      ws.send(
        JSON.stringify({
          type: 'set_user',
          sender: 'server',
          data: username,
        })
      );
      server.publish(
        'chat',
        JSON.stringify({
          type: 'message',
          sender: 'server',
          data: `${username} joined`,
        })
      );
      // clients.add(ws);
      console.log('Client connected');
      console.log(ws.data);
      console.log('users:', users);
    },
    message(ws, data) {
      console.log('Received message:', data);
      // @ts-expect-error - ignore
      const parsed = JSON.parse(data) as WebSocketData;

      if (parsed.type === 'message') {
        messages.push(`${parsed.sender}: ${parsed.data}`);
        server.publish(
          'chat',
          JSON.stringify({
            type: 'message',
            sender: parsed.sender,
            data: parsed.data,
          })
        );
      } else if (parsed.type === 'notification') {
        server.publish(
          'chat',
          JSON.stringify({
            type: 'notification',
            sender: parsed.sender,
            data: '',
          })
        );
      }
    },
    close(ws) {
      console.log('Client disconnected');
      ws.unsubscribe('chat');
      users = users.filter((user) => user !== ws.data.data);
      server.publish(
        'chat',
        JSON.stringify({
          type: 'message',
          sender: 'server',
          data: `${ws.data.data} left`,
        })
      );
    },
  },
});

console.log(`WebSocket server running on port ${server.port}`);
