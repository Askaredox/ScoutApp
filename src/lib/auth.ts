
import { User } from '@/lib/interfaces';
import { request } from '@/lib/request-utils';
import Cookies from 'js-cookie';

export class AccessToken {
    public static setToken(token: string) {
        Cookies.set('accessToken', token, { sameSite: 'Lax' });
    }
    public static setAttrs(avatar: string, name: string) {
        Cookies.set('avatar', avatar, { sameSite: 'Lax' });
        Cookies.set('name', name, { sameSite: 'Lax' });
    }
    public static getToken(): string {
        const token = Cookies.get('accessToken');
        if (!token) {
            throw new Error("Access token not found in cookies");
        }
        return token;
    }
    public static is_authenticated(): boolean {
        return !!Cookies.get('accessToken');
    }
    public static get_group(): string | null {
        const token = Cookies.get('accessToken');
        if (!token) {
            return null;
        }
        return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())['cognito:groups'][0];
    }
    public static get_data(): unknown | null {
        const token = Cookies.get('accessToken');
        if (!token) {
            return null;
        }
        return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    }
    public static get_user(): User {
        const token = Cookies.get('accessToken');
        if (!token) {
            throw new Error("Access token not found in cookies");
        }
        const data = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
        return {
            sub: data['sub'],
            email: data['email'],
            email_verified: data['email_verified'],
            name: Cookies.get('name') || 'NONE',
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
            AccessToken.setAttrs(me.avatar, me.name);

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
