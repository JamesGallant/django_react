/**
 * @description All general types that involves authentication
 */

export interface UserDataInterface {
    id?: number | null | undefined
    first_name: string | null,
    last_name: string | null,
    mobile_number: string | number | null,
    email: string | null,
    country: string | null,
    password?: string | undefined
}
