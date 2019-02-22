// Refer old param-validation file for better use of Joi
import Joi from 'joi';

export const updateUser = {
  body: {
    _id: Joi.string(),
    email: Joi.string(),
    password: Joi.string(),
    phoneNo: Joi.string(),
    userType: Joi.string(),
    fname: Joi.string(),
    lname: Joi.string(),
  },
};

export const createReservation = {
  body: {
    riderId: Joi.string().required(),
    tripId: Joi.string().required(),
    totalSeats: Joi.number().required(),
  },
};

export const updatePasswordParam = {
  body: {
    email: Joi.string().required(),
    password: Joi.string(),
    code: Joi.number(),
  },
};

export const forgotPasswordParam = { body: { password: Joi.string().required() } };

export const createTrip = {
  body: {
    routeId: Joi.string().required(),
    pickUpPoint: Joi.array()
      .items(
        Joi.object().keys({
          coords: Joi.string().required(),
          address: Joi.string().required(),
          name: Joi.string().required(),
        })
      )
      .required(),
    dropOffPoint: Joi.array()
      .items(
        Joi.object().keys({
          coords: Joi.string().required(),
          address: Joi.string().required(),
          name: Joi.string().required(),
        })
      )
      .required(),
    departure: Joi.number().required(),
    driverId: Joi.string(),
    vehicleId: Joi.string(),
    tcSignUpInfo: Joi.array().items(
      Joi.object().keys({ tcId: Joi.string().required(), minBookedSeats: Joi.number().required() })
    ),
    assignedTcId: Joi.string(),
    finalizedVehicleTypeId: Joi.string(),
  },
};

export const updateTrip = {
  body: {
    routeId: Joi.string(),
    pickUpPoint: Joi.array().items(
      Joi.object().keys({
        coords: Joi.string().required(),
        address: Joi.string().required(),
        name: Joi.string().required(),
      })
    ),
    dropOffPoint: Joi.array().items(
      Joi.object().keys({
        coords: Joi.string().required(),
        address: Joi.string().required(),
        name: Joi.string().required(),
      })
    ),
    departure: Joi.number(),
    // driverId: Joi.string(),
    // vehicleId: Joi.string(),
    tcSignUpInfo: Joi.array().items(
      Joi.object().keys({ tcId: Joi.string().required(), minBookedSeats: Joi.number().required() })
    ),
    // assignedTcId: Joi.string(),
    // finalizedVehicleTypeId: Joi.string(),
  },
};

export const createCity = {
  body: {
    name: Joi.string().required(),
    points: Joi.array()
      .items(
        Joi.object().keys({
          coords: Joi.string().required(),
          address: Joi.string().required(),
          name: Joi.string().required(),
        })
      )
      .required(),
  },
};

export const createTC = {
  body: {
    userIds: Joi.array()
      .items(Joi.string().required())
      .required(),
    name: Joi.string().required(),
    address: Joi.string().required(),
    phoneNo: Joi.string().required(),
    coords: Joi.string(),
  },
};

export const createUserParam = {
  body: {
    email: Joi.string().required(),
    password: Joi.string(),
    phoneNo: Joi.string(),
    userType: Joi.string().required(),
    fname: Joi.string(),
    lname: Joi.string(),
    rating: Joi.number(),
  },
};

export const fbRegisterParam = {
  body: {
    email: Joi.string().required(),
    userType: Joi.string().required(),
    fname: Joi.string().required(),
    lname: Joi.string().required(),
  },
};

export const loginParam = {
  body: {
    email: Joi.string().required(),
    password: Joi.string(),
  },
};

export const createVehicle = {
  body: {
    vehicleTypeId: Joi.string().required(),
    features: Joi.string().required(),
    tcId: Joi.string().required(),
    totalSeats: Joi.number().required(),
    regNo: Joi.string().required(),
  },
};

export const createVehicleType = {
  body: { name: Joi.string().required(), minSeats: Joi.number().required() },
};

export const createCoupon = {
  body: {
    name: Joi.string().required(),
    expirationDate: Joi.number().required(),
    type: Joi.number().required(),
    value: Joi.number().required(),
  },
};

export const createRoute = {
  body: {
    source: Joi.string().required(),
    destination: Joi.string().required(),
    costPerSeat: Joi.array()
      .items(
        Joi.object().keys({ vehicleTypeId: Joi.string().required(), cost: Joi.number().required() })
      )
      .required(),
  },
};
