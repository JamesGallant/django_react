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
	detail: string
}

