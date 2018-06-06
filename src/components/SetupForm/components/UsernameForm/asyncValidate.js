import { usernameValid } from "../../../../modules/edge";

const asyncValidate = (values) => {
	return usernameValid(values.username).then( (result) => {
		if (result.status_code == 0) {
			throw { username: "Username is already taken." };
		}
	});
};

export default asyncValidate;
