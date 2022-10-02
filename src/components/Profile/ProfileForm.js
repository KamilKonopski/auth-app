import { useContext, useRef } from "react";
import { useHistory } from "react-router-dom";

import AuthContext from "../../store/auth-context";

import classes from "./ProfileForm.module.css";

function ProfileForm() {
	const newPasswordInputRef = useRef();
	const context = useContext(AuthContext);
	const history = useHistory();

	function submitHandler(event) {
		event.preventDefault();

		const enteredNewPassword = newPasswordInputRef.current.value;

		fetch(
			"https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyDOc-dxGRJLjd3g--ZdPU3QKVIzm2l1nYs",
			{
				method: "POST",
				body: JSON.stringify({
					idToken: context.token,
					password: enteredNewPassword,
					returnSecureToken: false,
				}),
				headers: {
					"Content-type": "application/json",
				},
			}
		).then((response) => {
			history.replace("/");
		});
	}

	return (
		<form className={classes.form} onSubmit={submitHandler}>
			<div className={classes.control}>
				<label htmlFor="new-password">New Password</label>
				<input
					type="password"
					ref={newPasswordInputRef}
					id="new-password"
					minLength="7"
				/>
			</div>
			<div className={classes.action}>
				<button>Change Password</button>
			</div>
		</form>
	);
}

export default ProfileForm;
