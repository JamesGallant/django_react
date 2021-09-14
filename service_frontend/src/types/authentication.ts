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