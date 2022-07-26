import React, { createContext, useContext } from 'react';

import { child, get, push, ref } from 'firebase/database';

import { database } from '../utils/init-firebase';

const DatabaseContext = createContext({
	database: database,
	child: child,
	get: get,
	push: push,
	ref: ref
});

export const useDB = () => useContext(DatabaseContext);

export default function DatabaseContextProvider({ children }) {
	const value = {
		database,
		child,
		get,
		push,
		ref
	};

	return (<DatabaseContext.Provider value={value}>{children}</DatabaseContext.Provider>);
}