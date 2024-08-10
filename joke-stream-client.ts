import * as http2 from "http2";
import * as fs from "fs";
import { program } from "commander";

program
  .option(
    "-n, --interval <seconds>",
    "Interval in seconds between messages",
    parseInt,
    4
  )
  .option("-m, --count <count>", "Number of messages to send", parseInt, 4)
  .option("-u, --url <url>", "URL of the server", "https://localhost:8443");

program.parse(process.argv);

const options = program.opts();

const client = http2.connect(options.url, {
  ca: fs.readFileSync("server.crt"),
  rejectUnauthorized: false, // Disable certificate verification
});

client.on("error", (err) => console.error(err));

const stream = client.request({
  ":method": "POST",
  ":path": "/",
  "content-type": "application/jsonl",
});

stream.setEncoding("utf8");

stream.on("data", (chunk) => {
  console.log("Server response:", chunk);
});

stream.on("end", () => {
  console.log("Stream ended");
  client.close();
});

const sendJoke = () => {
  const jokes = [
    "Why don't scientists trust atoms? Because they make up everything!",
    "Why did the scarecrow win an award? Because he was outstanding in his field!",
    "Why don't skeletons fight each other? They don't have the guts.",
    "What do you call fake spaghetti? An impasta!",
    "Why did the bicycle fall over? Because it was two-tired!",
  ];

  const joke = jokes[Math.floor(Math.random() * jokes.length)];
  const message = JSON.stringify({ t: "msg", m: joke }) + "\n";
  stream.write(message);
  console.log("Sent:", message);
};
let count = 0;
let byeSent = false;

sendJoke();
count++;

const interval = setInterval(() => {
  if (count < options.count) {
    sendJoke();
    count++;
  } else if (!byeSent) {
    const byeMessage = JSON.stringify({ t: "ctl", m: "bye" }) + "\n";
    stream.write(byeMessage);
    console.log("Sent:", byeMessage);
    byeSent = true;
  } else {
    clearInterval(interval);
    stream.end();
  }
}, options.interval * 1000);

stream.on("close", () => {
  console.log("Client closed");
  process.exit(0);
});
