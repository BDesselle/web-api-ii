const express = require("express");
const postsRoutes = require("./routes/postsRoutes");

const port = 6000;
const server = express();

server.use(express.json());

server.use("/api", postsRoutes);

//* Listening Message
server.listen(port, () => {
  console.log(`API running on port ${port}`);
});
