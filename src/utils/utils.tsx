export const BACKEND_URL = process.env.BACKEND_URL;


export const request = async (method: string = 'GET', path: string, content_type: string = 'application/json', token: string, body: any | string | null = null) => {
    let response = null;
    try {
        response = await fetch(BACKEND_URL + path, {
            method: method,
            headers: {
                'Content-Type': content_type,
                "Authorization": "Bearer " + token,
            },
            body: body
        });
        return await response.json()
    } catch (e) {
        console.log(e)
    }

}