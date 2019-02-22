import moment from 'moment-timezone';
// const timezoneUS = 'America/New_York';
const timezoneIndia = 'Asia/Calcutta';
moment.tz.setDefault(timezoneIndia);
global.moment = moment;
