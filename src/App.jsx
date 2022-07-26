import React from 'react';
import AppRouter from './components/AppRouter';
import AuthContextProvider from './contexts/AuthContext';
import DatabaseContextProvider from './contexts/DatabaseContext';

function App(props) {
	return (
		<AuthContextProvider>
			<DatabaseContextProvider>
				<AppRouter />
			</DatabaseContextProvider>
		</AuthContextProvider>
	);
}

export default App;