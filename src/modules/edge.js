import { makeContext } from "edge-core-js";
import { kowalaCurrencyPluginFactory } from "edge-currency-kowala";

const edgeWalletName = "kusd-testnet";
export const edgeWalletNamespace = "wallet:" + edgeWalletName;

export const edge = makeContext({
	apiKey: "e6eee331afb0385b6a6223719802fcfd00fc2331",
	plugins: [ kowalaCurrencyPluginFactory ],
	appId: edgeWalletName
});

const usernameAvailable = (username) => {
	try {
		window.abcui.usernameAvailable(username);
	}
	catch(error) {
		console.error("Error checking username.");
		console.error(error);
	}
};

const timeout = ms => new Promise(res => setTimeout(res, ms));

export const setEdgeAccount = async (account) => {
	window.abcui.abcAccount = account;
	await timeout(500); // edge is slow...so we wait
	return account;
};

export const getLocalEdgeAccount = () => {
	try {
		return window.abcui.abcAccount;
	}
	catch(error) {
		console.error("No local account found!");
	}
};

export const getWallet = (id) => {
	console.log("Getting wallet " + id);
	const account = getLocalEdgeAccount();
	const wallets = account.currencyWallets;
	return wallets[id];
};

export const getPrimaryWallet = () => {
	const account = getLocalEdgeAccount();
	console.log("Getting wallets for account " + account.id);
	const primaryWallet = account.getFirstWallet(edgeWalletNamespace);
	return primaryWallet;
};

export const signAndSendTransaction = async (walletId, toAddress, amountInWei) => {
	try {
		const wallet = getWallet(walletId);
		const spendParams = {
			networkFeeOption: "low",
			currencyCode: "KUSD",
			spendTargets: [
				{
					publicAddress: toAddress,
					nativeAmount: amountInWei
				}
			]
		};
		let transaction = await wallet.makeSpend(spendParams);
		transaction = await wallet.signTx(transaction);
		transaction = await wallet.broadcastTx(transaction);
		transaction = await wallet.saveTx(transaction);
		console.log("Sent transaction with ID = " + transaction.txid);
	} catch (error) {
		console.log(error);
	}
};

export const usernameValid = async (username) => {
	const valid = username.length > 4;
	const available = await usernameAvailable(username);
	return valid && available;
};

export default edge;
