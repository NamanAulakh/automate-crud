import React, { Component } from 'react';
import LayoutWrapper from '../layoutWrapper';

export default allowedRoles => WrappedComponent =>
  class Auth extends Component {
    render() {
      const role = localStorage.getItem('userType');
      // console.log(role, '.....', allowedRoles);
      if (allowedRoles.includes(role)) return <WrappedComponent {...this.props} />;

      return <LayoutWrapper render={() => <div>{'you don\'t have access for this page'}</div>} />;
    }
  };
