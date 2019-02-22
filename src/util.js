/* eslint-disable no-console */
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const fs = require('fs');
const format = require('string-template');

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const underscorize = str =>
  str
    .replace(/\.?([A-Z])/g, (x, y) => '_' + y.toLowerCase())
    .replace(/^_/, '')
    .toUpperCase();

const camelize = str =>
  str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (letter, index) =>
      index === 0 ? letter.toLowerCase() : letter.toUpperCase()
    )
    .replace(/\s+/g, '');

const readFile = filePath =>
  new Promise(async resolve => {
    // await sleep(5000);
    fs.readFile(filePath, { encoding: 'utf-8' }, (err, data) => {
      if (err) return resolve(err);

      return resolve(data);
    });
  });

const writeFile = payload =>
  new Promise(async resolve => {
    const { filePath, data } = payload;
    fs.writeFile(filePath, data, err => {
      if (err) return resolve(err);

      resolve(false);
    });
  });

const createBasicStructure = ({ codePath, configFilePath }) =>
  new Promise(async resolve => {
    try {
      await exec(`rm -rf ${codePath}`);
      await exec(`mkdir -p ${codePath}/util`);
      await exec(`mkdir -p ${codePath}/API`);
      await exec(`mkdir -p ${codePath}/WebDashboard`);
      await exec(`mkdir -p ${codePath}/config && cp ${configFilePath} $_`);

      resolve(false);
    } catch (error) {
      resolve(error);
    }
  });

const generateRouteConfig = ({ models, codePath }) =>
  new Promise(async resolve => {
    try {
      const routeConfigArr = Object.keys(models).map(collection => ({
        endpoint: `/${camelize(collection)}`,
        fields: models[collection],
        modelName: collection,
      }));
      const routeConfig = `
        import moment from 'moment';
        import * as paramValidations from 'app/config/paramValidation';
        import * as beforeHooks from 'app/middlewares/beforeHooks';
        import * as afterHooks from 'app/middlewares/afterHooks';
        import * as listLogics from 'app/middlewares/listLogics';
        import * as createLogic from 'app/middlewares/createLogic';
        import * as deleteLogic from 'app/middlewares/deleteLogic';
        import * as patchLogics from 'app/middlewares/patchLogics';
        // import models from 'app/models';

        export default ${JSON.stringify(routeConfigArr)};
        `;
      const error = await writeFile({
        filePath: `${codePath}/API/server/routeConfig.js`,
        data: routeConfig,
      });
      if (error) return resolve(error);

      resolve(false);
    } catch (error) {
      resolve(error);
    }
  });

const createAPI = ({ codePath }) =>
  new Promise(async resolve => {
    try {
      const { name, models } = require(`${codePath}/config/index.js`);
      const apiPath = `${__dirname}/../ApiServer`;
      await exec(`cp -r ${apiPath}/. ${codePath}/API`);
      await exec(`cd ${codePath}/API && npm i`);
      const packageJson = require(`${codePath}/API/package.json`);
      packageJson.name = `${name}-api`;
      await writeFile({
        filePath: `${codePath}/API/package.json`,
        data: JSON.stringify(packageJson),
      });
      const appJs = require(`${codePath}/API/server/config/app.js`);
      appJs.host = `mongodb://localhost/${name}-development`;
      await writeFile({
        filePath: `${codePath}/API/server/config/app.js`,
        data: `module.exports =${JSON.stringify(appJs)}`,
      });
      const error = await generateRouteConfig({ models, codePath });
      if (error) return resolve(error);

      resolve(false);
    } catch (error) {
      resolve(error);
    }
  });

/**
  web funcs
 */

const generateWebRoutes = ({ models, codePath }) =>
  new Promise(async resolve => {
    try {
      const routesArr = Object.keys(models).map(collection => ({
        path: `/${camelize(collection)}`,
      }));

      const routes = `
        import React from 'react';
        import { Route } from 'react-router-dom';
        import Authorization from 'app/components/common/authorization';
        import LayoutWrapper from 'app/components/common/layoutWrapper';
        import Crud from 'app/crud';

        const routesArr = [{
          path: '/',
          component: () => <LayoutWrapper render={() => <div className="animate ">Yo</div>} />,
        }].concat(${JSON.stringify(routesArr)})

        const Routes = () => (
          <div>
            {routesArr.map(({ path, auth, component }, index) => {
              if (!auth) return <Route key={index} exact path={path} component={component ? component : Crud} />;
              return <Route key={index} exact path={path} component={Authorization(auth)(component)} />;
            })}
          </div>
        );

        export default Routes;
      `;
      const error = await writeFile({
        filePath: `${codePath}/WebDashboard/src/routes.js`,
        data: routes,
      });
      if (error) return resolve(error);

      resolve(false);
    } catch (error) {
      resolve(error);
    }
  });

const generateCrudConstants = ({ models, codePath }) =>
  new Promise(async resolve => {
    try {
      const routesArr = {};

      Object.keys(models).forEach(collection => {
        const data = {};
        Object.keys(models[collection]).forEach(key => {
          data[key] = null;
        });
        routesArr[`/${camelize(collection)}`] = {
          heading: collection,
          data,
          formName: `create${collection}Form`,
          api: `/${camelize(collection)}`,
          type: underscorize(collection),
          storeKey: camelize(collection),
        };
      });
      const crudConstants = `
        export const routesArr = ${JSON.stringify(routesArr)}
      `;
      const error = await writeFile({
        filePath: `${codePath}/WebDashboard/src/crud/constants.js`,
        data: crudConstants,
      });
      if (error) return resolve(error);

      resolve(false);
    } catch (error) {
      resolve(error);
    }
  });

