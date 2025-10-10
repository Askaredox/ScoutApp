
import { request } from '@/utils/request-utils';
import Cookies from 'js-cookie';

export class AccessToken {
    public static setToken(token: string) {
        Cookies.set('access_token', token, { sameSite: 'Lax' });
    }
    public static getToken(): string {
        const token = Cookies.get('access_token');
        if (!token) {
            throw new Error("Access token not found in cookies");
        }
        return token;
    }
    public static is_authenticated(): boolean {
        return !!Cookies.get('access_token');
    }
}

export const getGroup = async () => {
    return await request('GET', '/user_info', "application/json");
}

export const refreshAuthToken = async () => {
    try {
        const response = await request('POST', '/refresh_token', 'application/json', null, false);
        if (response && response.access_token) {
            AccessToken.setToken(response.access_token);
            return true;
        } else {
            console.error("No access token in refresh response");
            return false;
        }
    } catch (error) {
        console.error("Token refresh failed:", error);
        return false;
    }
}
