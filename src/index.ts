import { WebSocketServer } from 'ws';
import http from 'http';
import { createClient } from "redis";
import { v4 as uuidv4 } from 'uuid';

const server = http.createServer(function(request: any, response: any) {
  console.log((new Date()) + ' Received request for ' + request.url);
  response.end("hi there");
});

const wss = new WebSocketServer({ server });

wss.on('connection', async function connection(ws) {
  const client = createClient();
  const subscriber = createClient();
  await subscriber.connect()
  await client.connect()
  const id = uuidv4()

  subscriber.subscribe(id, function(messages, channel) {
    const messageData = JSON.parse(messages).data;
    const message = Buffer.from(messageData.data).toString('utf-8');
    console.log(`Received message from channel ${channel}: ${message}`);
    ws.send(message)
  });

  ws.on('error', console.error);

  ws.on('message', function message(data, isBinary) {
    client.publish(id, JSON.stringify({ data }));
  });

  ws.send(`Hello! Message From Server!!. id is ${id}`);

  ws.on('close', () => {
    console.log('Client disconnected');

    client.unsubscribe();
    client.quit();
  });

});
server.listen(8080, function() {
  console.log((new Date()) + ' Server is listening on port 8080');
});

//v1 - what happening was the response was sent to all the users connected to the ws - now the response would only be sent to the person who has entered the message

