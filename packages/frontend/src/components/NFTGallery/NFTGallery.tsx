import Contracts from 'contracts/contracts.json';
import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Drawer,
	IconButton,
	LinearProgress,
	TextField,
	Typography,
} from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import NFTCard from 'components/NFTCard/NFTCard';
import { useHarmony } from 'context/harmonyContext';
import {
	createLoanContract,
	createNFTContract,
	getLoanContractFromConnector,
	getNFTContractFromConnector,
} from 'helpers/contractHelper';
import React, { useCallback, useEffect, useState } from 'react';
import { MdApproval, MdMoney, MdRefresh } from 'react-icons/md';
import { theme } from 'theme';
import { getUserNFTsFromContract } from 'utils';
// import { approveNFT, depositNFT, getUserNFTs } from 'utils';

const createLoanParams = [
	{
		internalType: 'uint256',
		name: 'loanAmount',
		type: 'uint256',
	},
	{
		internalType: 'uint256',
		name: 'interestAmount',
		type: 'uint256',
	},
	{
		internalType: 'uint256',
		name: 'singlePeriodTime',
		type: 'uint256',
	},
	{
		internalType: 'uint256',
		name: 'maximumInterestPeriods',
		type: 'uint256',
	},
];

type Props = {
	title: string;
	symbol: string;
	address: string;
};

export interface INFT {
	uri: string;
	id: number;
	approvedAddress: string;
	approved: boolean;
}

interface ISelectedNFT extends INFT {
	address: string;
}

const NFTGallery = ({ title, address, symbol }: Props) => {
	const { account, connector, library } = useWeb3React();
	const { hmy } = useHarmony();

	const [contract, setContract] = useState<any>(createNFTContract(hmy, address));
	const [loading, setLoading] = useState(true);
	const [tokens, setTokens] = useState<INFT[] | null>(null);

	const [selectedNFT, setSelectedNFT] = useState<ISelectedNFT | null>(null);
	const [linkWindowOpen, setLinkWindowOpen] = useState(false);
	const [ftAddress, setFTAddress] = useState('');
	const [ftCount, setFTCount] = useState<number | ''>('');
	const [transacting, setTransacting] = useState(false);

	const loadContract = useCallback(async () => {
		if (!account || !connector || !library) return;
		setLoading(true);
		const contractObj = await getNFTContractFromConnector(connector, library, address);
		const tokens = await getUserNFTsFromContract(contract, account);
		setContract(contractObj);
		setTokens(tokens);
		setLoading(false);
	}, [setLoading, account, connector, library]);

	useEffect(() => {
		loadContract();
	}, [loadContract]);

	const approve = useCallback(async () => {
		if (!selectedNFT || !contract) return;
		try {
			const res = await contract.methods
				.approve(Contracts.contracts.LoansNFT.address, selectedNFT.id)
				.send({ from: account, gasLimit: 100000 });
		} catch (err) {
			console.log(err);
		} finally {
			loadContract();
		}
	}, [contract, selectedNFT, account]);

	const handleNFTClick = useCallback(
		(token: INFT) => {
			setSelectedNFT({ ...token, address });
			if (token.approved) {
				setLinkWindowOpen(true);
			}
		},
		[account, contract, approve],
	);

	const createLoanRequest = useCallback(async () => {
		if (!selectedNFT || !connector || !library) return;
		const loanContract = await getLoanContractFromConnector(connector, library);
		console.log({ ...selectedNFT, amount: 1000, interest: 10, singlePeriod: 12, maxPeriods: 10 });
		const tx = await loanContract.methods
			.createLoanRequest(selectedNFT.address, selectedNFT.id, 1000, 10, 12, 10)
			.send({ from: account, gasLimit: 100000 });
		console.log(tx);
	}, [selectedNFT, connector, library]);

	useEffect(() => {
		if (selectedNFT?.approved) return;
		approve();
	}, [selectedNFT]);

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
								const approved = token.approved;
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
											<Box display="flex" alignItems="center" justifyContent="center">
												{approved ? (
													<MdMoney
														color={theme.palette.secondary.main}
														size="1.25rem"
														style={{ marginRight: '0.5rem' }}
													/>
												) : (
													<MdApproval size="1.25rem" style={{ marginRight: '0.5rem' }} />
												)}
												<Typography fontWeight="bold" fontSize="0.75rem">
													{approved ? 'Request Funds' : 'Approve'}
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
			<Drawer anchor="right" open={linkWindowOpen}>
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
					<Button disabled={transacting} onClick={createLoanRequest} variant="contained" color="primary">
						Create
					</Button>
				</DialogActions>
			</Drawer>
		</>
	);
};

export default NFTGallery;
