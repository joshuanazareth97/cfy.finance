import { Unit } from '@harmony-js/utils';
import {
	Box,
	Button,
	CardMedia,
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
import heroImg from 'assets/images/hero.png';
import NFTCard from 'components/NFTCard/NFTCard';
import { useHarmony } from 'context/harmonyContext';
import Contracts from 'contracts/contracts.json';
import { createNFTContract, getLoanContractFromConnector, getNFTContractFromConnector } from 'helpers/contractHelper';
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
	symbol?: string;
	name?: string;
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

	//FORM STATE
	const [loanAmount, setLoanAmount] = useState<string | null>(null);
	const [interest, setInterest] = useState<string | null>(null);
	const [singlePeriod, setSinglePeriod] = useState<number | null>(null);
	const [maxPeriods, setMaxPeriods] = useState<number | null>(null);
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
				.send({ from: account });
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
		if (!selectedNFT || !connector || !library || !account || !loanAmount || !interest || !singlePeriod || !maxPeriods)
			return;
		try {
			setTransacting(true);
			const loanContract = await getLoanContractFromConnector(connector, library);
			const tx = await loanContract.methods
				.createLoanRequest(
					selectedNFT.address,
					selectedNFT.id,
					new Unit(loanAmount).asOne().toWei(),
					new Unit(interest).asOne().toWei(),
					singlePeriod,
					maxPeriods,
				)
				.send({ from: account });
			console.log(tx);
		} catch (err) {
			console.error(err);
		} finally {
			setLinkWindowOpen(false);
			loadContract();
			setTransacting(false);
		}
	}, [selectedNFT, connector, library, account, loanAmount, interest, maxPeriods, singlePeriod]);

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
			<Drawer
				PaperProps={{
					sx: { width: '40%', padding: `0 !important` },
				}}
				anchor="right"
				open={linkWindowOpen}
			>
				<DialogTitle
					sx={{
						fontSize: '2rem',
					}}
				>
					Collateralize
				</DialogTitle>
				<CardMedia
					sx={{
						width: 'auto',
						padding: '0 1rem',
						borderBottom: '0.5rem solid',
						borderColor: 'primary.main',
					}}
					component="img"
					src={heroImg}
				/>
				<DialogContent>
					<Box
						display="flex"
						flexDirection="column"
						alignItems="center"
						sx={{
							'& img': {
								width: '30%',
								borderRadius: '50%',
								marginBottom: '1rem',
							},
						}}
					>
						<img src={selectedNFT?.uri} alt={`${selectedNFT?.symbol} #${selectedNFT?.id}`} />
						<Typography
							fontWeight="bold"
							sx={{
								marginBottom: '0.5rem',
							}}
						>
							{selectedNFT?.symbol} #{selectedNFT?.id}
						</Typography>
						<Typography
							fontWeight="bold"
							sx={{
								marginBottom: '0.5rem',
							}}
						>
							{selectedNFT?.name}
						</Typography>
						<Typography
							fontSize="0.75rem"
							fontWeight="bold"
							sx={{
								marginBottom: '2rem',
							}}
						>
							{address}
						</Typography>
					</Box>
					<Typography
						sx={{
							marginBottom: '0.5rem',
						}}
						fontWeight="bold"
					>
						Loan Terms
					</Typography>
					<Box
						display="grid"
						sx={{
							gridTemplateColumns: {
								xs: 'repeat(1, 1fr)',
								sm: 'repeat(2, 1fr)',
							},
							gap: 2,
						}}
					>
						<TextField
							value={loanAmount || ''}
							onChange={event => setLoanAmount(event.target.value)}
							sx={{
								marginBottom: '0.5rem',
								'& .MuiInputBase-input': {
									padding: '0.75rem',
								},
							}}
							variant="outlined"
							placeholder="Loan Amount"
							type="number"
						/>
						<TextField
							value={interest || ''}
							onChange={event => setInterest(event.target.value)}
							sx={{
								marginBottom: '0.5rem',
								'& .MuiInputBase-input': {
									padding: '0.75rem',
								},
							}}
							variant="outlined"
							type="number"
							placeholder="Interest Amount"
						/>
						<TextField
							value={singlePeriod || ''}
							onChange={event => setSinglePeriod(parseInt(event.target.value))}
							sx={{
								marginBottom: '0.5rem',
								'& .MuiInputBase-input': {
									padding: '0.75rem',
								},
							}}
							variant="outlined"
							type="number"
							placeholder="Single Interest Period (days)"
						/>
						<TextField
							value={maxPeriods || ''}
							onChange={event => setMaxPeriods(parseInt(event.target.value))}
							sx={{
								marginBottom: '0.5rem',
								'& .MuiInputBase-input': {
									padding: '0.75rem',
								},
							}}
							variant="outlined"
							type="number"
							placeholder="Maximum Periods"
						/>
					</Box>
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
