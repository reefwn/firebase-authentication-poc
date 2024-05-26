import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { auth } from "../lib/firebase";
import { findUserByEmail, updateUserDeviceId } from "../services/user";
import dayjs from "dayjs";
import { apiIssuer, otpIntervalInDays, passwordIntervalInDays } from "../configs";

interface LoginBody {
  email: string
  deviceId: string
}

async function routes(fastify: FastifyInstance) {
  fastify.post('/login', async (
    request: FastifyRequest<{ Body: LoginBody }>,
    reply: FastifyReply
  ) => {
    const { email, deviceId } = request.body;

    try {
      const user = await findUserByEmail(email);
      if (!user) return reply.status(401).send({ error: 'USER_NOT_FOUND' });

      if (user.last_logged_in_at) {
        const isRequiredOtp = dayjs().diff(user.last_logged_in_otp_at, 'day') > otpIntervalInDays;
        if (isRequiredOtp) return reply.status(422).send({ error: 'OTP_LOGIN_REQUIRED' });

        const isRequiredChangePassword = dayjs().diff(user.password_expired_at, 'day') > passwordIntervalInDays;
        if (isRequiredChangePassword) return reply.status(422).send({ error: 'RESET_PASSWORD_REQUIRED' });
      }

      await updateUserDeviceId(user.id, deviceId);
      const customToken = await auth.createCustomToken(user.uid, { 
        issuer: apiIssuer,
        deviceId,
      });

      reply.send({ token: customToken });
    } catch (error) {
      console.log('ERROR:', error)
      reply.status(401).send({ error: 'AUTHENTICATION_FAILED' });
    }
  });
}

export default routes;