
import { request } from '@/utils/request-utils';
import Cookies from 'js-cookie';
import { User } from './interfaces';

export class AccessToken {
    public static setToken(token: string) {
        Cookies.set('access_token', token, { sameSite: 'Lax' });
    }
    public static setAvatar(avatar: string) {
        Cookies.set('avatar', avatar, { sameSite: 'Lax' });
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
    public static get_group(): string | null {
        const token = Cookies.get('access_token');
        if (!token) {
            return null;
        }
        return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())['cognito:groups'][0];
    }
    public static get_data(): any | null {
        const token = Cookies.get('access_token');
        if (!token) {
            return null;
        }
        return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    }
    public static get_user(): User {
        const token = Cookies.get('access_token');
        if (!token) {
            throw new Error("Access token not found in cookies");
        }
        const data = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
        return {
            sub: data['sub'],
            email: data['email'],
            email_verified: data['email_verified'],
            name: data['name'],
            groups: data['cognito:groups'] ? data['cognito:groups'][0] : '',
            avatar: Cookies.get('avatar') || 'NONE',
            section: data['section'] || 'NONE'
        };
    }
}

export const getMe = async () => {
    return await request('GET', '/user/me', "application/json");
}

export const refreshAuthToken = async () => {
    try {
        const response = await request('POST', '/refresh', 'application/json', null, false);
        if (response && response.accessToken) {
            AccessToken.setToken(response.accessToken);
            const me = await getMe();
            AccessToken.setAvatar(me.avatar);
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
