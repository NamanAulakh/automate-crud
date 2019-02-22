import APIError from '../helpers/APIError';
import { INTERNAL_SERVER_ERROR } from 'http-status';

export default async data => {
  const { req, res, next, Model, softDelete, afterDeleteHook, deleteLogic } = data;
  try {
    if (deleteLogic) return deleteLogic(data);
    const { _id } = req.query;
    if (softDelete) {
      const record = await Model.findOneAndUpdate(
        { _id },
        { $set: { isDeleted: true } },
        { new: true }
      );
      if (afterDeleteHook) afterDeleteHook({ record, req });

      return res.send({ data: null, message: 'Record deleted successfully', success: true });
    }
    await Model.findOneAndRemove({ _id });

    res.send({ data: null, message: 'Record deleted successfully', success: true });
  } catch (error) {
    next(new APIError(error, INTERNAL_SERVER_ERROR));
  }
};
