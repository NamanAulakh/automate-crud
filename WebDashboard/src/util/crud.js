import axios from 'axios';
import { API } from '../app.json';
import { toastr } from 'react-redux-toastr';

const getParams = ({ func, type, payload }) => {
  // console.log(payload, '......payload: getParams........');
  let customType = null;
  let customPayload = null;
  switch (func) {
    case 'post':
      customType = `${type}_CREATE_SUCCESS`;
      customPayload = payload.createdRec ? payload : { createdRec: payload };
      break;

    case 'patch':
      customType = `${type}_UPDATE`;
      customPayload = { id: payload._id, newRec: payload };
      break;

    case 'delete':
      customType = `${type}_DELETE`;
      customPayload = { _id: payload._id };
      break;

    default:
      customType = `${type}_FETCH_ALL_SUCCESS`;
      customPayload = payload;
      break;
  }

  return { customType, customPayload };
};

export const crud = ({
  func,
  uri,
  successCallback,
  beforeHook,
  reqBody,
  type,
  callback,
}) => dispatch =>
  new Promise(async resolve => {
    try {
      if (beforeHook) beforeHook();
      const { data } = await axios[func](`${API}/${uri}`, reqBody);
      console.log(data, `&&&&&&&${func}: ${uri}&&&&&&&&&`);
      const { success, data: payload, stack } = data;
      if (!success) {
        toastr.error('error', stack);
        return resolve(false);
      }

      if (successCallback) return successCallback(payload);
      if (callback) callback(payload);

      if (payload && type) {
        const { customType, customPayload } = getParams({ func, type, payload });
        // console.log(customPayload, 'customPayload');
        await dispatch({ type: customType, payload: customPayload });
      }
      toastr.success('Success');
      resolve(true);
    } catch (error) {
      console.log(error, `!!!!${func}: ${uri}!!!!!`);
      toastr.error('error');
      resolve(false);
    }
  });
