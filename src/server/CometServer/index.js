import http from 'http';
import defaults from '../defaults';
import EventEmitter from '../../commons/EventEmitter';
import { readAll } from '../helper';
import { cometHeader } from '../../commons';
import CometConn from '../CometConn';

const connRegistry = new Map();

class CometServer extends EventEmitter {
  constructor(options = {}) {
    super();
    this._sanitizeOptions(options);
  }

  _sanitizeOptions(options) {
    options = Object.assign({}, defaults, options);
    if (!options.server) {
      options.server = http.createServer();
      options.server.listen(options);
    }

    this._options = options;
    this._options.server.on('request', this._handleNewRawRequest.bind(this));
  }

  _handleNewRawRequest(req, res) {
    const sessionId = req.headers[cometHeader.toLowerCase()];
    if (!sessionId) {
      return;
    }

    req.setEncoding('utf8');
    readAll(req)
      .then((data) => {
        data = JSON.parse(data);
        res.setHeader('Access-Control-Allow-Origin', this._options.cors);

        if (connRegistry.has(sessionId)) {
          connRegistry.get(sessionId)._newRequest(req, res, data);
        } else {
          const newConn = new CometConn(sessionId);
          connRegistry.set(sessionId, newConn);
          this.emit('connection', newConn, data);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.write(JSON.stringify({ message: 'Session registered' }));
          res.end();
        }
      })
      .catch((err) => { console.log(err); });
  }
}

export default CometServer;
