import { Box, Button, Collapse, IconButton, TextField, Tooltip, Typography } from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import BorrowerDashboard from 'components/BorrowerDashboard/BorrowerDashboard';
import NFTGallery from 'components/NFTGallery/NFTGallery';
import { useHarmony } from 'context/harmonyContext';
import { createNFTContract } from 'helpers/contractHelper';
import React, { useCallback, useState } from 'react';
import { MdAdd, MdClose, MdInfo } from 'react-icons/md';
import { toast } from 'react-toastify';
import { theme } from 'theme';
import { decodeSmartContractResult, getUserNFTsFromContract } from 'utils';

const NFTListPage = () => {
	const [addFieldOpen, setAddFieldOpen] = useState(false);
	const [addNFTAddress, setAddNFTAddress] = useState('');

	const { account } = useWeb3React();
	const { hmy, userNFTs, setUserNFTs } = useHarmony();

	const handleButtonClick = useCallback(async () => {
		if (addFieldOpen) {
			if (!account) return;
			if (!addNFTAddress) return;
			const contract = createNFTContract(hmy, addNFTAddress);
			const balanceResult = await contract.methods.balanceOf(account).call();
			const bal = decodeSmartContractResult(balanceResult);
			if (bal) {
				const symbol = await contract.methods.symbol().call();
				const name = await contract.methods.name().call();
				setUserNFTs((userNFTs: any) => ({ [addNFTAddress]: { symbol, name }, ...userNFTs }));
			}
		} else {
			setAddFieldOpen(true);
		}
	}, [addFieldOpen, addNFTAddress, userNFTs, setUserNFTs, hmy, account]);

	return (
		<>
			<Box
				display="flex"
				alignItems="center"
				justifyContent="space-between"
				padding="1rem 0"
				borderBottom="3px solid lightGrey"
				marginBottom="2rem"
			>
				<Typography
					color="text.primary"
					fontWeight="bold"
					component="div"
					variant="h4"
					sx={{
						flexGrow: 1,
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
					}}
				>
					Create a Loan Request
					<Box display="flex" alignItems="center">
						<MdInfo
							style={{
								marginRight: '0.25rem',
							}}
							color={theme.palette.primary.main}
							size="1rem"
						/>
						<Typography fontSize="0.75rem">
							Click on a token to approve it for deposit. Click on an approved token to collateralize it.
						</Typography>
					</Box>
				</Typography>
			</Box>
			{userNFTs ? (
				Object.keys(userNFTs).map((key: string) => {
					const metadata = userNFTs[key];
					return <NFTGallery address={key} key={key} title={metadata.name} symbol={metadata.symbol} />;
				})
			) : (
				<Typography>Looks like you haven't added any NFTs. Import tokens with the button below to begin.</Typography>
			)}
			<Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
				<Tooltip title="Add New NFT" placement="bottom">
					<Button
						//   startIcon={}
						sx={{
							padding: '0.75rem 0.5rem',
							marginBottom: '0.5rem',
						}}
						onClick={handleButtonClick}
						startIcon={<MdAdd size="1.25rem" />}
					>
						Import Custom Token
					</Button>
				</Tooltip>
				<Collapse orientation="vertical" collapsedSize={0} in={addFieldOpen}>
					<TextField
						placeholder="NFT Contract address"
						sx={{
							'& .MuiInputBase-root': {
								height: '2.75rem',
							},
							'& .MuiInputBase-input': {
								fontWeight: 'bold',
							},
						}}
						value={addNFTAddress}
						onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
							setAddNFTAddress(event.target.value);
						}}
						onKeyUp={(event: React.KeyboardEvent<HTMLInputElement>) => {
							if (event.key !== 'Enter') return;
							handleButtonClick();
						}}
						InputProps={{
							endAdornment: (
								<IconButton
									onClick={() => {
										setAddNFTAddress('');
										setAddFieldOpen(false);
									}}
								>
									<MdClose size="1rem" />
								</IconButton>
							),
						}}
						variant="outlined"
					/>
				</Collapse>
			</Box>
			<Box
				display="flex"
				alignItems="center"
				justifyContent="space-between"
				padding="1rem 0"
				borderBottom="3px solid lightGrey"
				marginBottom="2rem"
			>
				<Typography
					color="text.primary"
					fontWeight="bold"
					component="div"
					variant="h4"
					sx={{
						flexGrow: 1,
						display: 'flex',
						flexDirection: 'column',
					}}
				>
					Open Requests
				</Typography>
			</Box>
			<BorrowerDashboard />
		</>
	);
};

export default NFTListPage;
