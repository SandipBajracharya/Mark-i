import * as bcrypt from 'bcrypt';

const saltRounds = 10;

export async function hashPassword(password: string): Promise<string> {
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

export async function matchPassword(
  userPassword: string,
  storedPassword: string,
): Promise<boolean> {
  return await bcrypt.compare(userPassword, storedPassword);
}
