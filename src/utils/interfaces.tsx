export interface Announcement_response {
    PK: string;
    title: string;
    description: string;
    post: string;
    information: string;
    created: string;
    expire_date: string;
}

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
    type: string,
    description?: string
}

export interface Announcement {
    id_announcement: string;
    title: string;
    description: string;
    post: string;
    information: string;
    created: string;
    expire_date: string;
}

export interface Metadata {
    metadata: {
        page: number, // current page
        per_page: number, // data that is supossed to be in each page
        total_pages: number, // current data that is in the page
        total: number, // total number of all items
        links: {
            first: string,
            previous: string,
            self: string,
            next: string,
            last: string
        }
    },
    data: Array<Announcement>
}
