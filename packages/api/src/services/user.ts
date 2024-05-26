import { pool } from "../lib/postgres";

const process = async (query: string, params: string[]) => {
  const client = await pool.connect();
  try {
    return await client.query(query, params);
  } catch (error) {
    console.error('[ERROR] PROCESS:', error);
  } finally {
    client.release();
  }
}

const findOne = async (query: string, params: string[]) => {
  const result = await process(query, params);
  return result?.rows[0];
}

const update = async (query: string, params: string[]) => {
  await process(query, params);
}

export const findUserByUid = async (uid: string) => {
  return findOne(
    `SELECT * FROM "user" WHERE uid = $1 AND status = 'ACTIVE' LIMIT 1;`,
    [uid]
  );
}

export const findUserByEmail = async (email: string) => {
  return findOne(
    `SELECT * FROM "user" WHERE email = $1 AND status = 'ACTIVE' LIMIT 1;`,
    [email]
  );
}

export const updateUserDeviceId = async (userId: string, deviceId: string) => {
  await update(
    `UPDATE "user" SET device_id = $1 WHERE id = $2;`,
    [deviceId, userId]
  );
}