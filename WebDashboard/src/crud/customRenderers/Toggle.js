import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './styles';

class Toggle extends Component {
  render() {
    const { isRoundTripView } = this.props;

    return (
      <div className="row">
        <div className="col-md-1" style={styles.rowContentFit}>
          <input
            value={isRoundTripView}
            defaultChecked={isRoundTripView}
            type="checkbox"
            name="groupTrips"
            onClick={() =>
              this.props.dispatch({
                type: 'TRIP_SET_STATE',
                payload: { isRoundTripView: !this.props.isRoundTripView },
              })
            }
          />
        </div>

        <div className="col-md-5">
          <p>Show Round Trips Grouped</p>
        </div>
      </div>
    );
  }
}

export default connect(
  ({ trip }) => ({ isRoundTripView: trip.isRoundTripView }),
  dispatch => ({ dispatch })
)(Toggle);
