const express = require('express'); // importing a CommonJS module
const helmet = require('helmet');

const hubsRouter = require('./hubs/hubs-router.js');

const server = express();

// middleware
// custom middleware
function logger(req, res, next) {
  console.log(`${req.method} ${req.originalUrl}`);
  next(); // allows the request to continue to the next middleware or router;
}

// write a gateKeeper middleware that reads a password from the headers password is mellon, let it pass
function gateKeeper(req, res, next) {
  const password = req.headers.password;
  if (password && password.toLowerCase() === 'mellon') {
    next();
  } else {
    res.status(401).json({error: 'You shall not pass.'});
  }
}


server.use(express.json());
server.use(helmet());
server.use(logger);

// endpoints
server.use('/api/hubs', hubsRouter);

server.get('/', (req, res) => {
  const nameInsert = (req.name) ? ` ${req.name}` : '';

  res.send(`
    <h2>Lambda Hubs API</h2>
    <p>Welcome${nameInsert} to the Lambda Hubs API</p>
    `);
});

server.get("/area51", helmet(), gateKeeper, (req, res) => {
  res.send(req.headers);
});

module.exports = server;
