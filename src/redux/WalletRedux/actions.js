import { walletType } from "../../modules/edgeContext";
import { signAndSendTransaction, getWallet, getLocalEdgeAccount } from "../../modules/edge";
import secureRandom from "secure-random";

export const createWallet = () => {
	return (dispatch) => {
		const privateKey = Buffer.from(secureRandom(32)).toString("hex");
		getLocalEdgeAccount().createWallet(
			walletType,
			{ privateKey },
			(error, id) => {
				if (error) { return console.error(error); }
				console.log(id);
				dispatch(loadWallet(id));
			}
		);
	};
};

export function loadWallet(walletId) {
	const wallet = getWallet(walletId);
	console.log(wallet);
	const address = wallet.keys.address;
	const balance = wallet.getBalance();
	return (dispatch) => {
		wallet.getTransactions().then( (transactions) => {
			dispatch(replaceTransactions(transactions));
		});
		Promise.all([
			dispatch(setWalletLoading(true)),
			dispatch(setWalletId(walletId)),
			dispatch(setWalletAddress(address)),
			dispatch(setWalletBalance(balance))
		]).then( () => {
			dispatch(setWalletLoading(false));
		});
	};
}

export const sendTransaction = (walletId, toAddress, amountInWei) => {
	return () => {
		signAndSendTransaction(walletId, toAddress, amountInWei);
	};
};

export const setWalletLoading = (loading) => {
	return {
		type: "SET_WALLET_LOADING",
		loading
	};
};

export const setWalletId = (id) => {
	return {
		type: "SET_WALLET_ID",
		id
	};
};

export const setWalletBalance = (balance) => {
	return {
		type: "SET_WALLET_BALANCE",
		balance
	};
};

export const setWalletName = (name) => {
	return {
		type: "SET_WALLET_NAME",
		name
	};
};

export const addTransaction = (transaction) => {
	return {
		type: "ADD_TRANSACTION",
		transaction
	};
};

export const replaceTransactions = (transactions) => {
	return {
		type: "REPLACE_TRANSACTIONS",
		transactions
	};
};

export const setWalletAddress = (address) => {
	return {
		type: "SET_WALLET_ADDRESS",
		address
	};
};
