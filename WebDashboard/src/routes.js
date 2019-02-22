/* eslint-disable react/display-name */
import React from 'react';
import { Route } from 'react-router-dom';
import Authorization from 'app/components/common/authorization';
import Crud from 'app/crud';
import LayoutWrapper from 'app/components/common/layoutWrapper';

const routesArr = [
  {
    path: '/',
    component: () => <LayoutWrapper render={() => <div className="animate ">Yo</div>} />,
  },
  { path: '/vehicleType' },
];

const Routes = () => (
  <div>
    {routesArr.map(({ path, auth, component }, index) => {
      if (!auth)
        return <Route key={index} exact path={path} component={component ? component : Crud} />;
      return <Route key={index} exact path={path} component={Authorization(auth)(component)} />;
    })}
  </div>
);

export default Routes;
