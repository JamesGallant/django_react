/**
 * @description All general types that involves authentication
 */

export interface UserModel {
    first_name: string,
    last_name: string,
    mobile_number: string | number,
    email: string,
    country: string,
    password: string
}

export interface UserData {
    id: number | null
    first_name: string | null,
    last_name: string | null,
    mobile_number: string | number | null,
    email: string | null,
    country: string | null,
}