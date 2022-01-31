import axios from "axios";
import { AxiosResponse } from "axios";

import configuration from "../utils/config";
import type { OwnedAppInterface } from "../types/applicationTypes";

export async function getRegisteredApps(authToken: string, url: string): Promise<AxiosResponse> {
	try {
		const response: AxiosResponse = await axios({
			method: "get",
			url: url === "" ? configuration["api-base"].concat(configuration["api-getRegisteredApps"]) : url,
			headers: {"Authorization": `Token ${authToken}`}
		});
		return response;
	/* eslint-disable */
	} catch(error: any) {
	/* eslint-enable */
		return error.response;
	}
}

export async function getOwnedApps(authToken: string): Promise<AxiosResponse> {
	try {
		const response: AxiosResponse = await axios({
			method: "get",
			url: configuration["api-base"].concat(configuration["api-getOwnedApps"]),
			headers: {"Authorization": `Token ${authToken}`}
		});
		return response;
	/* eslint-disable */
	} catch(error: any) {
	/* eslint-enable */
		return error.response;
	}
}

export async function linkAppToUser(authToken: string, data: OwnedAppInterface): Promise<AxiosResponse> {
	try {
		const response: AxiosResponse = await axios({
			method: "post",
			url: configuration["api-base"].concat(configuration["api-getOwnedApps"]),
			data: data, 
			headers: {"Content-type": "application/json", "Authorization": `Token ${authToken}`}
		});
		return response;
	/* eslint-disable */
	} catch(error: any) {
	/* eslint-enable */
		return error.response;
	}
}

export async function patchOwnedAppExpirationDate(authToken: string, id: number, expirationDate: string): Promise<AxiosResponse> {
	try {
		const response: AxiosResponse = await axios({
			method: "patch",
			url: `${configuration["api-base"].concat(configuration["api-getOwnedApps"])}${id}/`,
			data: {
				"expiration_date": expirationDate
			}, 
			headers: {"Content-type": "application/json", "Authorization": `Token ${authToken}`}
		});
		return response;
	/* eslint-disable */
	} catch(error: any) {
	/* eslint-enable */
		return error.response;
	}
}

export async function deleteOwnedApp(authToken: string, appID: number): Promise<AxiosResponse> {
	try {
		const response: AxiosResponse = await axios({
			method: "delete",
			url: `${configuration["api-base"].concat(configuration["api-getOwnedApps"])}/${appID}`,
			headers: {"Authorization": `Token ${authToken}`}
		});
		return response;
	/* eslint-disable */
	} catch(error: any) {
	/* eslint-enable */
		return error.response;
	}
}

