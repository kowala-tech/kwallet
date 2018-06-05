/* eslint-disable import/no-named-as-default */
import React from "react";
import PropTypes from "prop-types";
import { compose } from "recompose";
import { Switch, Route, withRouter, Redirect } from "react-router-dom";
import { connect } from "react-redux";
// Material UI Imports
import { withStyles } from "@material-ui/core/styles";
// Component Related Imports
import styles from "./styles";
import Header from "../Header";
import LoginContainer from "../LoginContainer";
import SetupContainer from "../SetupContainer";
import WalletContainer from "../WalletContainer";
import ModalContainer from "../ModalContainer";
import MessageContainer from "../MessageContainer";
import { openMessage } from "../MessageContainer/redux/actions";
import { edgeContext } from "../../modules/edgeContext";
import { setUsername } from "../../redux/UserRedux";
import PrivateRoute from "../PrivateRoute";

export class App extends React.Component {
	constructor(props) {
		super(props);
		// Setup edge and store on window
		window.abcui = edgeContext;
		const self = this;
		window.abcui.usernameList().then( (usernameList) => {
			self.props.setUsername(usernameList[0]);
		});
	}

	render() {
		const {
			classes,
			user
		} = this.props;

		return (
			<div className={`kowalaGradient ${classes.root}`}>
				<Header
					user={user}
				/>
				<main className={classes.flexContainer}>
					<Switch>
						<Route path="/"
							exact
							render={() =>
								user.username ? <Redirect to="/login" /> : <SetupContainer />
							}/>
						<Route
							path="/login"
							component={LoginContainer}/>
						<PrivateRoute
							path="/wallet"
							component={WalletContainer}/>
					</Switch>
					<ModalContainer />
					<MessageContainer />
				</main>
			</div>
		);
	}
}

App.propTypes = {
	classes: PropTypes.object.isRequired,
	user: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
	return {
		user: state.user
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		setUsername: (username) => {
			if (username) {
				const message = "Welcome back " + username + "!";
				dispatch(setUsername(username));
				dispatch(openMessage(message));
			}
		},
	};
};

export default compose(
	withStyles(styles),
	withRouter,
	connect(mapStateToProps, mapDispatchToProps)
)(App);
