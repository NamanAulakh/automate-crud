import mongoose from 'mongoose';

// get rid of these two shits:
const func = ({ key, value }) => {
  global[key] = value;
};

func({
  key: 'createGlobal',
  value: ({ key, value }) => {
    global[key] = value;
  },
});

export const cleanString = str =>
  str
    .replace(/\s+/g, '')
    .replace(/^\s+|\s+$/g, '')
    .toLowerCase();

export const start = () =>
  new Promise(async resolve => {
    const session = await mongoose.startSession();
    session.startTransaction();

    resolve(session);
  });

export const commit = session =>
  new Promise(async resolve => {
    await session.commitTransaction();
    session.endSession();

    resolve();
  });

export const abort = session =>
  new Promise(async resolve => {
    await session.abortTransaction();
    session.endSession();

    resolve();
  });
