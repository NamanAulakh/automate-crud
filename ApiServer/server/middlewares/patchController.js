import APIError from '../helpers/APIError';
import { INTERNAL_SERVER_ERROR } from 'http-status';

export default async data => {
  const { req, res, next, Model, patchLogic, afterHook } = data;
  try {
    const { _id } = req.query;
    if (patchLogic) return patchLogic({ req, res, next });
    let updatedRec = await Model.findOneAndUpdate({ _id }, { $set: req.body }, { new: true });
    if (!updatedRec) return res.send({ data: null, message: 'Record not found', success: false });
    if (afterHook) {
      const { error, newRes } = await afterHook({ req, record: updatedRec });
      if (error) return next(error);
      updatedRec = newRes[0];
    }

    return res.send({ data: updatedRec, message: 'Record updated successfully', success: true });
  } catch (error) {
    next(new APIError(error, INTERNAL_SERVER_ERROR));
  }
};
