import React from 'react';
import Sidebar from '../sidebar';
import 'app/styles/common/layout.scss';
import Header from '../header';

export default ({ render }) => (
  <div className="dashboard-page dashboardPage">
    <Sidebar />

    <Header />

    <section id="bodyContainer" className="uiView">
      {render()}
    </section>
  </div>
);
