import React from 'react';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';
import { crud } from 'app/util';
import './styles.scss';

const noItems = type => (
  <table className="col-xs-12 panelTable">
    <thead>
      <tr className="panelTableHead">
        <td style={{ padding: 10 }}>{`No. of ${type}s are Zero`}</td>
      </tr>
    </thead>
  </table>
);

export const modifyTripView = props => {
  const { storeData, store, editProp } = props;
  const isRoundTripView = store.trip.isRoundTripView;
  if (!storeData || storeData.length === 0) return noItems('trip');
  let trips = store.trip.data;
  if (editProp) trips = trips.filter(({ _id }) => _id === editProp);
  if (isRoundTripView) trips = trips.filter(({ isReturnLeg }) => !isReturnLeg);

  return trips.map(
    ({
      seq,
      status,
      routeId,
      assignedTcId,
      driverId,
      vehicleId,
      departure,
      isReturnLeg,
      dropOffPoint,
      pickUpPoint,
      creator,
      _id,
      roundTripId,
      amountChargedSuccessfully,
      chargeSuccessPercent,
      amountTransferedSuccessfully,
      statusOfTransfer,
      defPerCut,
    }) => {
      const route = store.route.data.find(({ _id }) => _id === routeId);
      const assignedTc =
        status === 'assigned' && store.tc.data.find(({ _id }) => _id === assignedTcId)
          ? store.tc.data.find(({ _id }) => _id === assignedTcId).name
          : 'not Assigned';
      const driver =
        status === 'assigned' && store.driver.data.find(({ _id }) => _id === driverId)
          ? store.driver.data.find(({ _id }) => _id === driverId).email
          : 'not Assigned';
      const vehicle =
        status === 'assigned' && store.vehicle.data.find(({ _id }) => _id === vehicleId)
          ? store.vehicle.data.find(({ _id }) => _id === vehicleId).regNo
          : 'not Assigned';
      const routeName = isRoundTripView
        ? `${route.source} <--> ${route.destination}`
        : isReturnLeg
          ? `${route.destination} -> ${route.source}`
          : `${route.source} -> ${route.destination}`;

      return {
        Seq: seq,
        Route: routeName,
        _id,
        Status: status,
        'Assigned TC': assignedTc,
        Departure: moment(departure).format('ddd, MMM Do YYYY, h:mm a'),
        Driver: driver,
        'TC Cut': defPerCut,
        'Vehicle Reg. No.': vehicle,
        'Drop Off Point': dropOffPoint[0].name,
        'Pick Up Point': pickUpPoint[0].name,
        Creator: creator,
        roundTripId,
        'Amount Charged': amountChargedSuccessfully,
        'Charge Success %': chargeSuccessPercent,
        'Amount Transfered': amountTransferedSuccessfully,
        'Transfer Status': JSON.stringify(statusOfTransfer),
      };
    }
  );
};

const refundReserv = async ({ _id, dispatch }) =>
  await dispatch(crud({ uri: `payment/refundCharge?_id=${_id}`, func: 'patch' }));

const cancelReservn = ({ _id }) => async dispatch =>
  await dispatch(
    crud({
      uri: `reservation/delete?_id=${_id}&type=web`,
      func: 'delete',
      type: 'RESERVATION',
      successCallback: () => dispatch({ type: 'RESERVATION_DELETE', payload: { _id } }),
    })
  );

export const listReservn = props => {
  const { store, dispatch, reservationId, editItem } = props;
  const userType = get(store, 'auth.user.userType', null);
  const reservations = store.reservation.data;
  const reservation = reservations.find(({ _id }) => _id === reservationId);
  if (!reservation) return null;
  const { routeData, riderData, tripData, statusOfRefund, _id } = reservation;
  const { email } = riderData;
  const { source, destination } = routeData;
  const { departure, departureReturn } = tripData;
  const heading = `Trip Details: ${source} <-> ${destination} | Departure: ${moment(
    departure
  ).format('ddd, MMM Do YYYY, h:mm a')} | DepartureReturn: ${moment(departureReturn).format(
    'ddd, MMM Do YYYY, h:mm a'
  )}`;
  const keys = [
    'totalSeats',
    'statusOfPayment',
    'statusOfRefund',
    // 'amountCharged',
    'totalCharge',
    'amountTransfered',
  ];

  return (
    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
      <div className="panel panel-primary">
        <div className="panel-heading panelheading" style={{ backgroundColor: 'lightgrey' }}>
          {' '}
          <FormattedMessage id={heading} defaultMessage={heading} />
        </div>

        <div className="panel-body panelTableBody">
          <div style={{ overflowX: 'auto' }}>
            <table className="table col-xs-12 panelTable">
              <thead>
                <tr className="panelTableHead">
                  {['email'].concat(keys).map((item, index) => (
                    <th className="col-md-2" key={index}>
                      {' '}
                      <FormattedMessage id={item} defaultMessage={item} />
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="panelTableTBody">
                <tr className="table-row">
                  <td>{email}</td>

                  {keys.map((key, index) => (
                    <td key={index}>{reservation[key]}</td>
                  ))}

                  {statusOfRefund !== 'succeeded' && (
                    <td className="action-buttons-left" style={{ left: 20 }}>
                      <button onClick={() => refundReserv({ _id: reservationId, dispatch })}>
                        Refund
                      </button>
                    </td>
                  )}

                  {userType && userType !== 'tcAdmin' && (
                    <td className="action-buttons">
                      <button onClick={() => dispatch(cancelReservn({ _id }))}>Cancel</button>
                    </td>
                  )}

                  {userType && userType !== 'tcAdmin' && (
                    <td className="action-buttons-left">
                      <button onClick={() => editItem({ item: reservation })}>Edit</button>
                    </td>
                  )}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
