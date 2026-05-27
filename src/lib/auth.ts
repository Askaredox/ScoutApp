
import { User } from '@/lib/interfaces';
import { request } from '@/lib/request-utils';

export const getMe = async (): Promise<User | null> => {
  try {
    const response = await request("GET", `/user/me`, "application/json");

    return response;
  } catch {
    return null;
  }
};
