import _ from 'lodash';

export const readAll = stream => new Promise((res, rej) => {
  let data;

  stream.on('data', (chunk) => {
    if (_.isString(chunk)) {
      data += chunk;
    } else {
      data = Buffer.concat([data, chunk]);
    }
  });

  stream.on('end', () => {
    res(data);
  });

  stream.on('error', (err) => {
    rej(err);
  });

  stream.on('close', () => {
    res(data);
  });
});
