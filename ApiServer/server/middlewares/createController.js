import APIError from '../helpers/APIError';
import { UNAUTHORIZED, INTERNAL_SERVER_ERROR } from 'http-status';
import { get } from 'lodash';
import { cleanString, start, commit, abort } from '../util';

const findRec = async ({ uniqueBy, req, Model, op, caseInsensitive }) =>
  new Promise(async resolve => {
    try {
      const condition = [];
      uniqueBy.forEach(item => {
        const str = cleanString(get(req, `body[${item}]`, null));
        if (caseInsensitive) {
          const regex = new RegExp(['^', str, '$'].join(''), 'i');
          condition.push({ [item]: { $regex: regex } });
        } else {
          condition.push({ [item]: str });
        }
      });
      const operator = op ? op : '$or';
      const foundRec = await Model.findOne({ [`${operator}`]: condition });
      if (!foundRec) return resolve(true);

      return resolve({ foundRec });
    } catch (error) {
      return resolve({ error });
    }
  });

export default async data => {
  const {
    req,
    res,
    next,
    Model,
    beforeHook,
    uniqueBy,
    op,
    afterHook,
    createLogic,
    isTransaction,
    caseInsensitive,
  } = data;
  let session = null;
  if (isTransaction) session = await start();
  try {
    log({ val: req.body, extra: 'req.body: create' });
    let obj = req.body;
    /**
      beforeHook
     */
    if (beforeHook) {
      const { error, body } = await beforeHook({ data: obj, session });
      if (error) {
        if (isTransaction) await abort(session);

        return next(error);
      }
      if (body) obj = body;
    }
    /**
      uniqueBy check
     */
    if (uniqueBy) {
      const { error, foundRec } = await findRec({ uniqueBy, req, Model, op, caseInsensitive });
      if (error) {
        if (isTransaction) await abort(session);

        return next(new APIError(error, INTERNAL_SERVER_ERROR));
      }
      if (foundRec) {
        if (isTransaction) await abort(session);

        return next(new APIError('Record already exists', UNAUTHORIZED));
      }
    }
    /**
      createLogic
     */
    if (createLogic) return createLogic({ req, res, next, ...data, obj, session }); // handle transaction case
    /**
      default create logic
     */
    const recStruct = new Model(obj);
    let createdRec = await recStruct.save({ session });
    /**
      afterHook
     */
    if (afterHook) {
      const { error, newRes } = await afterHook({ req, record: createdRec, session });
      if (error) {
        if (isTransaction) await abort(session);

        return next(error);
      }
      if (newRes && newRes[0]) createdRec = newRes[0];
    }
    if (isTransaction) await commit(session);

    /**
      return response
     */
    return res.send({ data: { createdRec }, message: 'Success', success: true });
  } catch (error) {
    log({ val: error, extra: 'Error in createController middleware' });
    if (isTransaction) await abort(session);
    next(new APIError(error, INTERNAL_SERVER_ERROR));
  }
};
