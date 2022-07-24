import React, { createContext, useContext, useEffect, useState } from 'react';

import {
	createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail,
	onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut, confirmPasswordReset, ProviderId,
	updateCurrentUser, updateEmail, updateProfile, EmailAuthProvider, reauthenticateWithCredential, reauthenticateWithPopup
} from 'firebase/auth';

import { auth } from '../utils/init-firebase';

const AuthContext = createContext({
	currentUser: null,
	signInWithGoogle: () => Promise,
	login: () => Promise,
	register: () => Promise,
	update: () => Promise,
	logout: () => Promise,
	forgotPassword: () => Promise,
	resetPassword: () => Promise,
	destroy: () => Promise
});

export const useAuth = () => useContext(AuthContext);

export default function AuthContextProvider({ children }) {
	const [currentUser, setCurrentUser] = useState(null);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, user => setCurrentUser(user ?? null));
		return () => unsubscribe();
	}, []);

	function login(email, password) {
		return signInWithEmailAndPassword(auth, email, password);
	}

	function register(email, password) {
		return createUserWithEmailAndPassword(auth, email, password);	
	}

	function confirm(password, callback) {
		switch (currentUser.providerData[0].providerId) {
			case ProviderId.GOOGLE:
				const provider = new GoogleAuthProvider();

				return reauthenticateWithPopup(currentUser, provider)
					.then(callback);
				;
			case ProviderId.PASSWORD:
				const credential = EmailAuthProvider.credential(
					currentUser.email,
					password
				);

				return reauthenticateWithCredential(currentUser, credential)
					.then(callback)
				;
			default:
				return;
		}
	}

	function update(user, name = '', value = null, password = '') {
		let options = null;

		switch (name) {
			case 'displayName':
			case 'photoUrl':
				return updateProfile(user, { [name]: value });
			case 'profile':
				return updateProfile(user, value);
			case 'email':
				return confirm(password, (res) => updateEmail(user, value));
			default:
				return updateCurrentUser(auth, user);
		}
	}

	function destroy(password = '') {
		return confirm(password, (res) => currentUser.delete());
	}

	function forgotPassword(email) {
		return sendPasswordResetEmail(auth, email, {
			url: `http://localhost:3000/login`,
		});
	}

	function resetPassword(oobCode, newPassword) {
		return confirmPasswordReset(auth, oobCode, newPassword);
	}

	function logout() {
		return signOut(auth);
	}

	function signInWithGoogle() {
		const provider = new GoogleAuthProvider();
		return signInWithPopup(auth, provider);
	}

	const value = {
		currentUser,
		signInWithGoogle,
		login,
		register,
		update,
		logout,
		forgotPassword,
		resetPassword,
		destroy
	};

	return (<AuthContext.Provider value={value}>{children}</AuthContext.Provider>);
}