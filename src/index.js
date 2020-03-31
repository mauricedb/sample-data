const port = process.env.PORT || 8080;
const jsonServer = require("json-server");
const data = require("../db.json");

const server = jsonServer.create();
const middlewares = jsonServer.defaults();
server.use(middlewares);

const router = jsonServer.router(data);
server.use(router);

server.listen(port, () => {
  console.log(`JSON Server is running on port ${port}`);
});
