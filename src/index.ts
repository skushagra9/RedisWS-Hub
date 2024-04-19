import { WebSocketServer } from 'ws';
import http from 'http';
import { v4 as uuidv4 } from 'uuid';
import { RedisClient } from './subscriber';

const server = http.createServer(function(request: any, response: any) {
  console.log((new Date()) + ' Received request for ' + request.url);
  response.end("hi there");
});

const wss = new WebSocketServer({ server });

const users: {
  [key: string]: {
    room: string;
    ws: any;
  }
} = {};

wss.on('connection', async function connection(ws) {
  const id = uuidv4()

  ws.on('error', console.error);

  ws.on('message', (message) => {
    const data = JSON.parse(message.toString());
    if (data.type === "join") {
      users[id] = {
        room: data.payload.roomId,
        ws
      };
      RedisClient.getInstance().subscribe(id, data.payload.roomId, ws);
    }

    if (data.type === "message") {
      const roomId = users[id].room;
      const message = data.payload.message;
      RedisClient.getInstance().publish(roomId, message);
    }

  });

  ws.send(`Hello! Message From Server!!. id is ${id}`);

  ws.on('close', () => {
    console.log('Client disconnected');
    RedisClient.getInstance().unsubscribe(id, users[id].room);
  });

});
server.listen(8080, function() {
  console.log((new Date()) + ' Server is listening on port 8080');
});

//v1 - what happening was the response was sent to all the users connected to the ws - now the response would only be sent to the person who has entered the message
