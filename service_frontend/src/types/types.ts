import { AxiosResponse } from "axios";

export interface cookieDataType {
    name: string,
    value: string,
    duration: number, 
    path: string,
    secure: boolean
}

export interface AxiosError {
    response: AxiosResponse
}

export interface ApiErrInterface {
	detail?: string
    non_field_errors?: Array<string>
    message?: string
}

export interface BasePagedInterface {
    count: number
    next: string | null
    previous: string | null
    results: unknown
}

