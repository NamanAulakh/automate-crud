const roles = {
  // others
  '/users/list': ['tcAdmin'],
  '/createAdmin': [],
  '/delete': [],
  // vehicleType
  '/vehicleType/create': ['tcAdmin'],
  '/vehicleType/list': ['tcAdmin'],
  '/vehicleType/delete': [],
  '/vehicleType/update': [],
  // coupon
  '/coupon/create': [],
  '/coupon/list': [],
  '/coupon/delete': [],
  '/coupon/update': [],
  '/coupon/find': ['rider'],
  // transportCompany
  '/transportCompany/create': [],
  '/transportCompany/delete': [],
  '/transportCompany/update': [],
  '/transportCompany/list': ['tcAdmin'],
  // route
  '/route/create': [],
  '/route/list': ['tcAdmin', 'rider'],
  '/route/delete': [],
  '/route/update': [],
  // driver
  '/driver/create': ['tcAdmin'],
  // vehicle
  '/vehicle/create': ['tcAdmin'],
  '/vehicle/list': ['tcAdmin', 'rider'],
  '/vehicle/update': ['tcAdmin'],
  '/vehicle/delete': [],
  // city
  '/city/create': ['tcAdmin'],
  '/city/list': ['tcAdmin'],
  '/city/update': [],
  '/city/delete': [],
  // trip
  '/trip/create': ['tcAdmin', 'rider'],
  '/trip/list': ['tcAdmin', 'rider', 'driver'],
  '/trip/update': ['tcAdmin', 'rider'],
  '/trip/delete': [],
  // reservation
  '/reservation/create': ['rider'],
  '/reservation/list': ['tcAdmin', 'rider'],
  '/reservation/update': ['tcAdmin', 'rider', 'driver'],
  '/reservation/delete': ['rider'],
  //user
  '/user/update': ['tcAdmin', 'rider', 'driver'],
  '/user/delete': [],
  // payment
  '/payment/setCard': ['tcAdmin', 'rider'],
  '/payment/createSource': ['tcAdmin', 'rider'],
  '/payment/createCustomer': ['rider'],
  '/payment/createUser': ['tcAdmin', 'rider'],
  '/payment/listCards': ['tcAdmin', 'rider'],
  '/payment/deleteCard': ['tcAdmin', 'rider'],
  '/payment/updateCard': ['rider'],
  '/payment/chargeRiders': [],
  '/payment/refundCharge': [],
  '/payment/payTc': [],
  // sendEmail
  '/sendEmail/help': ['rider'],
  '/sendEmail/driver': ['tcAdmin'],
  '/sendEmail/rider': [],
};

Object.keys(roles).forEach(role => {
  roles[role] = roles[role].concat(['admin']);
});

export default roles;
