# Real-Time Redis-Driven WebSocket Hub

## Overview
This project implements a WebSocket server that allows users to connect and send their user IDs without authentication. The WebSocket server is integrated with Redis to subscribe to a pub/sub channel, enabling real-time communication and event broadcasting to relevant users.

## Features
- WebSocket server for real-time communication
- Redis integration for pub/sub messaging
- Simple user ID identification without authentication
- Event-based communication to relevant users

## Technologies Used
- Node.js for the WebSocket server
- Redis for pub/sub messaging
- JavaScript for scripting
- GitHub for version control and collaboration

## Setup
1. Clone the repository from GitHub.
2. Install the necessary dependencies using npm.
3. Configure Redis connection details in the server script.
4. Start the WebSocket server using Node.js.
5. Connect clients to the WebSocket server and send user IDs to initiate communication.

## Usage
- Users can connect to the WebSocket server and send their user IDs.
- The server subscribes to Redis pub/sub channels for incoming messages.
- Upon receiving messages from users, the server broadcasts relevant events to connected clients based on user IDs.

## Contribution
Contributions are welcome! Fork the repository, make your changes, and submit a pull request for review.

## License
This project is licensed under the MIT License - see the LICENSE.md file for details.
