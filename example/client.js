import CometClient from '../src/client';

const fibPos = Math.floor(Math.random() * 10);
const longPollingClient = new CometClient('http://localhost:8080/polling', {
  data: { fibPos },
});

longPollingClient.on('message', (m) => {
  console.log(`${m.pos}th: ${m.value}`);
});

longPollingClient.on('open', (conn) => {
  console.log('Connection opened');
  console.log(`Receiving fibonacci numbers from ${fibPos}th position:`);
});
