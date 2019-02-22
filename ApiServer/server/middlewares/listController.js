import APIError from '../helpers/APIError';
import { INTERNAL_SERVER_ERROR } from 'http-status';

export default async data => {
  const { req, res, next, Model, listLogic, afterListFilter } = data;
  try {
    log({ val: req.query, extra: 'req.query: list' });
    if (listLogic) return listLogic({ req, res, next });
    // let list = await Model.find({ ...req.query, isDeleted: false });
    let list = await Model.find({ ...req.query });
    if (afterListFilter) list = afterListFilter(list);

    res.send({ data: list, message: 'Success', success: true });
  } catch (error) {
    next(new APIError(error, INTERNAL_SERVER_ERROR));
  }
};
