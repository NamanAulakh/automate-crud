import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Button } from 'react-bootstrap';
import { get } from 'lodash';
import { crud } from 'app/util';
import Wrapper from './Form';
import Modal from 'app/components/common/modal';
// import { renderPayTcBody } from './func';

const chargeRiders = async ({ dispatch, tripId }) =>
  await dispatch(
    crud({ uri: `payment/chargeRiders?tripId=${tripId}`, func: 'patch', type: 'TRIP' })
  );

const payTc = async ({ dispatch, tripId }) =>
  await dispatch(crud({ uri: `payment/payTc?tripId=${tripId}`, func: 'patch', type: 'TRIP' }));

export default props => {
  const userType = get(props, 'store.auth.user.userType', null);
  const isAdmin = userType === 'admin';
  const trip = props.item ? props.storeData.find(trip => trip._id === props.item._id) : null;
  const isTrip = trip && props.path === '/trip';
  const isTcNotAssigned = isTrip && trip.assignedTcId === null;
  if (isTcNotAssigned) {
    let keys = props.keys;
    keys = keys.filter(key => key !== 'driverId' && key !== 'vehicleId').concat(['minBookedSeats']);
    props = { ...props, keys };
  }
  const name = props.onCancel ? `${props.heading} Actions` : `Create ${props.heading}`;
  const deleteTxt = `Delete ${props.heading}`;
  const updateTxt = `Update ${props.heading}`;

  return (
    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
      <div className="panel panel-primary adddriverpanel">
        <div className="panel-heading">
          <span>
            {' '}
            <FormattedMessage id={props.heading} defaultMessage={name} />
          </span>
        </div>

        <div className="panel-body" style={{ overflow: 'scroll' }}>
          <Wrapper {...props} />

          {!props.onCancel ? (
            <div>
              <Button bsStyle="primary" onClick={props.onSubmit} style={{ margin: 20 }}>
                {` ${name} `}
              </Button>
            </div>
          ) : (
            <span>
              <Button bsStyle="primary" onClick={props.onCancel} style={{ margin: 20 }}>
                {' Cancel '}
              </Button>

              <span>
                <Button
                  bsStyle="primary"
                  onClick={() => props.onUpdate(false)}
                  style={{ margin: 20 }}
                >
                  {` ${updateTxt} `}
                </Button>

                {/* <Button bsStyle="primary" onClick={props.onDelete} style={{ margin: 20 }}> */}
                <Button bsStyle="primary" onClick={props.onShow} style={{ margin: 20 }}>
                  {` ${deleteTxt} `}
                </Button>
              </span>

              {isTcNotAssigned && (
                <Button
                  bsStyle="primary"
                  onClick={() => props.onUpdate(true)}
                  style={{ margin: 20 }}
                >
                  {' SignUp '}
                </Button>
              )}

              {isAdmin && (isTrip || props.editProp) && !isTcNotAssigned && (
                <span>
                  <Button
                    bsStyle="primary"
                    onClick={() => chargeRiders({ dispatch: props.dispatch, tripId: trip._id })}
                    style={{ margin: 20 }}
                  >
                    {' Charge Riders '}
                  </Button>

                  {/* <Button bsStyle="primary" onClick={props.onShowTcPay} style={{ margin: 20 }}>
                    {' Pay TC '}
                  </Button> */}
                </span>
              )}
            </span>
          )}
        </div>
      </div>

      <Modal
        show={props.showDeleteModal}
        onHide={props.onHide}
        text={`Delete ${props.heading}`}
        onSuccess={props.onDelete}
      />

      {/* {props.showPayTcModal && (
        <Modal
          show={props.showPayTcModal}
          onHide={props.onHideTcPay}
          renderBody={() => renderPayTcBody(props)}
          heading={'Transfer Info'}
          text={'Transfer'}
          onSuccess={() => payTc({ dispatch: props.dispatch, tripId: trip._id })}
        />
      )} */}
    </div>
  );
};
