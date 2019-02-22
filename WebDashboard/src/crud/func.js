import React from 'react';
import { get, findIndex } from 'lodash';
import axios from 'axios';
import { toastr } from 'react-redux-toastr';
import { API } from '../app.json';
import { routesArr } from './constants';
import { list } from 'app/util';

export const initialize = async ({ self }) => {
  const { pathObj, dispatch, editProp } = self.props;
  const { listAPI, type, api } = pathObj;
  if (!editProp) list({ dispatch, type, api, listAPI });
};

const createRec = ({ values, self }) => dispatch =>
  new Promise(async resolve => {
    try {
      const { pathObj } = self.props;
      const { postAPI, extraData = {}, type, api } = pathObj;
      const { data } = await axios.post(api ? `${API}/${api}/create` : `${API}/${postAPI}`, {
        ...values,
        ...extraData,
      });
      const { message, stack, data: payload, success } = data;
      if (success) dispatch({ type: `${type}_CREATE_SUCCESS`, payload });
      return resolve({ success, message, stack });
    } catch (error) {
      console.log(error, '!!!!!createRec!!!!!');
      return resolve({ status: false, message: 'Internal Server Error' });
    }
  });

export const create = async ({ self }) => {
  const { dispatch, modifyPostBody, vehicleTypes } = self.props;
  let { values } = self.props;
  if (!values) return toastr.error('Error', 'Values not found');
  if (modifyPostBody)
    values = modifyPostBody({
      values,
      vehicleTypes: values ? vehicleTypes : null, // This hack is unacceptable, solve it
      props: self.props,
    });
  if (!values) return toastr.error('Error', 'Values not found');
  console.log(values, '!!!!values!!!!!');
  const { success, message, stack } = await dispatch(createRec({ values, self }));
  if (success) return toastr.success('Success', message);
  toastr.error('Error', stack);
};

export const update = async ({ self, isSignUp }) => {
  const {
    form,
    pathObj,
    dispatch,
    storeData,
    modifyPostBody,
    vehicleTypes,
    customStateChangePatch,
  } = self.props;
  const { edit } = self.state;
  try {
    let values = get(form, `${edit}-list.values`, null);
    if (modifyPostBody)
      values = modifyPostBody({ values, vehicleTypes, isSignUp, props: self.props });
    if (!values) return toastr.error('Error', 'Values not found');
    const { patchAPI, type, api } = pathObj;
    console.log(values, 'values: patch');
    const { data } = await axios.patch(
      api ? `${API}/${api}/update?_id=${edit}` : `${API}/${patchAPI}?_id=${edit}`,
      values
    );
    console.log(data, 'data');
    const { message, stack, data: payload, success } = data;
    // if (!success) return toastr.error(message, stack);
    if (!success) return toastr.error('Error', stack);
    const index = findIndex(storeData, item => item._id === edit);
    dispatch({
      type: `${type}_UPDATE`,
      payload: { index, newRec: payload, customStateChangePatch },
    });
    toastr.success('Success', message);
    self.setState({ edit: null });
  } catch (error) {
    console.log(error, '!!!!!update!!!!!');
    toastr.error('Internat Server Error', error);
  }
};

export const deleteRec = async ({ self }) => {
  const { pathObj, dispatch, customStateChangeDelete } = self.props;
  const { edit } = self.state;
  try {
    const { deleteAPI, type, api } = pathObj;
    const { data } = await axios.delete(
      api ? `${API}/${api}/delete?_id=${edit}` : `${API}/${deleteAPI}?_id=${edit}`
    );
    const { message, stack, success } = data;
    if (!success) return toastr.error(message, stack);
    self.setState({ edit: null, showDeleteModal: false }, () => {
      dispatch({ type: `${type}_DELETE`, payload: { _id: edit, customStateChangeDelete } });
      toastr.success('Success', message);
    });
  } catch (error) {
    console.log(error, '!!!!!deleteRec!!!!!');
    toastr.error('Internat Server Error', error);
  }
};

export const edit = ({ self, item, fillForm }) => {
  if (self.props.extraKeys) self.props = self.props.extraKeys(self.props);
  const { dispatch, keys, pathObj } = self.props;
  let payload = {};
  if (fillForm) payload = fillForm({ item });
  else keys.forEach(key => (payload[key] = item[key]));
  const { type } = pathObj;
  dispatch({ type: `${type}_FILL_FORM`, payload });
  self.setState({ edit: item._id, item: { _id: item._id } });
};

export const mapStateToPropsWrap = (store, ownProps) => {
  // use some selector library to improve the perf of this func
  const token = store.auth.token;
  const isModal = ownProps.isModal;
  const path = isModal ? ownProps.path : get(ownProps, 'location.pathname', null);
  const pathObj = routesArr[path];
  const { optionsObj } = pathObj;
  const options = {};
  let values = null;
  let initialValues = null;
  let keys = [];
  let storeData = [];
  if (pathObj) {
    values = get(store, `form.${pathObj.formName}.values`, null);
    storeData = get(store, `${pathObj.storeKey}.data`, []);
    initialValues = get(store, `${pathObj.storeKey}.initialValues`, null);
    keys = pathObj.data ? Object.keys(pathObj.data) : null;
    if (optionsObj) {
      const fields = Object.keys(optionsObj);
      fields.forEach(field => {
        const optionKey = optionsObj[field];
        const key = optionKey.field;
        let opKey = optionKey.opKey;
        const delimiter = optionKey.delimiter;
        if (delimiter) opKey = opKey.split(delimiter);
        const display = opKey;
        const val = optionKey.valKey;
        const value = store[field].data.map(item => ({
          display: !delimiter
            ? item[display]
            : `${item[display[0]]}${delimiter}${item[display[1]]}`, // extend this to any number of elements
          val: item[val],
        }));
        options[key] = value;
      });
    }
  }

  return {
    ...pathObj,
    path,
    values,
    storeData,
    pathObj,
    token,
    initialValues,
    keys,
    form: store.form,
    options,
    store,
  };
};
