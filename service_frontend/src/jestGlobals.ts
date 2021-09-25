function getUrl(url: string) {
/**
 * @Description returns a url based on a keyword, keywords are passed by the arg paramter in setup
 */
	switch(url) {
	case "endpoint_activateAccount":
		return "/auth/activate/someID/someToken";
	default:
		throw new Error("url pattern not recieved or does not match, see getUrl function in  src/jestGlobals.ts");
	}
}


export default function setup(data: string, arg = ""): string {
	/**
     * @Description setup file for jest test runner to retrieve global variables we may want to change easily
     */
	switch(data) {
	case "url":
		return getUrl(arg);
	default:
		throw new Error("this argument is not in the setup, configure setup by adding new cases in src/jestGlobals.ts");

	}

} 