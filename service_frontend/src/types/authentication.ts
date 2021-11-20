import { AxiosResponse } from "axios";
/**
 * @description All general types that involves authentication
 */



export interface UserPutResponseInterface extends AxiosResponse {
    data:   UserDataInterface
}

export interface UserDataInterface {
    detail?: string | any,
    id?: number | null | undefined
    first_name: string | null,
    last_name: string | null,
    mobile_number: string | number | null,
    email: string | null,
    country: string | null,
    password?: string | undefined
}

export interface UserPutInterface {
    first_name: string | null,
    last_name: string | null,
    mobile_number: string | number | null,
    country: string | null,
}
