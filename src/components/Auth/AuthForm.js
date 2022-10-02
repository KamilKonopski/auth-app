import { useRef, useState } from "react";

import classes from "./AuthForm.module.css";

function AuthForm() {
	const [isLogin, setIsLogin] = useState(true);
	const [isLoading, setIsLoading] = useState(false);
	const emailInputRef = useRef();
	const passwordInputRef = useRef();

	function switchAuthModeHandler() {
		setIsLogin((prevState) => !prevState);
	}

	function submitHandler(event) {
		event.preventDefault();

		const enteredEmail = emailInputRef.current.value;
		const enteredPassword = passwordInputRef.current.value;

		setIsLoading(true);
		if (isLogin) {
		} else {
			fetch(
				"https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDOc-dxGRJLjd3g--ZdPU3QKVIzm2l1nYs",
				{
					method: "POST",
					body: JSON.stringify({
						email: enteredEmail,
						password: enteredPassword,
						returnSecureToken: true,
					}),
					headers: {
						"Content-Type": "application/json",
					},
				}
			).then((response) => {
				setIsLoading(false);
				if (response.ok) {
				} else {
					return response.json().then((data) => {
						let errorMessage = "Authentication failed!";
						alert(errorMessage);
					});
				}
			});
		}
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
