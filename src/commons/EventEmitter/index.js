import BaseEventEmitter from 'eventemitter3';

class EventEmitter extends BaseEventEmitter {
  emit(...args) {
    setTimeout(() => {
      super.emit(...args);
    }, 0);
  }
}

export default EventEmitter;
