import _ from 'lodash';
import EventEmitter from '../../commons/EventEmitter';

class CometConn extends EventEmitter {
  constructor(sessionId) {
    super();
    this._sessionId = sessionId;
    this._connPool = [];
    this._pendingMessages = [];
  }

  get sessionId() {
    return this._sessionId;
  }

  _newRequest(req, res, messages) {
    messages.forEach((m) => {
      this.emit('message', m);
    });

    req.on('aborted', () => {
      this._disposeRequest(req);
    });

    req.on('close', () => {
      this._disposeRequest(req);
    });

    res.on('close', () => {
      this._disposeRequest(req);

      if (!res._finished && res._targetMessages) {
        this._pendingMessages.unshift(...res._targetMessages);
      }
    });

    res.on('finish', () => {
      res._finished = true;
    });

    if (!_.isEmpty(this._pendingMessages)) {
      this._flushPendingMessages(res);
      return;
    }

    this._connPool.push({ req, res });
  }

  _disposeRequest(req, res) {
    const idx = this._connPool.findIndex(r => r.req === req || r.res === res);
    if (idx !== -1) {
      this._connPool.splice(idx, 1);
    }
  }

  _flushPendingMessages(res) {
    this._disposeRequest(null, res);
    const pendingMessages = this._pendingMessages;
    res._targetMessages = [...pendingMessages];
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify(pendingMessages));
    res.end();
    this._pendingMessages.length = 0;
  }

  send(message) {
    this._pendingMessages.push(message);
    if (_.isEmpty(this._connPool)) {
      return;
    }

    const { res } = this._connPool[0];
    this._flushPendingMessages(res);
  }
}

export default CometConn;
