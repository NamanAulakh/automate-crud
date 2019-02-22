const Transport = require('winston-transport');

export default class CustomTransport extends Transport {
  constructor(opts) {
    super(opts);
  }

  log(info, callback) {
    setImmediate(() => this.emit('logged', info));
    // Perform the writing to the remote service
    callback();
  }
}
