const toolbarHeight = 75;

const styles = (theme) => ({
	root: {
		height: "100vh",
		backgroundColor: theme.palette.primary.main,
		color: theme.palette.primary.contrastText
	},
	flexContainer: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		height: "100%",
		marginLeft: theme.spacing.unit * 2,
		marginRight: theme.spacing.unit * 2,
		marginBottom: theme.spacing.unit * 2,
		marginTop: -toolbarHeight
	},
	faded: {
		color: theme.palette.primary.contrastText,
		opacity: "0.9"
	}
});

export default styles;
