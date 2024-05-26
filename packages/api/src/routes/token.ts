import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { findUserByUid } from "../services/user";
import { decodeJWT } from "../services/jwt";
import { apiIssuer } from "../configs";

interface ValidateTokenBody {
  idToken: string;
}

async function routes(fastify: FastifyInstance) {
  fastify.post('/token/validate', async (
    request: FastifyRequest<{ Body: ValidateTokenBody }>,
    reply: FastifyReply
  ) => {
    const { idToken } = request.body;

    try {
      const { payload: decoded } = decodeJWT(idToken);
      if (!decoded?.claims?.issuer || decoded.claims.issuer !== apiIssuer) {
        return reply.status(401).send({ error: 'INVALID_ISSUER' });
      }

      const user = await findUserByUid(decoded.uid);
      if (user.device_id !== decoded.deviceId) return reply.status(401).send({ error: 'INVALID_DEVICE' });

      reply.send({ user });
    } catch (error) {
      console.error('ERROR:', error);
      reply.status(401).send({ error: 'INVALID_TOKEN' });
    }
  });
};

export default routes;