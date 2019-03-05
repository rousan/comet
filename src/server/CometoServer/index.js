import http from 'http';
import EventEmitter from 'eventemitter3';
import defaults from '../defaults';
import helper from '../helper';

const connRegistry = {};

class CometoServer extends EventEmitter {
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
    this.options.server.on('request', this._handleNewRawRequest.bind(this));
  }

  _handleNewRawRequest(req, res) {
    res.setHeader('Access-Control-Allow-Origin', this._options.cors);
    setTimeout(() => {
      res.end('dd');
    }, 10000);
  }
}

export default CometoServer;
