// import nearbyDriverHandler from './story/nearby-driver-handler';
// import requestTripHandler from './story/request-trip';
// import startTripHandler from './story/start-trip';
// import updateLocationHandler from './story/update-location';
import SocketStore from '../service/socket-store';

const socketHandler = socket => {
  // requestTripHandler(socket);
  // startTripHandler(socket);
  // updateLocationHandler(socket);
  // nearbyDriverHandler(socket);
  // dashboardHandler(socket);
  // userHandler(socket);
  socket.on('hello', () => {
    socket.emit('helloResponse', 'hello everyone');
  });
  socket.on('disconnect', () => {
    SocketStore.removeByUserId(socket.userId, socket);
  });
};

export default socketHandler;
