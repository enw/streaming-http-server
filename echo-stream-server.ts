import * as http2 from "http2";
import * as fs from "fs";
import { Readable, Writable } from "stream";
import { program } from "commander";

program.option("-p, --port <port>", "Port to listen on", parseInt, 8443);
program.parse(process.argv);

const options = program.opts();

const server = http2.createSecureServer({
  key: fs.readFileSync("server.key"),
  cert: fs.readFileSync("server.crt"),
});

server.on("error", (err) => console.error(err));

let id = 0;

server.on("stream", (stream, headers) => {
  stream.respond({
    "content-type": "application/jsonl",
    ":status": 200,
  });

  const readable = new Readable({
    read() {},
  });

  let streamEnded = false; // Flag to check if stream has ended

  readable.on("data", (chunk) => {
    const lines = chunk
      .toString()
      .split("\n")
      .filter((line: string) => line.trim() !== "");
    lines.forEach((line: string) => {
      try {
        const data = JSON.parse(line);
        const type = data.t || "msg";
        const message = data.m;

        console.log("Incoming message:", line);

        if (type === "ctl" && message === "bye") {
          const response =
            JSON.stringify({ id: id++, t: "ctl", m: "bye" }) + "\n";
          console.log("Outgoing message 1:", response);
          if (!streamEnded) {
            stream.write(response);
            stream.end();
            streamEnded = true; // Set flag to true after ending the stream
            server.close(() => {
              console.log("Server closed gracefully");
              process.exit(0);
            });
          }
        } else {
          const response =
            JSON.stringify({ id: id++, t: type, m: message }) + "\n";
          console.log("Outgoing message 2:", response);
          if (!streamEnded) {
            stream.write(response);
          }
        }
      } catch (e) {
        console.error("Invalid JSON", e);
      }
    });
  });

  stream.pipe(
    new Writable({
      write(chunk, encoding, callback) {
        if (!streamEnded) {
          readable.push(chunk);
        }
        callback();
      },
    })
  );

  // why was this here?  just because the intern thought it was a good idea?
  // readable.pipe(stream);
});

server.listen(options.port, () => {
  console.log(`Server listening on port ${options.port}`);
});
