import {
	createWallet,
	loadWallet,
	addTransaction,
	setWalletBalance
} from "../WalletRedux";
import { replace } from "react-router-redux";
import {
	getPrimaryWallet,
	setEdgeAccount
} from "../../modules/edge";

const loginCallbacks = (dispatch) => {
	return {
		callbacks: {
			onBalanceChanged (walletId, something, balance) {
				dispatch(setWalletBalance(balance));
			},
			onNewTransactions (walletId, txs) {
				console.log( "GOT NEW TX");
				dispatch(addTransaction(txs[0]));
			},
			onTransactionsChanged (walletId, txs) {
				console.log( "GOT CHANGED TX");
				dispatch(addTransaction(txs[0]));
			},
		}
	};
};

const loginLoading = () => {
	return {
		type: "LOGIN_LOADING"
	};
};

const loginSuccess = (account) => {
	console.log("Login successful!");
	return (dispatch) => {
		setEdgeAccount(account).then( () => {
			Promise.all([
				dispatch(setUsername(account.username)),
				dispatch(setAuthenticated(true)),
				dispatch(setPrimaryWallet(account)),
				dispatch(loginLoading()),
				dispatch(replace("/wallet"))
			]);
		});
	};
};

const loginError = (errorMessage) => {
	return {
		type: "LOGIN_ERROR",
		errorMessage
	};
};

const setPrimaryWallet = () => {
	return (dispatch) => {
		const primaryWallet = getPrimaryWallet();
		console.log("Primary wallet found with id " + primaryWallet.id);
		if (primaryWallet) {
			dispatch(loadWallet(primaryWallet.id));
			return;
		} else {
			console.error("No wallets found! Creating a new wallet.");
			dispatch(createWallet());
		}
	};
};

export const setUsername = (username) => {
	return {
		type: "SET_USERNAME",
		username
	};
};

export const setAuthenticated = (bool) => {
	return {
		type: "SET_AUTHENTICATED",
		bool
	};
};

export const loginWithPin = (username, pin) => {
	return (dispatch) => {
		dispatch(loginLoading());
		window.abcui.loginWithPIN(
			username,
			String(pin),
			loginCallbacks(dispatch),
			function (error, account) {
				if (error) {
					dispatch(loginError(error.message));
				} else {
					dispatch(loginSuccess(account));
				}
			}
		);
	};
};

export const loginWithPassword = (username, password) => {
	return (dispatch) => {
		dispatch(loginLoading());
		window.abcui.loginWithPassword(
			username,
			password,
			loginCallbacks(dispatch),
			(error, account) => {
				if (error) {
					dispatch(loginError(error.message));
				} else {
					dispatch(loginSuccess(account));
				}
			}
		);
	};
};

export const createAccount = (username, password, pin) => {
	return (dispatch) => {
		window.abcui.createAccount(
			username,
			password,
			pin,
			{},
			function (error, account) {
				if (error) return console.error({ message: "could not create wallet" });
				dispatch(loginSuccess(account));
			}
		);
	};
};
