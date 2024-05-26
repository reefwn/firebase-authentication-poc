const decode = (str: string) => {
  return JSON.parse(Buffer.from(str, 'base64').toString('utf-8'));
}

export const decodeJWT = (jwt: string) => {
  const parts = jwt.split('.');
  if (parts.length !== 3) throw new Error('INVALID_JWT_FORMAT');

  const [header, payload, signature] = parts;

  const decodedHeader = decode(header);
  const decodedPayload = decode(payload);

  return {
    header: decodedHeader,
    payload: decodedPayload,
    signature: signature
  };
}