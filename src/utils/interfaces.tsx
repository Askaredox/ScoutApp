

export interface Folder_data {
    parent_id: string,
    id: string,
    name: string,
    can_download: boolean,
    can_view: boolean,
    type: string
}

export interface File_data {
    parent_id: string,
    id: string,
    name: string,
    data: string,
    can_download: boolean,
    can_view: boolean,
    thumbnail: string,
    created: number,
    type: string,
    description?: string
}

export interface Data {
    parent_id: string,
    id: string,
    name: string,
    data?: string,
    can_download: boolean,
    can_view: boolean,
    thumbnail?: string,
    created: number,
    type: string
    description?: string

}

export interface Announcement {
    id_announcement: number;
    title: string;
    description: string;
    post: string;
    information: string;
    created: string;
    expire_date: string;
}