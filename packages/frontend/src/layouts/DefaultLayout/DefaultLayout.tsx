import {
	AppBar,
	Box,
	Button,
	Container,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	IconButton,
	Menu,
	MenuItem,
	Toolbar,
	Typography,
} from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import logoImg from 'assets/images/logo.png';
import { useHarmony } from 'context/harmonyContext';
import React, { useCallback, useState } from 'react';
import { MdAccountBalanceWallet, MdOutlineAccountCircle } from 'react-icons/md';
import { Link as RouterLink, Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { truncateString } from 'utils';
import { ConnectorNames, connectorsByName } from 'utils/connectors';

type Props = {
	children?: React.ReactNode;
};

const DefaultLayout = ({ children }: Props) => {
	const { hmy } = useHarmony();
	const { account, deactivate, activate } = useWeb3React();

	const [infoOpen, setInfoOpen] = useState(false);
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

	const handleMenu = useCallback(
		(event: React.MouseEvent<HTMLElement>) => {
			if (account) {
				setAnchorEl(event.currentTarget);
			} else {
				activate(connectorsByName[ConnectorNames.Metamask]);
			}
		},
		[account, activate],
	);

	const logout = useCallback(() => {
		deactivate();
	}, [deactivate]);

	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<>
			<AppBar color="transparent" position="static">
				<Toolbar
					sx={{
						display: 'flex',
						justifyContent: 'space-between',
					}}
				>
					<Typography
						color="white"
						fontWeight="bold"
						variant="h6"
						component={RouterLink}
						to="/"
						sx={{
							display: 'flex',
							textDecoration: 'none',
							alignItems: 'center',
							padding: '0.5rem',
							'& img': {
								display: 'inline-block',
								marginRight: '1rem',
								width: '3rem',
							},
						}}
					>
						<img src={logoImg} />
						CFY
					</Typography>
					<Box display="flex">
						<Button
							component={RouterLink}
							to="/lend"
							sx={{
								display: 'flex',
								textDecoration: 'none',
								marginRight: '0.5rem',
							}}
						>
							Lend
						</Button>
						<Button
							component={RouterLink}
							to="/borrow"
							sx={{
								display: 'flex',
								textDecoration: 'none',
								marginRight: '0.5rem',
							}}
						>
							Borrow
						</Button>
						<div>
							<IconButton onClick={handleMenu}>
								{account ? <MdOutlineAccountCircle /> : <MdAccountBalanceWallet />}
							</IconButton>
							{account && (
								<Menu
									id="menu-appbar"
									anchorEl={anchorEl}
									anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
									transformOrigin={{ vertical: 'top', horizontal: 'center' }}
									keepMounted
									open={Boolean(anchorEl)}
									onClose={handleClose}
								>
									<MenuItem onClick={handleClose}>{truncateString(account)}</MenuItem>
									<MenuItem onClick={logout}>Logout</MenuItem>
								</Menu>
							)}
						</div>
					</Box>
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
				<DialogTitle>Add the Metamask wallet extension</DialogTitle>
				<DialogContent>
					<Typography mb="1rem">
						It seems like you don't have the{' '}
						<a target=" __blank" href="https://metamask.io/">
							Metamask Wallet extension
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
