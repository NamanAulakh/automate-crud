import express from 'express';
import validate from 'express-validation';
import createModel from '../middlewares/createModel';
import createController from './createController';
import listController from './listController';
import patchController from './patchController';
import deleteController from './deleteController';
import findController from './findController';
import security from './security';

export default data => {
  const { validation = {}, model, fields, modelName } = data;
  const Model = model ? model : createModel({ fields, modelName });
  const { cr = {}, up = {} } = validation;
  const router = express.Router();
  //list
  router.route('/list').get((req, res, next) => listController({ ...data, req, res, next, Model }));
  // security({ router });
  //post
  router
    .route('/create')
    .post(validate(cr), (req, res, next) => createController({ ...data, req, res, next, Model }));
  //get
  router.route('/find').get((req, res, next) => findController({ ...data, req, res, next, Model }));
  //patch
  router
    .route('/update')
    .patch(validate(up), (req, res, next) => patchController({ ...data, req, res, next, Model }));
  //delete
  router
    .route('/delete')
    .delete((req, res, next) => deleteController({ ...data, req, res, next, Model }));

  return router;
};
