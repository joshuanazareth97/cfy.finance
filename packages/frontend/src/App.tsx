import { ThemeProvider } from '@mui/material/styles';
import { useWeb3React } from '@web3-react/core';
import { useHarmony } from 'context/harmonyContext';
import DefaultLayout from 'layouts/DefaultLayout/DefaultLayout';
import React from 'react';
import { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';
import { ConnectorNames, connectorsByName } from 'utils/connectors';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import { routeList } from './routes';
import { theme } from './theme';

const App = () => {
	return (
		<ThemeProvider theme={theme}>
			<AppContent />
		</ThemeProvider>
	);
};

const AppContent = () => {
	const { account, activate } = useWeb3React();
	const { loggedIn } = useHarmony();
	return (
		<BrowserRouter>
			<Routes>
				{routeList.map(({ Component, LayoutElement, ...route }) => {
					return (
						<Route key={route.url} element={LayoutElement ? <LayoutElement /> : <DefaultLayout />}>
							<Route
								path={route.url}
								element={
									route.protected ? (
										<ProtectedRoute isAuth={loggedIn}>
											<Component />
										</ProtectedRoute>
									) : (
										<Component />
									)
								}
							/>
						</Route>
					);
				})}
			</Routes>
		</BrowserRouter>
	);
};

const Flex = styled.div`
	display: flex;
	align-items: center;
`;

const Topbar = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 74px;
	width: 100%;
`;

const Content = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	flex: 1;
	width: 100%;
`;

const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	min-height: 100vh;
	padding: 0px 24px;
	max-width: 1200px;
	margin: 0 auto;
`;

const Wrapper = styled.div`
	background-color: #0093e9;
	background-image: linear-gradient(160deg, #0093e9 0%, #80d0c7 100%);
	font-size: 1rem;
	color: white;
`;

export default App;
