import WebSocket from "ws";
import { createClient, RedisClientType } from "redis";

export class RedisClient {
  private static instance: RedisClient;
  private subscriber: RedisClientType;
  public publisher: RedisClientType;
  public subscriptions: Map<string, string[]>
  public reverseSubscriptions: Map<string, { [userId: string]: { userId: string; ws: WebSocket; } }>

  private constructor() {
    this.subscriber = createClient();
    this.publisher = createClient();
    this.publisher.connect()
    this.subscriber.connect()
    this.subscriptions = new Map<string, string[]>
    this.reverseSubscriptions = new Map<string, { [userId: string]: { userId: string; ws: WebSocket; } }>
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new RedisClient();
    }
    return this.instance
  }

  subscribe(userId: string, room: string, ws: WebSocket) {
    this.subscriptions.set(userId, [
      ...(this.subscriptions.get(userId) || []),
      room
    ])
    this.reverseSubscriptions.set(room, {
      ...(this.reverseSubscriptions.get(room) || {}),
      [userId]: { userId, ws }
    })

    if (Object.keys(this.reverseSubscriptions.get(room) || {}).length === 1) {
      console.log(`First User came, Now subscribing to the room - ${room}`)
      this.subscriber.subscribe(room, (payload) => {
        try {
          Object.values(this.reverseSubscriptions.get(room) || {}).forEach(({ ws }) => {
            ws.send(payload)
          })
        } catch (e) {
          console.log('error in the payload')
        }
      })
    }
  }

  unsubscribe(userId: string, roomToUnsubscribe: string) {
    this.subscriptions.set(userId,
      this.subscriptions.get(userId)?.filter((room) => room !== roomToUnsubscribe) || []
    )
    if (this.subscriptions.get(userId)?.length === 0) {
      this.subscriptions.delete(userId)
    }
    delete this.reverseSubscriptions.get(roomToUnsubscribe)?.[userId];
    if (Object.keys(this.reverseSubscriptions.get(roomToUnsubscribe) || []).length === 0) {
      console.log(`Deleting this room - ${roomToUnsubscribe} as there are no users left inside it`)
      this.subscriber.unsubscribe(roomToUnsubscribe)
      this.reverseSubscriptions.delete(roomToUnsubscribe)
    }
  }

  publish(room: string, message: any) {
    console.log(`publishing message to ${room}`);
    this.publisher.publish(room, message);
  }
}
