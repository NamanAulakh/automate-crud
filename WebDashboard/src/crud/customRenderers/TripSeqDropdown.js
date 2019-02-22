import React from 'react';
import styles from './styles';
import { get } from 'lodash';

export default props => {
  const {
    input,
    label,
    className,
    meta: { touched, error },
  } = props;
  const trips = get(props, 'props.store.trip.data', []);
  if (trips.length === 0) return null;
  const upcomingTrips = trips.filter(
    ({ departureReturn, isDeleted }) =>
      departureReturn && departureReturn > moment().valueOf() && !isDeleted
  );
  if (!input) return null;
  const options = upcomingTrips.map(({ routeData, departure, seq }) => ({
    display: `${routeData.source} <--> ${routeData.destination} / ${moment(departure).format(
      'ddd, MMM Do YYYY'
    )} / ${moment(departure).format('h:mm a')}`,
    val: seq,
  }));

  return (
    <div>
      {label !== 'VN' ? (
        <label className="col-md-4 col-lg-4 col-sm-4 formlabel"> {label}</label>
      ) : (
        <span style={{ width: 0 }} />
      )}

      <div>
        <div style={styles.parentDiv}>
          <select style={styles.select} className={className} {...input}>
            <option value={''}>{'Please select a tripSeq'}</option>

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
};
