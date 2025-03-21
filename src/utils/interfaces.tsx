

export interface Folder {
    id_parent_folder: string,
    id_folder: string,
    name: string,
    can_download: boolean,
    can_view: boolean
}

export interface File {
    id_parent_folder: string,
    id_file: string,
    name: string,
    data: string,
    can_download: boolean,
    can_view: boolean,
    thumbnail: string,
    created: number
}