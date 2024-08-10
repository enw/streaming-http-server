# HTTP2 Server

## Overview

This project is an HTTP2 server and client implementation using Node.js. The server streams JSON lines to the client, which can send messages and control commands back to the server.

## Features

- HTTP2 secure server with certificate-based authentication.
- Stream-based communication using JSON lines.
- Client sends periodic messages and can gracefully close the connection.

## Prerequisites

- Node.js installed on your machine.
- Certificates for HTTPS communication (`server.key`, `server.crt`).

## Installation

1. Clone the repository:

   ```sh
   git clone <repository-url>
   cd <repository-directory>
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

## Usage

### Starting the Server

To start the HTTP2 server, run:

```sh
node echo-stream-server.ts --port <port>
```

Replace `<port>` with the desired port number (default is 8443).

### Running the Client

To start the client, run:

```sh
node joke-stream-client.ts --url <server-url> --interval <seconds> --count <number>
```

Replace `<server-url>` with the server URL (default is `https://localhost:8443`), `<seconds>` with the interval between messages, and `<number>` with the number of messages to send.

## Configuration

The server and client can be configured using command-line options. For example, to change the port the server listens on, use the `--port` option.

### Server Options

- `-p, --port <port>`: Port to listen on (default: 8443).

### Client Options

- `-n, --interval <seconds>`: Interval in seconds between messages (default: 4).
- `-m, --count <count>`: Number of messages to send (default: 4).
- `-u, --url <url>`: URL of the server (default: `https://localhost:8443`).

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Example

To start the server on port 8443:

```sh
node echo-stream-server.ts --port 8443
```

To run the client and send 5 messages at 2-second intervals:

```sh
node joke-stream-client.ts --url https://localhost:8443 --interval 2 --count 5
```

## Code References

- Server implementation: `echo-stream-server.ts` (startLine: 1, endLine: 89)
- Client implementation: `joke-stream-client.ts` (startLine: 1, endLine: 81)

## Contributing

Feel free to submit issues or pull requests. Contributions are welcome!

## Contact

For any questions or suggestions, please contact Elliot Winard at hello@elliotwinard.com
