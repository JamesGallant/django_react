import type { cookieDataType } from "../types/types";

class CookieHandler {
	/**
     * @description functions for manipulating cookies in the DOM
     */
	public setCookie(opts: cookieDataType): void {
		/**
         * @description sets a cookie in the document
         * @param opts.name Name of the cookie
         * @param opts.value Value of the cookie
         * @param duration number of days the cookie is valid
         * @param path The url path where the cookie is placed
         * @param secure should secure and sameSite be set
         */
        
		if(opts.name === "") {
			throw new Error("Cookies must have a name");
		}

		const date = new Date();
		let payload = "";

		if (opts.duration === 0) {
			payload = opts.name + "=" + opts.value + ";path=" + opts.path;
		} else {
			date.setTime(date.getTime() + (opts.duration * 24 * 60 * 60 * 1000));
			const expires = "expires=" + date.toUTCString();
			payload = opts.name + "=" + opts.value + ";" + expires + ";path=" + opts.path;
		}

		const secureSettings = ";SameSite=Strict;secure";

		if (opts.secure) {
			const securePayload = payload + secureSettings;
			document.cookie = securePayload;

		} else {
			document.cookie = payload;
		}
	}

	public getCookie(name: string): string {
		/**
         * @description get cookie information based on its name
         */
		if(name === "") {
			throw new Error("Cookies must have a name");
		}

		const decodedCookies = decodeURIComponent(document.cookie);
		const cookieList = decodedCookies.split(";");

		for(let idx=0; idx < cookieList.length; idx++) {
			const cookie = cookieList[idx];
			const cookieName: string = cookie.split("=")[0]?.trim();
			const cookieValue: string = cookie.split("=")[1]?.trim();
        
			if (cookieName === name) {
				return cookieValue;
			}
		}
		return "";
	}

	public deleteCookie(name: string): void {
		/**
         * @description deletes a cookie by specifying the experation to one day earlier
         */

		if (name === "") {
			throw new Error("Cookies must have a name");
		}
		const date = new Date();
		date.setTime(date.getTime() - 86400);
		const expires = "exprires="+ date.toUTCString();

		const payload = name + "=deleted;" + expires + ";path=/";
		document.cookie = payload;

	}
}

export default CookieHandler;