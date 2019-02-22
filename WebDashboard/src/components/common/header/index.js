import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import $ from 'jquery';
import { get } from 'lodash';
import { connect } from 'react-redux';
import { destroy } from 'redux-form';
import { NavDropdown, MenuItem } from 'react-bootstrap';
import { Link, withRouter } from 'react-router-dom';
import 'app/styles/common/header.scss';

const iconImage = require('app/resources/images/Intercity_Logo.jpg');
const profileImage = require('app/resources/images/flat-avatar.png');

const showMenu = () => $('.dashboard-page').toggleClass('push-right');

class TopNav extends Component {
  state = { rtlClass: true };

  rightToLeft = () => {
    this.setState({ rtlClass: !this.state.rtlClass });
    if (this.state.rtlClass) return $('body').addClass('rtl');
    $('body').removeClass('rtl');
  };

  logOut = async () => {
    const { dispatch, history } = this.props;
    await dispatch({ type: 'LOGOUT' });
    // dispatch(destroy('myForm'));
    localStorage.clear();
    history.push('/');
  };

  render() {
    const { userType } = this.props;
    const path = get(this, 'props.history.location.pathname', null);
    const backgroundColor = path && path === '/home' ? '#3f7498' : '#184C6D';

    return (
      <nav className="navbar navbar-fixed-top topNavbar" role="navigation">
        <div className="navbar-header navbarHeader" style={{ backgroundColor }}>
          <button
            type="button"
            className="navbar-toggle"
            onClick={e => {
              e.preventDefault();
              showMenu();
            }}
            target="myNavbar"
          >
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar" />
            <span className="icon-bar" />
            <span className="icon-bar" />
          </button>
          <Link to="/" className="navbar-brand navbarBrand">
            {/* <img src={iconImage} className="topnavImgLeft" /> */}

            <span className="title topnavText">WebDashboard</span>
          </Link>
        </div>

        <div className="navbarHead">
          <div id="myNavbar" className={'collapse navbar-collapse navbarCollapse'}>
            {/*
              <form className={`navbar-form ${s.navbarForm} navbar-left`} role="search">
                <span className={`glyphicon glyphicon-search ${s.glyphiconStyle}`} />
                <div className="form-group">
                  <input type="text" className={`form-control ${s.formControl}`} placeholder="" />
                </div>
              </form>
            */}
            {/* <span className="componentTitle">
              {' '}
              <FormattedMessage
                id={'admin_dashboardHi'}
                defaultMessage={`${userType.toUpperCase()} DASHBOARD`}
              />
            </span> */}
            <ul className={'nav navbar-nav pull-right navbar-right pullRight ulNavbar'}>
              {/*
                <NavDropdown
                    eventKey={8}
                    title={
                      this.props.intl.formatMessage(messages.language)
                    }
                    id="basic-nav-dropdown"
                    onSelect={this.changeLanguage}
                  >
                    <MenuItem eventKey={'en-US'}>English</MenuItem>
                    <MenuItem eventKey={'hi'}>Hindi</MenuItem>
                    <MenuItem eventKey={'ur'}>Urdu</MenuItem>
                  </NavDropdown>
                <li>
                  <a onClick={this.rightToLeft} >
                    <span>
                      <FormattedMessage
                        id="ltr/rtl"
                        defaultMessage="LTR/RTL"
                      />
                    </span>
                  </a>
                </li>
              */}
              <NavDropdown
                id="dropDown4"
                className="navbarProfile"
                eventKey={4}
                title={
                  <span>
                    <span className={'hidden-sm topnavAdminName'}>
                      {' '}
                      <FormattedMessage
                        id={'adminHi'}
                        defaultMessage={userType ? userType.toUpperCase() : 'USER'}
                      />
                    </span>
                    <img src={profileImage} className="topnavImg" role="presentation" />
                  </span>
                }
              >
                {/* <MenuItem className="dropdownLogout" onClick={this.logOut}> */}
                <MenuItem className="dropdownLogout">
                  <FormattedMessage id="logout" defaultMessage="Logout" />
                </MenuItem>
              </NavDropdown>
            </ul>
          </div>
          <ul className="nav navbar-nav pull-right ulNavbar hidd" style={{ marginTop: 8 }}>
            <NavDropdown
              id="navDropDown11"
              eventKey={4}
              title={
                <span>
                  <img src={profileImage} className="topnav-img topnavImg" alt="" />
                </span>
              }
              noCaret
              className="dropdown admin-dropdown dropdown"
            >
              <MenuItem
                onClick={e => {
                  e.preventDefault();
                  this.props.history.push('/');
                }}
              >
                <FormattedMessage id="logout" defaultMessage="Logout" />
              </MenuItem>
            </NavDropdown>
          </ul>
        </div>
      </nav>
    );
  }
}

export default withRouter(
  connect(
    ({ auth }) => ({ userType: get(auth, 'user.userType', null) }),
    dispatch => ({ dispatch })
  )(TopNav)
);
