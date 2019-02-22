import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { get } from 'lodash';
import styles from './styles';

class PickUpDropdown extends Component {
  render() {
    const {
      input,
      label,
      className,
      meta: { touched, error },
      cities,
      routeId,
      routes,
      assignedTcId,
      vehicles,
      drivers,
      props,
    } = this.props;
    if (!input) return null;
    const { disableField } = props;
    const disabled = disableField ? disableField(props, input.name) : false;
    const condition1 = input.name === 'pickUpPoint' || input.name === 'dropOffPoint';
    const condition2 = input.name === 'driverId' || input.name === 'vehicleId';
    let defaultTxt = condition1 ? 'Please select a route first' : 'Please select a tc first';
    let options = [];
    // pickUpPoint, dropOffPoint
    if (condition1 && routeId && routeId !== 'Please select an option') {
      defaultTxt = 'Please select an option';
      const route = routes.find(({ _id }) => _id === routeId);
      if (input.name === 'pickUpPoint') {
        const source = route.source;
        const sourcePoints = cities.filter(({ name }) => name === source)[0].points;
        options = sourcePoints.map(point => ({ display: point.name, val: JSON.stringify(point) }));
      }
      if (input.name === 'dropOffPoint') {
        const destination = route.destination;
        const destinationPoints = cities.filter(({ name }) => name === destination)[0].points;
        options = destinationPoints.map(point => ({
          display: point.name,
          val: JSON.stringify(point),
        }));
      }
    }
    // driverId, vehicleId
    if (condition2 && assignedTcId && assignedTcId !== 'Please select an option') {
      defaultTxt = 'Please select an option';
      if (input.name === 'vehicleId') {
        const vehicleList = vehicles.filter(({ tcId }) => tcId === assignedTcId);
        options = vehicleList.map(vehicle => ({ display: vehicle.regNo, val: vehicle._id }));
      }
      if (input.name === 'driverId') {
        const driverList = drivers.filter(({ tcId }) => tcId === assignedTcId);
        options = driverList.map(driver => ({ display: driver.email, val: driver._id }));
      }
    }

    return (
      <div>
        {label !== 'VN' ? (
          <label className="col-md-4 col-lg-4 col-sm-4 formlabel"> {label}</label>
        ) : (
          <span style={{ width: 0 }} />
        )}

        <div>
          <div style={styles.parentDiv}>
            <select style={styles.select} className={className} {...input} disabled={disabled}>
              <option value={''}>{defaultTxt}</option>

              {options.map((option, index) => (
                <option key={index} value={option.val}>
                  {option.display}
                </option>
              ))}
            </select>
          </div>

          {touched &&
            (error && (
              <span style={{ color: 'red', textAlign: 'center', display: 'block' }}>{error}</span>
            ))}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (store, ownProps) => {
  const { city, form, route, vehicle, driver } = store;
  const { formName } = ownProps;

  return {
    cities: city.data,
    routes: route.data,
    vehicles: vehicle.data,
    drivers: driver.data,
    routeId: get(form, `${formName}.values.routeId`, null),
    assignedTcId: get(form, `${formName}.values.assignedTcId`, null),
  };
};
const bindActions = dispatch => ({ dispatch });
export default withRouter(
  connect(
    mapStateToProps,
    bindActions
  )(PickUpDropdown)
);
