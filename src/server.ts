import http from "http"
import app from "./app"
import dotenv from "dotenv"

dotenv.config()

const port = process.env.PORT || 3000
app.set("port", port)

const server = http.createServer(app)

server.listen(port, () => {
    console.log(`server running on "http://localhost:${port}"`)
})
