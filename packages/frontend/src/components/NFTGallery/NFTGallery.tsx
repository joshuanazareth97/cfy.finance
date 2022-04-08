import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Grid,
	IconButton,
	LinearProgress,
	TextField,
	Typography,
} from '@mui/material';
import NFTCard from 'components/NFTCard/NFTCard';
import React, { useCallback, useEffect, useState } from 'react';
import { MdApproval, MdGeneratingTokens, MdMail, MdRefresh } from 'react-icons/md';
import { toast } from 'react-toastify';
import { theme } from 'theme';
import { approveNFT, depositNFT, getUserNFTs } from 'utils';

type Props = {
	title: string;
	symbol: string;
	address: string;
};

interface INFT {
	uri: string;
	id: string;
	approved: boolean;
}

interface ISelectedNFT extends INFT {
	address: string;
}

const NFTGallery = ({ title, address, symbol }: Props) => {
	const [contractState, setContractState] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const [tokens, setTokens] = useState<INFT[] | null>(null);

	const [selectedNFT, setSelectedNFT] = useState<ISelectedNFT | null>(null);
	const [linkWindowOpen, setLinkWindowOpen] = useState(false);
	const [ftAddress, setFTAddress] = useState('');
	const [ftCount, setFTCount] = useState<number | ''>('');
	const [transacting, setTransacting] = useState(false);

	const loadContract = useCallback(async () => {
		setLoading(true);
		// const contract = zilPay.contracts.at(address);
		const state = await contract.getState();
		setContractState(state);
		setLoading(false);
	}, [zilPay, setContractState, setLoading]);

	useEffect(() => {
		if (!zilPay) return;
		loadContract();
	}, [zilPay, setContractState, loadContract]);

	useEffect(() => {
		if (!(contractState && currentUser)) return;
		const userTokens: INFT[] = getUserNFTs(contractState, currentUser.base16);
		setTokens(userTokens);
	}, [contractState, currentUser]);

	const approve = useCallback(async () => {
		if (!zilPay || !selectedNFT) return;
		console.log('clciked');
		try {
			const approvePromise = approveNFT(zilPay, selectedNFT.id, selectedNFT.address);
			const res = await toast.promise(approvePromise, {
				pending: 'Approving NFT for use...',
				success: 'Success!',
				error: 'There was an error',
			});
		} catch (err) {
			console.log(err);
		} finally {
			loadContract();
		}
	}, [zilPay, selectedNFT]);

	const handleNFTClick = useCallback(
		(token: INFT) => {
			setSelectedNFT({ ...token, address });
			if (token.approved) {
				setLinkWindowOpen(true);
			}
		},
		[currentUser, contractState, approve],
	);

	useEffect(() => {
		if (selectedNFT?.approved) return;
		approve();
	}, [selectedNFT]);

	const deposit = useCallback(async () => {
		if (!zilPay || !selectedNFT || !ftAddress || !ftCount) return;
		setTransacting(true);
		try {
			const depositPromise = depositNFT(zilPay, selectedNFT.id, selectedNFT.address, ftAddress, ftCount);
			const res = await toast.promise(depositPromise, {
				pending: 'Depositing your NFT and linking it to the provided tokens...',
				success: 'Success!',
				error: 'There was an error',
			});
			setLinkWindowOpen(false);
		} catch (err) {
			console.log(err);
		} finally {
			setTransacting(false);
			loadContract();
		}
	}, [zilPay, selectedNFT, ftAddress, ftCount]);

	return (
		<>
			<Box
				display="flex"
				flexDirection="column"
				alignItems="stretch"
				borderBottom="2px solid lightGrey"
				marginBottom="3rem"
				paddingBottom="2rem"
			>
				<Box marginBottom="0.5rem" display="flex" alignItems="center">
					<Typography variant="h6" fontWeight="bold">
						{title} ({symbol})
					</Typography>
					<IconButton onClick={loadContract} style={{ marginRight: '0.5rem' }}>
						<MdRefresh color={theme.palette.primary.main} />
					</IconButton>
				</Box>
				{loading && <LinearProgress sx={{ alignSelf: 'stretch' }} />}
				{!loading &&
					(tokens?.length ? (
						<Box
							sx={{
								display: 'grid',
								gridTemplateColumns: {
									xs: 'repeat(1, 1fr)',
									sm: 'repeat(2, 1fr)',
									md: 'repeat(3, 1fr)',
									lg: 'repeat(5, 1fr)',
									// xl: "repeat(6, 1fr)",
								},
								gap: 6,
							}}
						>
							{tokens.map(token => {
								return (
									// <Grid item sm={6} md={3} key={token.id}>
									<NFTCard
										key={token.id}
										onClick={() => handleNFTClick(token)}
										// token.approved ? handleNFTClick(token) : approve()
										primaryText={
											<Typography gutterBottom variant="h5" component="div">
												Token #{token.id}
											</Typography>
										}
										uri={token.uri}
										secondaryText={
											<Box display="flex" alignItems="center">
												{token.approved ? (
													<MdMail
														color={theme.palette.secondary.main}
														size="1.25rem"
														style={{ marginRight: '0.5rem' }}
													/>
												) : (
													<MdApproval size="1.25rem" style={{ marginRight: '0.5rem' }} />
												)}
												<Typography fontWeight="bold" fontSize="0.75rem">
													{token.approved ? 'Deposit' : 'Approve'}
												</Typography>
											</Box>
										}
									/>
									// </Grid>
								);
							})}
						</Box>
					) : (
						<Typography>You have no tokens for this contract!</Typography>
					))}
			</Box>
			<Dialog open={linkWindowOpen}>
				<DialogTitle>Deposit and Link</DialogTitle>
				<DialogContent>
					<Typography fontWeight="bold">Non Fungible Token #{selectedNFT?.id}</Typography>
					<Typography
						sx={{
							marginBottom: '1rem',
						}}
					>
						{address}
					</Typography>
					<Typography
						sx={{
							marginBottom: '0.5rem',
						}}
						fontWeight="bold"
					>
						Fungible (ZRC2) Token
					</Typography>
					<TextField
						value={ftAddress}
						onChange={event => setFTAddress(event.target.value)}
						sx={{
							marginBottom: '0.5rem',
							'& .MuiInputBase-input': {
								padding: '0.75rem',
							},
						}}
						variant="outlined"
						placeholder="Contract Address"
						fullWidth
					/>
					<TextField
						value={ftCount}
						onChange={event => setFTCount(parseInt(event.target.value))}
						sx={{
							marginBottom: '0.5rem',
							'& .MuiInputBase-input': {
								padding: '0.75rem',
							},
						}}
						fullWidth
						variant="outlined"
						type="number"
						placeholder="Number of shares"
					/>
				</DialogContent>
				<DialogActions>
					<Button disabled={transacting} onClick={() => setLinkWindowOpen(false)} variant="outlined" color="primary">
						Cancel
					</Button>
					<Button disabled={transacting} onClick={deposit} variant="contained" color="primary">
						Deposit
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};

export default NFTGallery;
