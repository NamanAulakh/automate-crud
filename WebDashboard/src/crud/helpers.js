import { get } from 'lodash';
import { toastr } from 'react-redux-toastr';

export const modifyTC = ({ values }) => ({ ...values, userIds: [values.owner] });

export const modifyRoute = ({ values, vehicleTypes }) => {
  const costPerSeat = [];
  const minAmtToPay = [];
  Object.keys(values)
    .filter(key => key !== 'source' && key !== 'destination' && !key.includes('min'))
    .forEach(key => {
      const vehicleType = vehicleTypes.find(type => type.name === key);
      const vehicleTypeId = vehicleType ? vehicleType._id : null;
      const vehicleTypeName = vehicleType ? vehicleType.name : '';
      const obj = { vehicleTypeId, cost: values[key], vehicleTypeName };

      costPerSeat.push(obj);
    });

  Object.keys(values)
    .filter(key => key.includes('min'))
    .forEach(key => {
      const vehicleTypeName = key.replace('min-', '');
      const vehicleType = vehicleTypes.find(type => type.name === vehicleTypeName);
      const vehicleTypeId = vehicleType ? vehicleType._id : null;
      const obj = { vehicleTypeId, amount: values[key], vehicleTypeName };

      minAmtToPay.push(obj);
    });

  return { ...values, costPerSeat, minAmtToPay };
};

export const modifyCity = ({ values }) => {
  const { name, pointAddress, pointCoords, pointName } = values;

  return {
    name,
    points: pointAddress.map((address, index) => ({
      address: get(address, 'value', null),
      coords: get(pointCoords, `[${index}].value`, null),
      name: get(pointName, `[${index}].value`, null),
    })),
  };
};

export const modifyTrip = data => {
  const { values, isSignUp, props } = data;
  const {
    departure,
    dropOffPoint,
    pickUpPoint,
    assignedTcId,
    minBookedSeats,
    departureReturn,
  } = values;
  const creator = get(props, 'store.auth.user.email', 'Creator not found');
  if (isSignUp) {
    if (!minBookedSeats || !assignedTcId) {
      toastr.warning('select tc and minBookedSeats');
      return null;
    }
    return {
      tcSignUpInfo: [{ tcId: assignedTcId, minBookedSeats, timestamp: moment().valueOf() }],
    };
  }

  return {
    ...values,
    creator,
    departure: moment(departure).valueOf(),
    departureReturn: departureReturn ? moment(departureReturn).valueOf() : null,
    dropOffPoint: [JSON.parse(dropOffPoint)],
    pickUpPoint: [JSON.parse(pickUpPoint)],
    status: 'assigned',
  };
};

export const modifyCoupon = ({ values }) => {
  const { expirationDate, name, type, value, tripSeq = undefined } = values;

  return {
    expirationDate: moment(expirationDate).valueOf(),
    name,
    type: parseInt(type),
    value: parseFloat(value),
    tripSeq,
  };
};

export const modifyReservn = ({ values }) => ({
  ...values,
  names: typeof names === 'string' ? values.names.split(',') : values.names,
});

// fillForm functions
export const fillCityForm = ({ item }) => {
  const { name, points } = item;
  const pointAddress = points.map(point => ({ value: point.address, label: point.address }));
  const pointCoords = points.map(point => ({ value: point.coords, label: point.coords }));
  const pointName = points.map(point => ({ value: point.name, label: point.name }));

  return { name, pointAddress, pointCoords, pointName };
};

export const fillTcForm = ({ item }) => ({ ...item, owner: item.userData[0]._id });

export const fillRouteForm = ({ item }) => {
  const obj = {};
  if (item.costPerSeat)
    item.costPerSeat.forEach(({ cost, vehicleTypeName }) => {
      obj[vehicleTypeName] = cost;
    });
  if (item.minAmtToPay)
    item.minAmtToPay.forEach(({ amount, vehicleTypeName }) => {
      obj[`min-${vehicleTypeName}`] = amount;
    });

  return { source: item.source, destination: item.destination, ...obj };
};

export const fillTripForm = ({ item }) => {
  const { storeData } = item;
  const { departure, pickUpPoint, dropOffPoint, departureReturn } = storeData;

  return {
    ...storeData,
    departure: moment(departure).format(moment.HTML5_FMT.DATETIME_LOCAL),
    departureReturn: moment(departureReturn).format(moment.HTML5_FMT.DATETIME_LOCAL),
    pickUpPoint: JSON.stringify(pickUpPoint[0]),
    dropOffPoint: JSON.stringify(dropOffPoint[0]),
  };
};

export const fillCouponForm = ({ item }) => ({
  ...item,
  expirationDate: moment(item.expirationDate).format(moment.HTML5_FMT.DATETIME_LOCAL),
});
