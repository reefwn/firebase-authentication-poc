export const appPort = +(process.env.APP_PORT ?? '3001');
export const apiIssuer = process.env.API_ISSUER ?? 'firebase-authentication-poc';
export const otpIntervalInDays = +(process.env.OTP_INTERVAL_IN_DAYS ?? '7');
export const passwordIntervalInDays = +(process.env.PASSWORD_INTERVAL_IN_DAYS ?? '45');