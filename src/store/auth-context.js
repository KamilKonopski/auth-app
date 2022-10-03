import React, { useCallback, useEffect, useState } from "react";

let logoutTimer;

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

function retrieveStoredToken() {
	const storedToken = localStorage.getItem("token");
	const storedExperationTime = localStorage.getItem("expirationTime");

	const remainingTime = calculateRemainingTime(storedExperationTime);

	if (remainingTime <= 60000) {
		localStorage.removeItem("token");
		localStorage.removeItem("expirationTime");
		return null;
	}

	return {
		token: storedToken,
		duration: remainingTime,
	};
}

export function AuthContextProvider(props) {
	const tokenData = retrieveStoredToken();
	let initialToken;
	if (tokenData) {
		initialToken = tokenData.token;
	}

	const [token, setToken] = useState(initialToken);

	const userIsLoggedIn = !!token;

	const logoutHandler = useCallback(() => {
		setToken(null);
		localStorage.removeItem("token");
		localStorage.removeItem("expirationTime");

		if (logoutTimer) {
			clearTimeout(logoutTimer);
		}
	}, []);

	function loginHandler(token, expirationTime) {
		setToken(token);
		localStorage.setItem("token", token);
		localStorage.setItem("expirationTime", expirationTime);

		const remainingTime = calculateRemainingTime(expirationTime);

		logoutTimer = setTimeout(logoutHandler, remainingTime);
	}

	useEffect(() => {
		if (tokenData) {
			logoutTimer = setTimeout(logoutHandler, tokenData.duration);
		}
	}, [tokenData, logoutHandler]);

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
