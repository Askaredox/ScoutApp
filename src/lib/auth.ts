
import { User } from '@/lib/interfaces';
import { BACKEND_URL, request } from '@/lib/request-utils';
import axios from "axios";
import Cookies from 'js-cookie';

export class AccessToken {
    public static setToken(token: string) {
        Cookies.set('access_token', token, { sameSite: 'Lax' });
    }
    public static setAttrs(avatar: string, name: string) {
        Cookies.set('avatar', avatar, { sameSite: 'Lax' });
        Cookies.set('name', name, { sameSite: 'Lax' });
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
    public static get_data(): unknown | null {
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
            name: Cookies.get('name') || 'NONE',
            groups: data['cognito:groups'] ? data['cognito:groups'][0] : '',
            avatar: Cookies.get('avatar') || 'NONE',
            section: data['section'] || 'NONE'
        };
    }
    public static clearToken() {
        Cookies.remove('access_token');
        Cookies.remove('avatar');
        Cookies.remove('name');
    }
}

export const getMe = async () => {
    return await request('GET', '/user/me', "application/json");
}

export const refreshAuthToken = async (): Promise<boolean> => {
    try {
        const response = await axios({
            url: `${BACKEND_URL}/refresh`,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true,
        });

        const id_token = response.data?.id_token;

        if (!id_token) {
            console.error("No access token in refresh response");
            return false;
        }

        AccessToken.setToken(id_token);

        const me = await getMe();

        if (me) {
            AccessToken.setAttrs(me.avatar, me.name);
        }

        return true;
    } catch (error) {
        console.error("Token refresh failed:", error);
        return false;
    }
};
