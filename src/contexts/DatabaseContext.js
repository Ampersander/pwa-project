import React, { createContext, useContext } from 'react';

import { child, get, push, ref, onChildAdded, onValue } from 'firebase/database';

import { database } from '../utils/init-firebase';

const DatabaseContext = createContext({
	database: database,
	child: child,
	get: get,
	push: push,
	ref: ref,
	onValue: onValue
});

export const useDB = () => useContext(DatabaseContext);

export default function DatabaseContextProvider({ children }) {
	const value = {
		database,
		child,
		get,
		push,
		ref,
		onValue
};

	return (<DatabaseContext.Provider value={value}>{children}</DatabaseContext.Provider>);
}