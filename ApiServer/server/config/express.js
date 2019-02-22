import bodyParser from 'body-parser';
import compress from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { get } from 'lodash';
import express from 'express';
import helmet from 'helmet';
import methodOverride from 'method-override';
import passport from 'passport';
import path from 'path';
import routes from '../routes';
import passConfig from './passport-config';
import setupWinston from './winstonConfig';
import APIError from '../helpers/APIError';
import expressValidation from 'express-validation';
import httpStatus from 'http-status';
const interceptor = require('express-interceptor');

process.on('unhandledRejection', async err => {
  log({ level: 'error', val: `${err}`, extra: 'Unhandled Rejection' });
});

process.on('uncaughtException', async err => {
  log({ level: 'error', val: `${err}`, extra: 'Uncaught Exception' });
});

setupWinston();

const app = express();

const responseInterceptor = interceptor((req, res) => ({
  // Intercept all
  isInterceptable: () => true,
  intercept: (body, send) => send(body),
  afterSend: () => {
    const { originalUrl, originalMethod, protocol, user } = req;
    if (originalMethod === 'OPTIONS' || originalUrl.includes('health-check')) return;
    const { statusCode, statusMessage } = res;
    let reqData = JSON.stringify(req.body);
    if (reqData.indexOf('password') > 0)
      reqData = reqData.substring(0, reqData.indexOf('password') - 1);

    if (process.env.NODE_ENV !== 'test' && process.env.NODE_ENV !== 'development')
      monitor({
        message: `${originalMethod}: ${protocol}:${originalUrl}`,
        meta: {
          user: get(user, '_doc', null),
          res: { statusCode, statusMessage },
          reqBody: reqData,
        },
      });
  },
}));
// create server
const server = require('http').createServer(app);
// parse body params and attache them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compress());
app.use(methodOverride());
// configure passport for authentication
passConfig(passport);
app.use(passport.initialize());
// secure apps by setting various HTTP headers
app.use(helmet());
// enable CORS - Cross Origin Resource Sharing
app.use(cors());
// Add the interceptor middleware
app.use(responseInterceptor);
// mount public folder on / path
app.get('/', (req, res) => res.sendFile(path.resolve(__dirname, '../../public/index.html')));
// mount all routes on /api path
app.use('/api', routes);
/**
 * Custom error handler
 */
const finalDestination = (err, res) => {
  // console.log(err.stack, 'err: finalDestination');
  res.send({
    data: null,
    message: err.errorMessage ? err.errorMessage : httpStatus[err.status],
    success: false,
    stack: err.stack,
  });
};
app.use((err, req, res, next) => {
  if (process.env.NODE_ENV !== 'test' && process.env.NODE_ENV !== 'development')
    log({
      level: 'error',
      val: `${err.stack}`,
      extra: 'Middleware Error',
      meta: { user: get(req, 'user._doc', null) },
    });
  // validationError
  if (err instanceof expressValidation.ValidationError) {
    const error = new APIError( // validation error contains errors which is an array of error each containing message[]
      err.errors.map(error => error.messages.join('. ')).join(' and '), // unified error message
      err.status,
      true
    );

    return finalDestination(error, res);
  }
  // if error is not an instanceOf APIError, convert it.
  if (!(err instanceof APIError)) {
    const error = new APIError(err.message, err.status, err.isPublic);

    return finalDestination(error, res);
  }
  // instance of APIError
  return finalDestination(err, res);
});
/**
 * catch 404 and forward to error handler
 */
app.use((req, res, next) => next(new APIError('API not found', httpStatus.NOT_FOUND)));
// error handler, send stacktrace only during development
app.use((err, req, res, next) => {
  if (process.env.NODE_ENV !== 'test' && process.env.NODE_ENV !== 'development')
    log({
      level: 'error',
      val: `${err.stack}`,
      extra: 'NOT_FOUND',
      meta: { user: get(req, 'user._doc', null) },
    });

  res.send({
    data: null,
    message: err.isPublic ? err.message : httpStatus[err.status],
    success: false,
    stack: err.stack,
  });
});
// abc();

// export default server;
module.exports = server;
