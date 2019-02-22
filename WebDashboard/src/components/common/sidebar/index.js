import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Collapse } from 'react-bootstrap';
import { get } from 'lodash';
import 'app/styles/common/sidebar.scss';
import { Link, withRouter } from 'react-router-dom';
import { adminAreaArr } from './constants';
const customerIcon = require('app/resources/images/dashboardIcons/customer_icon.png');
const appConfIcon = require('app/resources/images/dashboardIcons/app_confIcon.png');

class Sidebar extends Component {
  state = {};

  componentDidMount = () => {
    adminAreaArr
      .map(({ varName }) => varName)
      .filter(item => item)
      .map(item => ({ [item]: false }))
      .forEach(item => {
        this.setState({ ...this.state, ...item });
      });
  };

  render() {
    const { userType } = this.props;
    const path = get(this, 'props.history.location.pathname', null);

    return (
      <div className="sidebar">
        <div className="sidenav-outer sidenavOuter">
          <ul>
            {adminAreaArr.map(({ to, name, roles, subItems, varName }, index) => {
              // if (!roles.find(role => role === userType)) return null;
              const backgroundColor = path && path === to ? '#3f7498' : '#184C6D';
              if (!subItems) {
                return (
                  <li className="sidemenuListTab" style={{ backgroundColor }} key={index}>
                    <Link to={to}>
                      <img alt="icon" src={appConfIcon} className="topnavImgLeft" />

                      <span className="title">{name}</span>
                    </Link>
                  </li>
                );
              }
              const bgColor2 = this.state[varName] ? '#3f7498' : '#184C6D';

              return (
                <li className="sidemenuListTab" key={index}>
                  <a
                    onClick={() => this.setState({ [varName]: !this.state[varName] })}
                    style={{ cursor: 'pointer', backgroundColor: bgColor2 }}
                  >
                    <img alt="icon" src={customerIcon} className="topnavImgLeft" />

                    <span className="title">{name}</span>

                    {this.state[varName] ? (
                      <span className="text-align-right glyphicon glyphicon-minus sidemenuListAddIcon" />
                    ) : (
                      <span
                        className={'text-align-right glyphicon glyphicon-plus sidemenuListAddIcon'}
                      />
                    )}
                  </a>

                  <Collapse in={this.state[varName]}>
                    <div>
                      <ul>
                        {subItems.map(
                          (
                            { to: subItemTo, name: subItemName, roles: subItemRoles },
                            subItemIndex
                          ) => {
                            if (!subItemRoles.find(role => role === userType)) return null;

                            return (
                              <li
                                className="sidemenuListTab"
                                style={{ backgroundColor: 'black' }}
                                key={subItemIndex}
                              >
                                <Link to={subItemTo}>
                                  <img alt="icon" src={appConfIcon} className="topnavImgLeft" />

                                  <span className="title">{subItemName}</span>
                                </Link>
                              </li>
                            );
                          }
                        )}
                      </ul>
                    </div>
                  </Collapse>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  }
}

export default withRouter(
  connect(
    ({ auth }) => ({ userType: get(auth, 'user.userType', null) }),
    null
  )(Sidebar)
);
