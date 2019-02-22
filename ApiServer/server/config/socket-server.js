import jwt from 'jsonwebtoken';
import { jwtSecret } from './app';
import sockeHandler from '../socketHandler';
import SocketStore from '../service/socket-store';

function startSocketServer(server) {
  const io = require('socket.io').listen(server);

  log({ val: 'SocketServer started' });
  io.on('connection', socket => {
    log('info', `Client connected to socket: ${socket.id}`);
    const authToken = socket.handshake.query.token.replace('JWT ', ''); // check for authentication of the socket
    jwt.verify(authToken, jwtSecret, (err, userDtls) => {
      if (err) {
        socket.disconnect();
      } else if (userDtls) {
        socket.userId = userDtls._doc._id;
        log(
          'info',
          `inside socket server \n\n ${userDtls._doc._id} ${userDtls._doc.email} ${
            userDtls._doc.fname
          }`
        );
        SocketStore.addByUserId(socket.userId, socket);
        sockeHandler(socket); // call socketHandler to handle different socket scenario
      }
    });
  });
}

export default { startSocketServer };
