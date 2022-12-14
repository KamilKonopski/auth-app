import { useContext, useRef, useState } from "react";
import { useHistory } from "react-router-dom";

import AuthContext from "../../store/auth-context";

import classes from "./AuthForm.module.css";

function AuthForm() {
	const [isLogin, setIsLogin] = useState(true);
	const [isLoading, setIsLoading] = useState(false);
	const emailInputRef = useRef();
	const passwordInputRef = useRef();
	const context = useContext(AuthContext);
	const history = useHistory();

	function switchAuthModeHandler() {
		setIsLogin((prevState) => !prevState);
	}

	function submitHandler(event) {
		event.preventDefault();

		const enteredEmail = emailInputRef.current.value;
		const enteredPassword = passwordInputRef.current.value;

		setIsLoading(true);
		let url;
		if (isLogin) {
			url =
				"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDOc-dxGRJLjd3g--ZdPU3QKVIzm2l1nYs";
		} else {
			url =
				"https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDOc-dxGRJLjd3g--ZdPU3QKVIzm2l1nYs";
		}
		fetch(url, {
			method: "POST",
			body: JSON.stringify({
				email: enteredEmail,
				password: enteredPassword,
				returnSecureToken: true,
			}),
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((response) => {
				setIsLoading(false);
				if (response.ok) {
					return response.json();
				} else {
					return response.json().then((data) => {
						let errorMessage = "Authentication failed!";
						throw new Error(errorMessage);
					});
				}
			})
			.then((data) => {
				const expirationTime = new Date(
					new Date().getTime() + +data.expiresIn * 1000
				);
				context.login(data.idToken, expirationTime.toISOString());
				history.replace("/");
			})
			.catch((err) => {
				alert(err.message);
			});
	}

	return (
		<section className={classes.auth}>
			<h1>{isLogin ? "Login" : "Sign Up"}</h1>
			<form onSubmit={submitHandler}>
				<div className={classes.control}>
					<label htmlFor="email">Your Email</label>
					<input type="email" ref={emailInputRef} id="email" required />
				</div>
				<div className={classes.control}>
					<label htmlFor="password">Your Password</label>
					<input
						type="password"
						ref={passwordInputRef}
						id="password"
						required
					/>
				</div>
				<div className={classes.actions}>
					{!isLoading && (
						<button>{isLogin ? "Login" : "Create Account"}</button>
					)}
					{isLoading && <p>Loading...</p>}
					<button
						type="button"
						className={classes.toggle}
						onClick={switchAuthModeHandler}
					>
						{isLogin ? "Create new account" : "Login with existing account"}
					</button>
				</div>
			</form>
		</section>
	);
}

export default AuthForm;
