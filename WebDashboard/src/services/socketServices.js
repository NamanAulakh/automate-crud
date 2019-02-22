const io = require('socket.io-client');
let socket = null;
// let token = null;
const tokenj = localStorage.getItem('token');
export function socketAdminInit() {
  // console.log("store heree", tokenj);
  socket = io('http://localhost:3010', {
    jsonp: false,
    transports: ['websocket'],
    query: 'token=' + tokenj,
    // ${storeObj.getState().auth.token}`,
  });
  socket.on('connect', () => {
    console.log('connected');
    // socket.emit('getDriverDetails', data);
  });
  socket.on('getDriverDetails', data => {
    console.log('getdriver', data);
  });
  // socket.emit('getDriverDetails');
  socket.on('disconnect', () => {
    console.log('disconnected');
  });
  // socket.on('responseTimedOut', () => {
  //   console.log('timeout');
  // });
  // socket.on('updateDriverLocation', gpsLoc => {
  //   console.log('gps loc', gpsLoc);
  // });
  // socket.on('updateLocation', gpsLoc => {
  //   console.log('updated loc', gpsLoc);
  // });
  // socket.on('socketError', e => {
  //   alert(e);
  // });
}

// export function updateLocation(user) {
//   socket.emit('updateLocation', user);
// }
