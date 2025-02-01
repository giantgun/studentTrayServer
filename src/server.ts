import http from "http";
import app from "./app";
import dotenv from "dotenv";
import ngrok from "@ngrok/ngrok";

dotenv.config();

const port = process.env.SERVER_PORT || 3000;
app.set("port", port);

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`server running on "http://localhost:${port}"`);
});

try {
  ngrok
    .connect({ addr: port, authtoken_from_env: true })
    .then((listener) =>
      console.log(`Ingress established at: ${listener.url()}`),
    );
} catch (error) {
  console.error(error);
}
