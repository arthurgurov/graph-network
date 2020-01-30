# Network Graph project

This project is a demonstration of gRPC capabilities.

## Technologies

- Node.js
- NestJS
- protobuf
- gRPC

## Project structure

The project consists from 3 key parts:
- protobuf schema definition
- Node.js server
- Node.js client

## Run instructions

You have to run Node.js server first and then you can run multiple clients.

### Server

1. Run `npm install` in `service` folder - this action will download all dependencies for you
2. Run `npm run start` - this action will run NestJS gRPC server for you

### Clients

There are 3 different clients prepared for you. All test clients will connect to the server and read graph data from a stream.

1. Run `npm install` in `client` folder - this action will download all dependencies for you
2. Run `npm demo:client0` - this action will run a NestJS client that will populate some test data to the server
3. Run `npm demo:client1` - this action will run a NestJS client that will produce a new node every 1 minute
4. Run `npm demo:client2` - this action will run a NestJS client that will produce a new node every 1 minute

Please execute all actions and check logs of your clients. Very soon you will see that your network grows. Enjoy!
