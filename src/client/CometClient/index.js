import axios from 'axios';
import uuidv4 from 'uuid/v4';
import EventEmitter from '../../commons/EventEmitter';
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
    options.data = options.data || defaults.data;
    this._options = options;
  }

  _connect() {
    this._makeNewConn(this._options.data)
      .then(() => {
        this._currentReq = null;
        this._makeSureConnected();
        this.emit('open', this);
      })
      .catch((err) => {
        this._currentReq = null;
        this.emit('error', new Error(`Couldn't create the session: ${err.message}`));
      });
  }

  _makeNewConn(data) {
    const cancelSource = axios.CancelToken.source();
    this._currentReq = cancelSource;
    const headers = {
      [cometHeader]: this._sessionId,
      'Content-Type': 'application/json',
    };
    const options = { headers, timeout: 0, cancelToken: cancelSource.token };
    return axios.post(this._url, data, options);
  }

  _makeSureConnected(data = []) {
    if (this._currentReq) {
      return;
    }

    this._makeNewConn(data)
      .then(({ data: messages }) => {
        messages.forEach((m) => {
          this.emit('message', m);
        });
        this._currentReq = null;
        this._makeSureConnected();
      })
      .catch((err) => {
        if (!axios.isCancel(err)) {
          this._currentReq = null;
          setTimeout(() => {
            this._makeSureConnected();
          }, 5000);
        }
      });
  }

  send(message) {
    if (this._currentReq) {
      this._currentReq.cancel('Cancel the previous request');
    }

    this._currentReq = null;
    this._makeSureConnected([message]);
  }
}

export default CometClient;
