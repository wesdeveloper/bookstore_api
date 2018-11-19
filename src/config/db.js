import logger from 'loglevel';
import { promisify } from 'util';
import { MongoClient } from 'mongodb';

const collections = [];

let mongoClient;

const connect = async (uri) => {
  try {
    logger.debug('Database trying to connect.');
    mongoClient = await MongoClient.connect(uri, { useNewUrlParser: true });
    logger.info('Database connected.');
  } catch (err) {
    logger.error('Database failed to connect. - ', err.message);
    throw err;
  }
};

const getCollection = async (collectionName) => {
  let collection = collections[collectionName];
  if (!collection) {
    collection = await mongoClient.db().collection(collectionName);
    collections[collectionName] = collection;
  }
  return collection;
};

const dropCollections = async (...theArgs) => {
  const collectionsToDrop = [];
  theArgs.forEach((item) => {
    const collection = getCollection(item);
    if (collection) {
      collectionsToDrop.push(collection);
    }
  });
  await Promise.all(collectionsToDrop.map(async (item) => {
    const collectionDrop = item;
    collectionDrop.drop = promisify(collectionDrop.drop);
    return collectionDrop.drop();
  })).catch(err => logger.error(`Error on drop collections: ${err}`));
};

const close = async () => {
  logger.debug('Database trying to disconnect');
  if (mongoClient) {
    try {
      await mongoClient.close();
      logger.info('Database disconnected');
    } catch (err) {
      logger.error('Error on closing database', err);
      throw err;
    }
  }
};

export default {
  connect,
  getCollection,
  dropCollections,
  close,
};
