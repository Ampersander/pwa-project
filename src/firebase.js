import { createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
// import { toast } from 'react-toastify';

import { auth, db, googleProvider } from '../utils/init-firebase';

const signInWithGoogle = async () => {
	try {
		const res = await signInWithPopup(auth, googleProvider);
		const user = res.user;
		const q = query(collection(db, 'users'), where('uid', '==', user.uid));
		const docs = await getDocs(q);

		if (docs.docs.length === 0) {
			await addDoc(collection(db, 'users'), {
				uid: user.uid,
				name: user.displayName,
				authProvider: 'google',
				email: user.email
			});
		}

		// toast.success('Logged in!');
	} catch (err) {
		// console.error(err);
		alert('Error logging in with Google.');
	}
};

const logInWithEmailAndPassword = async (email, password) => {
	try {
		await signInWithEmailAndPassword(auth, email, password);
		// toast.success('Logged in!');
	} catch (error) {
		switch (error.code) {
			case 'auth/user-not-found':
			case 'auth/wrong-password':
			default:
				// toast.error('Wrong credentials. Please try again.');
				break;
		}
	}
};

const registerWithEmailAndPassword = async (name, email, password) => {
	try {
		const res = await createUserWithEmailAndPassword(auth, email, password);
		const user = res.user;

		await addDoc(collection(db, 'users'), {
			uid: user.uid,
			name,
			authProvider: 'local',
			email
		});

		// toast.success('Registered!');
	} catch (error) {
		if (error.code === 'auth/email-already-in-use') {
			// toast.error('Email Already in Use');
		}
	}
};

const sendPasswordReset = async email => {
	try {
		await sendPasswordResetEmail(auth, email);
		alert('Password reset link sent!');
	} catch (err) {
		// console.error(err);
		alert('Error sending password reset link.');
	}
};

const logout = () => {
	// toast.success('Logged out!');
	signOut(auth);
};

export {
	auth,
	db,
	signInWithGoogle,
	logInWithEmailAndPassword,
	registerWithEmailAndPassword,
	signInWithEmailAndPassword,
	sendPasswordReset,
	logout,
};
