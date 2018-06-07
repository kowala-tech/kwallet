import { makeContext } from "edge-core-js";
import { kusdCurrencyPluginFactory } from "edge-currency-kusd";

export const walletType = "wallet:kusd-testnet";

const options = {
	apiKey: "e6eee331afb0385b6a6223719802fcfd00fc2331",
	plugins: [ kusdCurrencyPluginFactory ],
	appId: "com.kowala-web-test.app"
};

export const edgeContext = makeContext(options);

export default edgeContext;
