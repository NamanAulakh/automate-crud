/**
 * SocketStore class is used to add socket to store, remove socket from store and emit socket event.
 */
/* eslint-disable */

const store = []; // Store keep tracks of userId and its corresponding socket.
class SocketStore {
  /**
   * Add socket object to the store.
   * @param userId - unique user id of the user.
   * @param socketObj- socketObj to which user is connected to.
   * @returns {success, message, data}
   */

  static addByUserId(userId, socketObj) {
    if (
      userId === 'undefined' ||
      userId === null ||
      socketObj === null ||
      socketObj === 'undefined'
    ) {
      return returnFunc(false, 'userId or socketObj is undefine', '');
    } else {
      const newObj = {
        id: userId,
        socket: [socketObj],
      };
      if (store.length === 0) {
        store.push(newObj);
      } else {
        for (let i = 0; i < store.length; i++) {
          if (store[i].id === userId) {
            store[i].socket.push(socketObj);
            return returnFunc(true, 'user Id and socket is successfully stored', '');
          }
        }
        store.push(newObj);
        return returnFunc(true, 'user Id and socket is successfully stored', '');
      }
    }
  }

  /**
   * Return socket object for the given user ID.
   * @param userId - unique user id of the user.
   * @returns {success, message, data}
   */

  static getByUserId(userId) {
    if (userId === undefined || userId === null) {
      return returnFunc(false, 'userId is undefined or null', '');
    } else if (store.length === 0) {
      return returnFunc(false, 'socket store is empty', '');
    } else {
      for (let i = 0; i < store.length; i++) {
        if (store[i].id.toString() === userId.toString()) {
          return returnFunc(true, 'userId and its corresponding socket found', store[i].socket);
        }
      }
      return returnFunc(false, 'userId and its corresponding socket not found in the store', '');
    }
  }

  /**
   * Return socket object for the given user ID.
   * @param userId - unique user id of the user.
   * @returns {success, message, data}
   */

  static removeByUserId(userId, socketObj) {
    if (userId === null || userId === undefined || socketObj === null || socketObj === undefined) {
      return returnFunc(false, 'userId or socket obj is undefined or null');
    } else if (store.length === 0) {
      return returnFunc(false, 'socket store is empty', '');
    } else {
      for (let i = 0; i < store.length; i++) {
        if (store[i].id === userId) {
          const socketObjectIndex = store[i].socket.indexOf(socketObj);
          if (socketObjectIndex !== -1) {
            store[i].socket.splice(socketObjectIndex, 1);
            return returnFunc(true, 'userId and its corresponding socket obj', store[i]);
          } else {
            return returnFunc(false, 'socketObj not found', '');
          }
        }
      }
      return returnFunc(false, 'userId not found', '');
    }
  }

  /**
   * Emit socket event to the given user ID.
   * @param userId - unique user id of the user.
   * @param eventName - event name to be emitted.
   * @param payload - data to be send to the user.
   * @returns {success, message, data}
   */

  static emitByUserId(userId, eventName, payload) {
    if (userId === undefined || userId === null) {
      return returnFunc(false, 'userId is undefined or null', '');
    } else if (store.length === 0) {
      return returnFunc(false, 'socket store is empty', '');
    } else {
      for (let i = 0; i < store.length; i++) {
        if (store[i].id.toString() === userId.toString()) {
          const socketArrayObject = store[i].socket;
          for (let j = 0; j < socketArrayObject.length; j++) {
            socketArrayObject[j].emit(eventName, payload);
          }
          return returnFunc(true, 'evenet emitted successfully', '');
        }
      }
      return returnFunc(false, 'no user found with the id.', store);
    }
  }

  /**
   * Emit socket event to the given user ID.
   * @param userId - unique user id of the user.
   * @param eventName - event name to be emitted.
   * @param payload - data to be send to the user.
   * @returns {success, message, data}
   */

  static emitToAll(eventName, payload) {
    if (store.length === 0) {
      return returnFunc(false, 'socket store is empty', '');
    } else {
      for (let i = 0; i < store.length; i++) {
        // store.socket.emit(eventName, payload);
        const socketArrayObject = store[i].socket;
        for (let j = 0; j < socketArrayObject.length; j++) {
          socketArrayObject[j].emit(eventName, payload);
        }
        return returnFunc(true, 'evenet emitted successfully', payload);
      }
      return returnFunc(false, 'no user found with the id.', store);
    }
  }

  static display() {
    for (let i = 0; i < store.length; i++) {
      for (let j = 0; j < store[i].socket.length; j++) {
        log({ val: `${store[i].socket[j].id}` });
      }
    }
  }
}

/**
 * Transform return Object
 */
function returnFunc(successStatus, msg, resultData) {
  return { success: successStatus, message: msg, data: resultData };
}

export default SocketStore;