const generateSidebar = ({ models, codePath }) =>
  new Promise(async resolve => {
    try {
      const sidebarArr = Object.keys(models).map(collection => ({
        name: collection,
        to: `/${camelize(collection)}`,
      }));

      const sidebar = `
        const defaultRoles = ['admin'];

        export const adminAreaArr = ${JSON.stringify(sidebarArr)}.map(item =>
          !item.subItems
            ? item
            : {
              ...item,
              roles: item.roles.concat(defaultRoles),
              subItems: item.subItems.map(subItem => ({
                ...subItem,
                roles: subItem.roles.concat(defaultRoles),
              })),
            }
        );

      `;
      const error = await writeFile({
        filePath: `${codePath}/WebDashboard/src/components/common/sidebar/constants.js`,
        data: sidebar,
      });
      if (error) return resolve(error);

      resolve(false);
    } catch (error) {
      resolve(error);
    }
  });

const generateInitialState = ({ models, codePath }) =>
  new Promise(async resolve => {
    try {
      const initialState = { auth: { user: {}, token: true } };

      Object.keys(models).forEach(collection => {
        initialState[`${camelize(collection)}`] = { data: [], initialValues: {} };
      });

      const initialStateObj = `
        export default ${JSON.stringify(initialState)};
      `;
      const error = await writeFile({
        filePath: `${codePath}/WebDashboard/src/redux/initialState.js`,
        data: initialStateObj,
      });
      if (error) return resolve(error);

      resolve(false);
    } catch (error) {
      resolve(error);
    }
  });

const generateReducer = ({ models, codePath }) =>
  new Promise(async resolve => {
    try {
      const items = { auth: { type: 'AUTH' } };
      Object.keys(models).forEach(collection => {
        items[`${camelize(collection)}`] = { type: underscorize(collection) };
      });

      const reducerObj = format(
        `import { combineReducers } from 'redux';
        import { reducer as form } from 'redux-form';
        import { reducer as toastr } from 'react-redux-toastr';
        import initialState from './initialState';
        const items = {items};
        const reducers = { form, toastr };
        
        Object.keys(items).forEach(item => {
          reducers[item] = (state = initialState[item], action) => {
            const itemType = items[item].type
            switch (action.type) {
              case 'LOGOUT': {
                return { ...initialState[item] };
              }
              case itemType + '_CLEAR':
                return { data: [] };
              case itemType + '_SET_STATE':
                return { ...state, ...action.payload };
              case itemType + '_FETCH_ALL_SUCCESS': {
                if (!action.payload) return state;
                return { ...state, data: action.payload };
              }
              case itemType + '_CREATE_SUCCESS': {
                const { createdRec } = action.payload;
                if (!createdRec) {
                  alert('error in reducer', 'created Rec not found');
                  return state;
                }
                if (createdRec.firstTripRec) {
                  return {
                    ...state,
                    data: state.data.concat([createdRec.firstTripRec, createdRec.secondTripRec]),
                  };
                }
                return { ...state, data: state.data.concat([createdRec]) };
              }
              case itemType + '_FILL_FORM': {
                return { ...state, initialValues: action.payload };
              }
              case itemType + '_DELETE': {
                const { customStateChangeDelete } = action.payload;
                if (customStateChangeDelete) {
                  const newState = customStateChangeDelete({ ...action.payload, state });
                  if (newState) return newState;
                }

                return { ...state, data: state.data.filter(item => item._id !== action.payload._id) };
              }
              case itemType + '_UPDATE': {
                let { index } = action.payload;
                const { newRec, id, customStateChangePatch } = action.payload;
                if (!newRec) return state;
                if (customStateChangePatch) {
                  const newState = customStateChangePatch({ ...action.payload, state });
                  // console.log(newState, 'newState');
                  if (newState) return newState;
                }
                const data = state.data;
                if (!index && id) index = data.findIndex(item => item._id === id);

                return {
                  ...state,
                  data: [...data.slice(0, index), newRec, ...data.slice(index + 1, data.length)],
                };
              }
              default:
                return state;
            }
            };
          });
        
        export default combineReducers(reducers);`,
        {
          items: JSON.stringify(items),
        }
      );

      const error = await writeFile({
        filePath: `${codePath}/WebDashboard/src/redux/reducers.js`,
        data: reducerObj,
      });
      if (error) return resolve(error);

      resolve(false);
    } catch (error) {
      resolve(error);
    }
  });

const createWebDashboard = ({ codePath }) =>
  new Promise(async resolve => {
    try {
      const { name, models } = require(`${codePath}/config/index.js`);
      const webPath = `${__dirname}/../WebDashboard`;
      await exec(`cp -r ${webPath}/. ${codePath}/WebDashboard`);
      await exec(`cd ${codePath}/WebDashboard && npm i`);
      const error = await generateWebRoutes({ models, codePath, webPath });
      if (error) return resolve(error);
      const crudError = await generateCrudConstants({ models, codePath, webPath });
      if (crudError) return resolve(crudError);
      const sidebarError = await generateSidebar({ models, codePath, webPath });
      if (sidebarError) return resolve(sidebarError);
      const initialStateError = await generateInitialState({ models, codePath, webPath });
      if (initialStateError) return resolve(initialStateError);
      const reducerError = await generateReducer({ models, codePath, webPath });
      if (reducerError) return resolve(reducerError);

      resolve(false);
    } catch (error) {
      resolve(error);
    }
  });

module.exports = { readFile, writeFile, createBasicStructure, createAPI, createWebDashboard };
