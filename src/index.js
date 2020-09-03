const port = process.env.PORT || 8080;
const jsonServer = require("json-server");
const data = require("../db.json");

const server = jsonServer.create();
const middlewares = jsonServer.defaults();
server.use(middlewares);

server.use((req, res, next) => {
  let sleep = null;

  if (req.query && req.query.sleep) {
    sleep = +req.query.sleep;
  }

  if (typeof sleep === "number") {
    setTimeout(next, sleep);
  } else {
    next();
  }
});

const router = jsonServer.router(data);
server.use(router);

server.listen(port, () => {
  console.log(`JSON Server is running on port ${port}`);
});
