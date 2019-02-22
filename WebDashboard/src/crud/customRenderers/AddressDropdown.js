import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { get } from 'lodash';
import CreatableSelect from 'react-select/lib/Creatable';

import styles from './styles';

class AddressDropdown extends Component {
  render() {
    const {
      input,
      label,
      meta: { touched, error, warning },
    } = this.props;

    return (
      <div>
        {label !== 'VN' ? (
          <label className="col-md-4 col-lg-4 col-sm-4 formlabel"> {label}</label>
        ) : (
          <span style={{ width: 0 }} />
        )}

        <div>
          <span style={styles.parentDiv2}>
            {/* <CreatableSelect isMulti onBlur={null} /> */}
            <CreatableSelect isMulti onChange={input.onChange} value={input.value} />
          </span>

          {touched &&
            (error && (
              <span style={{ color: 'red', textAlign: 'center', display: 'block' }}>{error}</span>
            ))}
        </div>
      </div>
    );
  }
}

// const mapStateToProps = ({ city, form, route, vehicle, driver }) => ({
//   cities: city.data,
//   routes: route.data,
//   vehicles: vehicle.data,
//   drivers: driver.data,
//   routeId: get(form, 'createTripForm.values.routeId', null),
//   assignedTcId: get(form, 'createTripForm.values.assignedTcId', null),
// });
// const bindActions = dispatch => ({ dispatch });
export default withRouter(
  connect(
    null,
    null
  )(AddressDropdown)
);
