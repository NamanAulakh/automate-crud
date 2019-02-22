import mongoose from 'mongoose';

export const models = {};

export default ({ fields, modelName }) => {
  const Model = mongoose.model(modelName, new mongoose.Schema(fields));
  models[modelName] = Model;
  return Model;
};
