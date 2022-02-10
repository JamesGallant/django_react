import { AxiosResponse } from "axios";
/**
 * @description All general types that involves authentication
 */

export interface UserPutResponseInterface extends AxiosResponse {
    data:   UserDataInterface
}


export interface UserDataInterface {
    detail?: string | any,
    id?: number | undefined | null,
    first_name: string,
    last_name: string,
    mobile_number: string | number,
    email: string,
    country: string,
    password?: string | undefined,
    re_password?: string | undefined
}

export interface UserPutInterface {
    first_name: string | null,
    last_name: string | null,
    mobile_number: string | number | null,
    country: string | null,
}