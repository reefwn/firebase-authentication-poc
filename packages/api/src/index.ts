import dotenv from 'dotenv';

dotenv.config();

import Fastify from 'fastify';
import { appPort } from './configs';

const fastify = Fastify({ logger: true });

fastify.get('/', async () => {
  return { hello: 'world' };
});

fastify.register(require('./routes/login'));
fastify.register(require('./routes/token'));

const start = async () => {
  try {
    await fastify.listen({ port: appPort });
    console.log(`Server listening on http://localhost:${appPort}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
