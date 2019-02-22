/* eslint-disable no-console */
import Promise from 'bluebird';
import mongoose from 'mongoose';
import { port, host, poolSize } from './config/app';
import app from './config/express';
import socketServer from './config/socket-server';
require('./global');

// promisify mongoose
Promise.promisifyAll(mongoose);
const options = {
  reconnectInterval: 500,
  bufferMaxEntries: 0,
  socketTimeoutMS: 0,
  keepAlive: true,
  reconnectTries: 30,
  useNewUrlParser: true,
  useCreateIndex: true,
  poolSize,
  autoIndex: false,
};

const listen = () =>
  app.listen(process.env.PORT || port, () => {
    log({ val: `${process.env.NODE_ENV} server started on Port: ${port}` });
  });

if (process.env.NODE_ENV === 'test') {
  mongoose.connect(host, options, async () => {
    /* Drop the DB */
    mongoose.connection.once('open', () => {
      mongoose.connection.db.dropDatabase();
      return listen();
    });
  });
} else {
  // env !== 'test'
  mongoose.connect(host, options);
}
mongoose.connection.on('error', () => {
  throw new Error(`unable to connect to database: ${host}`);
});
listen();

export default app;
