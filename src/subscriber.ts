import WebSocket from "ws";
import { createClient } from "redis";

const client = createClient();

const subscribeToChannel = (channel: string, ws: WebSocket) => {
  client.subscribe(channel, function(messages, channel) {
    const messageData = JSON.parse(messages).data;
    const message = Buffer.from(messageData.data).toString('utf-8');
    console.log(`Received message from channel ${channel}: ${message}`);
    ws.send(message)
  });
};

const unsubscribeFromChannel = () => {
  client.unsubscribe();
};

export { subscribeToChannel, unsubscribeFromChannel };

