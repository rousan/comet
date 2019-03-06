import http from 'http';
import CometServer from '../src/server';

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
