import passport from 'passport';
import { get } from 'lodash';
import { passportOptions } from '../config/app';
import roles from '../roles';
import APIError from '../helpers/APIError';
import httpStatus from 'http-status';

export default ({ router }) => {
  /**
   * Authentication middleware
   */
  router.use((req, res, next) => {
    passport.authenticate('jwt', passportOptions, (error, userDtls, info) => {
      if (error) return next(new APIError(error, httpStatus.UNAUTHORIZED));
      if (!userDtls)
        return next(
          new APIError(`token not matched and error msg ${info}`, httpStatus.UNAUTHORIZED)
        );
      req.user = userDtls;

      next();
    })(req, res, next);
  });
  /**
   * Authorization middleware
   */
  router.use((req, res, next) => {
    try {
      const type = get(req, 'user.userType', null);
      const path = get(req, 'originalUrl', null);
      if (!type || !path) return next(new APIError('Missing info', httpStatus.UNAUTHORIZED));
      const access = roles[path.substring(4).split('?')[0]];
      log({ val: `${type}, ${path}, ${access}` });
      if (!access) return next(new APIError('Roles not found', httpStatus.NOT_FOUND));
      // if (!access) return next();
      const match = access.filter(role => role === type);
      if (match.length === 0) return next(new APIError('Unauthorized', httpStatus.UNAUTHORIZED));
      next();
    } catch (error) {
      next(new APIError(error, httpStatus.INTERNAL_SERVER_ERROR));
    }
  });
};
