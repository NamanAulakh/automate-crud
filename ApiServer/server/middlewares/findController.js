import APIError from '../helpers/APIError';
import { INTERNAL_SERVER_ERROR, NOT_FOUND, UNAUTHORIZED } from 'http-status';

export default async data => {
  const { req, res, next, Model, afterFindHook } = data;
  try {
    log({ val: req.query, extra: 'req.query: find' });
    const record = await Model.findOne({ ...req.query, isDeleted: false });
    if (!record) return next(new APIError('Not Found', NOT_FOUND));
    if (afterFindHook) {
      const resp = await afterFindHook(record);
      if (resp.error) return next(new APIError(resp.error, UNAUTHORIZED));
    }

    return res.send({ data: record, message: 'Success', success: true });
  } catch (error) {
    next(new APIError(error, INTERNAL_SERVER_ERROR));
  }
};
