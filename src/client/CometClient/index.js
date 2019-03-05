import EventEmitter from 'eventemitter3';
import axios from 'axios';
import uuidv4 from 'uuid/v4';
import defaults from '../defaults';
import { cometHeader } from '../../commons';

class CometClient extends EventEmitter {
  constructor(url, options = {}) {
    super();
    this._sessionId = uuidv4();
    this._url = url;
    this._sanitizeOptions(options);
    this._connect();
  }

  _sanitizeOptions(options) {
    options = Object.assign({}, defaults, options);
    this._options = options;
  }

  _connect() {
    const headers = { [cometHeader]: this._sessionId };
    axios.post(this._url, this._options.data, { headers })
      .then((resp) => {
        console.log(resp.data);
      })
      .catch((err) => {
        this.emit('error', err);
      });
  }
}

export default CometClient;
