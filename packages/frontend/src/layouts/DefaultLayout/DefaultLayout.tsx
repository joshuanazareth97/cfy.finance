import {
	AppBar,
	Button,
	Container,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Toolbar,
	Typography,
} from '@mui/material';
import logoImg from 'assets/images/logo.png';
import { useHarmony } from 'context/harmonyContext';
import React, { useCallback, useEffect, useState } from 'react';
import { Link as RouterLink, Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

type Props = {
	children?: React.ReactNode;
};

const DefaultLayout = ({ children }: Props) => {
	const [infoOpen, setInfoOpen] = useState(false);
	const { hmy } = useHarmony();

	return (
		<>
			<AppBar color="primary" position="static">
				<Toolbar>
					<Typography
						color="white"
						fontWeight="bold"
						variant="h6"
						component={RouterLink}
						to="/"
						sx={{
							display: 'flex',
							'& img': {
								width: '10rem',
							},
						}}
					>
						<img src={logoImg} />
					</Typography>
				</Toolbar>
			</AppBar>
			<Container
				sx={{
					paddingTop: '3rem',
					display: 'flex',
					flexDirection: 'column',
					minHeight: 'calc(100vh - 64px)',
				}}
			>
				{children ?? <Outlet />}
			</Container>
			<Dialog open={infoOpen}>
				<DialogTitle>Add the Zilpay wallet extension</DialogTitle>
				<DialogContent>
					<Typography mb="1rem">
						It seems like you don't have the{' '}
						<a target=" __blank" href="https://zilpay.io/">
							Zilpay Wallet extension
						</a>{' '}
						installed in your browser.
					</Typography>
					<Typography mb="1rem">
						Once you have added the extension to your browser, connect your wallet using the button in the top right of
						the menu bar.
					</Typography>
					<Typography mb="1rem">This will allow you to trustlessly login and begin using the app.</Typography>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setInfoOpen(false)} variant="contained" color="primary">
						Got It!
					</Button>
				</DialogActions>
			</Dialog>
			<ToastContainer />
		</>
	);
};

export default DefaultLayout;
