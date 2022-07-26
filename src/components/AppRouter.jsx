import React from 'react';
import { BrowserRouter, Redirect, Route, Switch, useLocation } from 'react-router-dom';

import { useAuth } from '../contexts/AuthContext';
import ForgotPassword from '../pages/auth/ForgotPassword';
import Login from '../pages/auth/Login';
import Profile from '../pages/auth/Profile';
import Register from '../pages/auth/Register';
import ResetPassword from '../pages/auth/ResetPassword';
import Home from '../pages/Home';
import NotFound from '../pages/NotFound';
import Editor from '../pages/Editor';

const ProtectedRoute = (props) => {
	const { currentUser } = useAuth();
	const location = useLocation();
	const { path, isLoading = true } = props;

	const guestRoutes = ['/login', '/register', '/forgot-password'];

	if (guestRoutes.includes(path)) {
		return currentUser
			? (<Redirect to={location.state?.from ?? '/profile'} />)
			: (<Route {...props} />)
		;
	}

	return currentUser
		? (<Route {...props} />)
		: (<Redirect to={{ pathname: '/login', state: { from: path } }} />
	);
}

export default function AppRouter(props) {
	return (
		<BrowserRouter>
			<Switch>
				<Route exact path='/' component={Home} />

				<ProtectedRoute exact path='/editor' component={Editor} />
				<ProtectedRoute exact path='/profile' component={Profile} />
				<ProtectedRoute exact path='/reset-password' component={ResetPassword} />
				<ProtectedRoute exact path='/login' component={Login} />
				<ProtectedRoute exact path='/register' component={Register} />
				<ProtectedRoute exact path='/forgot-password' component={ForgotPassword} />

				<Route exact path='*' component={NotFound} />
			</Switch>
		</BrowserRouter>
	);
}