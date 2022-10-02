import React, { useState } from "react";

const AuthContext = React.createContext({
	token: "",
	isLoggedIn: false,
	login: function (token) {},
	logout: function () {},
});

function calculateRemainingTime(expirationTime) {
	const currentTime = new Date().getTime();
	const adjExpirationTime = new Date(expirationTime).getTime();

	const remainingTime = adjExpirationTime - currentTime;

	return remainingTime;
}

export function AuthContextProvider(props) {
	const initialToken = localStorage.getItem("token");
	const [token, setToken] = useState(initialToken);

	const userIsLoggedIn = !!token;

	function logoutHandler() {
		setToken(null);
		localStorage.removeItem("token");
	}

	function loginHandler(token, expirationTime) {
		setToken(token);
		localStorage.setItem("token", token);

		const remainingTime = calculateRemainingTime(expirationTime);

		setTimeout(logoutHandler, remainingTime);
	}

	const contextValue = {
		token: token,
		isLoggedIn: userIsLoggedIn,
		login: loginHandler,
		logout: logoutHandler,
	};

	return (
		<AuthContext.Provider value={contextValue}>
			{props.children}
		</AuthContext.Provider>
	);
}

export default AuthContext;
