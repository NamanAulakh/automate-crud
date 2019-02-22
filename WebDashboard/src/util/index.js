import axios from 'axios';
import { toastr } from 'react-redux-toastr';
import { API } from '../app.json';
import { get } from 'lodash';
import { crud } from './crud';

export const guidGenerator = () => {
  const S4 = () => (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  return S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4();
};

export const list = ({ dispatch, type, api, listAPI }) =>
  new Promise(async resolve => {
    try {
      const { data } = await axios.get(api ? `${API}/${api}/list` : `${API}/${listAPI}`);
      console.log(data, '&&&&&&&listData&&&&&');
      const { success, data: payload, message, stack } = data;
      if (success) {
        await dispatch({ type: `${type}_FETCH_ALL_SUCCESS`, payload });
        return resolve(true);
      }
      // toastr.error(message, stack);
      resolve(false);
    } catch (error) {
      toastr.error('error', error);
      resolve(false);
    }
  });

export const setUserLocalStorage = ({ token, userType }) => {
  localStorage.setItem('token', token);
  localStorage.setItem('userType', userType);
};

export const auth = props => dispatch =>
  new Promise(async resolve => {
    try {
      const { data } = await axios.post(`${API}/auth/register`, { ...props, userType: 'rider' });
      const { success, data: payload, stack, message } = data;
      console.log(data, '%%%%%%signUp%%%%%%%', payload);
      if (!success) return resolve({ status: false, message: `${message}: ${stack}` });
      const token = get(payload, 'jwtAccessToken', null);
      const userType = get(payload, 'createdRec.userType', null);
      if (!token || !userType) return resolve({ status: false, message: 'Missing token' });
      setUserLocalStorage({ token, userType });
      await dispatch({ type: 'SET_STATE', payload: { token } });
      dispatch({ type: 'SIGNUP_SUCCESS', payload });

      resolve({ status: data.success, message: data.message });
    } catch (e) {
      console.log(e, '!!!!!auth!!!!');
      resolve({ status: false, message: 'Error in signUp' });
    }
  });

export const login = ({ email, password }) => dispatch =>
  new Promise(async resolve => {
    try {
      const { data } = await axios.post(`${API}/auth/login`, { email, password });
      // console.log(data, '.....login......');
      if (!data.success) return resolve({ status: false, message: data.stack });
      const token = get(data, 'data.jwtAccessToken', null);
      const userType = get(data, 'data.user.userType', null);
      if (!token || !userType) return resolve({ status: false, message: 'Missing token' });
      setUserLocalStorage({ token, userType });
      dispatch({ type: 'LOGIN_SUCCESS', payload: data.data });

      return resolve({ status: data.success, message: data.message });
    } catch (error) {
      return resolve({ status: false, message: 'Error in login' });
    }
  });

export const applyFilters = tripFilters => async dispatch => {
  let uri = 'trip/list?yo=yo';
  if (!tripFilters) return await dispatch(crud({ uri, func: 'get', type: 'TRIP' }));
  const { gte, lt, _id, tcId, driverId } = tripFilters;
  if (gte) uri = `${uri}&gte=${gte}`;
  if (lt) uri = `${uri}&lt=${lt}`;
  if (_id) uri = `${uri}&_id=${_id}`;
  if (tcId) uri = `${uri}&tcId=${tcId}`;
  if (driverId) uri = `${uri}&driverId=${driverId}`;
  await dispatch(crud({ uri, func: 'get', type: 'TRIP' }));
};

export * from './crud';
