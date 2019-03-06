[![NPM version](https://img.shields.io/npm/v/comet.svg)](https://www.npmjs.com/package/comet)
[![Required Node version](https://img.shields.io/node/v/comet.svg)](https://www.npmjs.com/package/comet)
[![NPM total downloads](https://img.shields.io/npm/dt/comet.svg)](https://www.npmjs.com/package/comet)
[![Contributors](https://img.shields.io/github/contributors/rousan/comet.svg)](https://github.com/rousan/comet/graphs/contributors)
[![License](https://img.shields.io/github/license/rousan/comet.svg)](https://github.com/rousan/comet/blob/master/LICENSE)

# What is http long polling?

Http long polling is used in real-time application where server pushes the data changes to client using simple HTML5 ajax mechanism.

First client makes a request to an HTTP endpoint in the usual way, with the intention of requesting data it has not yet received. If there is no new data available, then the server holds the request open until data becomes available to respond with. After receiving a response (whether new data or timeout), the transaction is complete. The client may create a new request to listen for further data.

# comet

The comet is a implementation of http long polling or comet application model which abstracts the internal http requests and provides high-level websocket alike API.

## Installation

Using `npm`:

```bash
$ npm install --save comet
```

Using `yarn`:

```bash
$ yarn add comet
```

## Usage

Here is simple example to push n-th fibonacci numbers to client:

The server:

```javascript
import http from 'http';
import CometServer from 'comet/server';

const server = http.createServer();
const pollingServer = new CometServer({ server });

pollingServer.on('connection', (conn, data) => {
  let { fibPos } = data;
  console.log(`New connection with fibpos: ${fibPos}`);

  setInterval(() => {
    conn.send({ pos: fibPos, value: fib(fibPos++) });
  }, 1000);
});

server.listen(8888);

const fib = (n) => {
  let num = 0;
  let num2 = 1;
  let fibonacci;

  for (let i = 0; i < n; i++) {
    fibonacci = num + num2;
    num = num2;
    num2 = fibonacci;
  }

  return num;
};
```

The client:

```javascript
import CometClient from 'comet/client';

const fibPos = Math.floor(Math.random() * 10);
const longPollingClient = new CometClient('http://localhost:8888/polling', {
  data: { fibPos },
});

longPollingClient.on('message', (m) => {
  console.log(`${m.pos}th: ${m.value}`);
});

longPollingClient.on('open', (conn) => {
  console.log('Connection opened');
  console.log(`Receiving fibonacci numbers from ${fibPos}th position:`);
});
```

See `example` for further guide.

## Contributing

Your PRs and stars are always welcome.