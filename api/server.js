let express = require("express");
let cors = require("cors");
let helmet = require("helmet");
let postsRouter = require("../posts/posts-router");

let server = express();
server.use(express.json());
server.use(cors());
server.use(helmet());

server.use("/api/posts", postsRouter)
server.get("/api", (req, res) => {
    res.status(200).json({ api: "UP" });
})

module.exports = server;