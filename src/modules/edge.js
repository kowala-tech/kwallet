import { walletType } from "./edgeContext";

const timeout = ms => new Promise(res => setTimeout(res, ms));

const usernameAvailable = (username) => {
	try {
		window.abcui.usernameAvailable(username);
	}
	catch(error) {
		console.error("Error checking username.");
		console.error(error);
	}
};

export async function setEdgeAccount(account) {
	window.abcui.abcAccount = account;
	await timeout(500); // edge is slow...so we wait
	return account;
}

export const getLocalEdgeAccount = () => {
	try {
		return window.abcui.abcAccount;
	}
	catch(error) {
		console.error("No local account found!");
	}
};

export function getWallet(id) {
	console.log("Getting wallet " + id);
	const account = getLocalEdgeAccount();
	const wallets = account.currencyWallets;
	return wallets[id];
}

export function getPrimaryWallet() {
	const account = getLocalEdgeAccount();
	console.log("Getting wallets for account " + account.id);
	const primaryWallet = account.getFirstWallet(walletType);
	return primaryWallet;
}

export async function signAndSendTransaction(walletId, toAddress, amountInWei) {
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
}

export async function usernameValid(username) {
	const valid = username.length > 4;
	const available = await usernameAvailable(username);
	return valid && available;
}
