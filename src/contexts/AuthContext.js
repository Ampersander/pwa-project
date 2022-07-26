import React, { createContext, useContext, useEffect, useState } from 'react';

import {
	createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail,
	onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut, confirmPasswordReset, ProviderId,
	updateCurrentUser, updateEmail, updateProfile, EmailAuthProvider, reauthenticateWithCredential, reauthenticateWithPopup
} from 'firebase/auth';
import { getDatabase, onDisconnect, ref, set } from "firebase/database";

import { useDB } from '../contexts/DatabaseContext';
import { auth } from '../utils/init-firebase';

const AuthContext = createContext({
	currentUser: null,
	isLoading: true,
	writeUserData: () => {},
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
	const { database, child, push, ref } = useDB();
	const [currentUser, setCurrentUser] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const usersRef = ref(database, 'users');

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, user => {
			if (user) {
				setCurrentUser(user);
				// setIsLoading(false)
			} else {
				setCurrentUser(null);
				// setIsLoading(true)
			}
		});

		return () => unsubscribe();
	}, [currentUser, isLoading]);

	function writeUserData({ user, isOnline } = {}) {
		// console.log(user, isOnline, usersRef, child(usersRef, user.uid));

		push(child(usersRef, user.uid), {
			// displayName: user.displayName,
			// email: user.email,
			// photoUrl: user.photoUrl,
			// isOnline: isOnline
			aaa: 'John',
			bbb: 'DOE'
		});
	}

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
			url: `http://localhost:3000/login`
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
		isLoading,
		writeUserData,
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