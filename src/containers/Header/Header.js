import React from "react";
import PropTypes from "prop-types";
import { compose } from "recompose";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
// Material UI Imports
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import Slide from "@material-ui/core/Slide";
import PersonIcon from "@material-ui/icons/Person";
// Component Related Imports
import styles from "./styles";
import logoUrl from "../../images/kwallet.svg";
import darkLogoUrl from "../../images/kwallet-dark.svg";

class Header extends React.Component {
	state = {
		menuAnchor: null,
	};

	handleClick = event => {
		this.setState({ menuAnchor: event.currentTarget });
	};

	handleClose = () => {
		this.setState({ menuAnchor: null });
	};

	render() {
		const {
			classes,
			user,
			history,
			leftButton
		} = this.props;

		const { menuAnchor } = this.state;

		const removeAccount = (username) => {
			window.abcui.deleteLocalAccount(username).then( () => {
				this.handleClose();
				window.location = "/";
			});
		};

		const lockAccount = () => {
			window.abcui.abcAccount.logout().then( () => {
				history.replace("/login");
				this.handleClose();
			});
		};

		return (
			<AppBar
				className={classes.appBar}
				position="static"
				elevation={0}
			>
				<Toolbar disableGutters>
					<div className={classes.leftIcon}>
						{ leftButton &&
						(	<Slide
							direction="right"
							in={false}
							mountOnEnter
							unmountOnExit>
							{ leftButton }
						</Slide> )
						}
					</div>
					<div className={classes.title}>
						<img
							className={classes.logo}
							src={logoUrl}
						/>
					</div>
					<div className={classes.rightIcon}>
						{ !user.username && (
							<Link to="/login">
								<Button
									size="small"
									id="trigger-icon"
									aria-owns={menuAnchor ? "user-menu" : null}
									aria-haspopup="true"
									className={classes.icon}
									onClick={this.handleClick}
								>
									Log In
								</Button>
							</Link>
						)}
						{ Boolean(user.username) && (
							<span>
								<Button
									size="small"
									id="trigger-icon"
									aria-owns={menuAnchor ? "user-menu" : null}
									aria-haspopup="true"
									className={classes.icon}
									onClick={this.handleClick}
								>
									<PersonIcon />
								</Button>
								<Menu
									id="user-menu"
									anchorEl={menuAnchor}
									open={Boolean(menuAnchor)}
									onClose={this.handleClose}
								>
									<MenuItem
										disabled
										className={classes.header}
									>
										<Avatar className={classes.avatar}>{user.username[0]}</Avatar>
										<Typography>{user.username}</Typography>
									</MenuItem>

									<Divider />
									<MenuItem
										button
										disabled={true}>
										<ListItemText primary="Change Password"/>
									</MenuItem>
									<MenuItem
										button
										disabled={true}>
										<ListItemText primary="Change PIN" />
									</MenuItem>
									<MenuItem
										button
										disabled={true}>
										<ListItemText primary="Change Security Questions" />
									</MenuItem>
									<MenuItem
										button
										disabled={true}
									>
										<ListItemText primary="Recover Account" />
									</MenuItem>
									<MenuItem
										button
										disabled={!user.username}
										onClick={() => removeAccount(user.username)}>
										<ListItemText primary="Unregister Device" />
									</MenuItem>
									<MenuItem
										button
										disabled={!user.authenticated}
										onClick={lockAccount}>
										<ListItemText primary="Log Out" />
									</MenuItem>

									<Divider />
									<MenuItem
										disabled={true}
									>
										<div style={{ flex:2 }}>
											<img
												src={darkLogoUrl}
												alt="kWallet"
												className={classes.menuLogo}
											/>
										</div>
										<div style={{ flex:1 }}>
											<Typography variant="caption">
												v0.0.1-alpha
											</Typography>
										</div>
									</MenuItem>


								</Menu>
							</span>
						)}
					</div>
				</Toolbar>
			</AppBar>
		);
	}
}

Header.propTypes = {
	classes: PropTypes.object.isRequired,
	user: PropTypes.object.isRequired,
	history: PropTypes.object.isRequired,
	leftButton: PropTypes.element
};

const mapStateToProps = (state) => {
	return {
		user: state.user
	};
};

const mapDispatchToProps = () => {
	return {
		foo: () => {
			// nothing there
		},
	};
};

export default compose(
	withStyles(styles),
	withRouter,
	connect(mapStateToProps, mapDispatchToProps)
)(Header);
