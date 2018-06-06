import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "recompose";
// Material UI Imports
import { withStyles } from "@material-ui/core/styles";
import SendIcon from "@material-ui/icons/Send";
import Button from "@material-ui/core/Button";
// Component Related Imports
import styles from "./styles";
import Fab from "../../components/Fab";
import TransactionList from "../../components/TransactionList";
import BalanceCard from "../../components/BalanceCard";
import { openModal } from "../ModalContainer/redux/actions";

class WalletContainer extends React.Component {

	render() {
		const {
			classes,
			openModal,
			currentWallet
		} = this.props;

		return (
			<div className={classes.appFrame}>
				<main className={classes.content}>
					<BalanceCard balance={currentWallet.balance}/>
					<TransactionList
						loading={currentWallet.loading}
						transactions={currentWallet.transactions}
						depositButton={(
							<Button
								fullWidth
								variant="raised"
								color="primary"
								onClick={() => {openModal("DEPOSIT_MODAL");}}
							>
								Deposit kUSD
							</Button>
						)}
					/>
					<Fab
						color="primary"
						onClick={() => {openModal("SEND_MODAL");}}
						icon={<SendIcon />}
					/>
				</main>
			</div>
		);
	}
}

WalletContainer.propTypes = {
	classes: PropTypes.object.isRequired,
	openModal: PropTypes.func.isRequired,
	currentWallet: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
	return {
		currentWallet: state.wallet
	};
};

const mapDispatchToProps = (dispatch) => {
	return ({
		openModal: (modelType) => {
			dispatch(openModal(modelType));
		}
	});
};

export default compose(
	withStyles(styles),
	connect(mapStateToProps, mapDispatchToProps)
)(WalletContainer);
