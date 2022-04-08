import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

type Props = {
	isAuth: boolean;
	children?: JSX.Element;
	redirect?: string;
};

const ProtectedRoute = ({ children, isAuth, redirect = '/' }: Props) => {
	if (!isAuth) {
		return <Navigate to="/" replace />;
	}
	return children ? children : <Outlet />;
};

export default ProtectedRoute;
