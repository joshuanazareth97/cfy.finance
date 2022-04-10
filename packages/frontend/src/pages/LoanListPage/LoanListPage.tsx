import { Box, CircularProgress, IconButton, LinearProgress, Typography } from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import { ILoanRequest } from 'components/BorrowerDashboard/BorrowerDashboard';
import LoanCard from 'components/LoanCard/LoanCard';
import { useHarmony } from 'context/harmonyContext';
import { createLoanContract, createNFTContract, getLoanContractFromConnector } from 'helpers/contractHelper';
import React, { useCallback, useState } from 'react';
import { useEffect } from 'react';
import { MdRefresh } from 'react-icons/md';
import { getAllLoansFromContract, getNFT, splitArray, truncateString } from 'utils';
import { fromWei, Units, Unit } from '@harmony-js/utils';
import EnhancedTable, { Column } from 'components/EnhancedTable/EnhancedTable';
import StatusChip from 'components/StatusChip/StatusChip';
import { INFT } from 'components/NFTGallery/NFTGallery';

const LoanListPage = () => {
	const { account, connector, library } = useWeb3React();
	const { hmy } = useHarmony();

	const [contract, setContract] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const [openLoans, setOpenLoans] = useState<ILoanRequest[] | null>(null);

	const [selectedLoan, setSelectedLoan] = useState<ILoanRequest | null>(null);
	const [userLoans, setUserLoans] = useState<ILoanRequest[] | null>(null);

	//FORM STATE
	const [transacting, setTransacting] = useState(false);

	const loadContract = useCallback(async () => {
		if (!account || !connector || !library) return;
		const contractObj = await getLoanContractFromConnector(connector, library);
		setContract(contractObj);
	}, [account, connector, library, setContract]);

	const loadLoans = useCallback(async () => {
		if (!contract || !account) return;
		setLoading(true);
		const loans = await getAllLoansFromContract(contract);
		const [a, b] = splitArray<ILoanRequest>(loans, loan => loan.status === '0');
		setOpenLoans(a);
		setUserLoans(b.filter(loan => loan.lender.toLowerCase() === account.toLowerCase()));
		setLoading(false);
	}, [contract, account]);

	const underwrite = useCallback(async () => {
		if (!contract || !selectedLoan) return;
		try {
			const id = parseInt(selectedLoan.loanID);
			const amt = parseInt(selectedLoan.loanAmount);
			const interest = parseInt(selectedLoan.interestAmount);
			const tx = await contract.methods
				.acceptLoanRequest(id)
				.send({ from: account, value: new Unit(amt - interest).asOne().toWei() });
			console.log(tx);
		} catch (err) {
			console.error(err);
		} finally {
			setSelectedLoan(null);
		}
	}, [selectedLoan, contract]);

	useEffect(() => {
		loadContract();
	}, [loadContract]);

	useEffect(() => {
		loadLoans();
	}, [loadLoans]);

	useEffect(() => {
		underwrite();
	}, [underwrite]);

	const columns: Column[] = [
		{
			accessor: 'loanID',
			label: 'ID',
		},
		{
			accessor: 'status',
			align: 'center',
			label: 'Status',
			format: props => <StatusChip code={parseInt(props.value)} />,
		},
		{
			accessor: 'loanAmount',
			label: 'Value',
			format: props => {
				const val = parseInt(props.value);
				const interest = parseInt(props.original.interestAmount);
				return (
					<Box>
						{val} ONE
						<Typography fontSize="0.75rem" color="darkgrey">
							{interest} ONE
						</Typography>
					</Box>
				);
			},
		},
		{
			accessor: 'singlePeriodTime',
			label: 'Duration',
			format: props => `${props.original.maximumInterestPeriods} x ${props.value} days`,
		},
		{
			accessor: 'endLoanTimeStamp',
			align: 'center',
			label: 'Due Date',
			format: props => {
				const val = parseInt(props.value);
				return val ? new Date(val).toDateString() : 'NA';
			},
		},
		{
			accessor: 'borrower',
			label: 'Lender',
			format: props => (
				<Typography fontSize="0.875rem" fontWeight="bold">
					{truncateString(props.value, 15)}
				</Typography>
			),
		},
		{
			accessor: 'tokenIdNFT',
			align: 'center',
			label: 'Collateralized Token',
			format: props => {
				const { hmy } = useHarmony();
				const contract = createNFTContract(hmy, props.original.smartContractAddressOfNFT);
				const [nft, setNFT] = useState<INFT | null>(null);
				const [loading, setLoading] = useState(true);
				const load = async () => {
					setLoading(true);
					setNFT(await getNFT(props.value, contract));
					setLoading(false);
				};
				useEffect(() => {
					load();
				}, []);
				return loading ? (
					<CircularProgress />
				) : (
					<Box
						sx={{
							'& img': {
								width: '3rem',
							},
						}}
						display="flex"
						alignItems="center"
						justifyContent="center"
					>
						<Box marginRight="1rem">
							<Typography>{`${nft?.symbol} #${props.value}`}</Typography>
							<Typography color="darkgrey" fontWeight="bold" fontSize="0.75rem">
								{nft?.name}
							</Typography>
						</Box>
						<img src={nft?.uri} />
					</Box>
				);
			},
		},
	];

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
					}}
				>
					Open Loan Requests
				</Typography>
				<IconButton onClick={loadLoans}>
					<MdRefresh />
				</IconButton>
			</Box>
			{loading && <LinearProgress />}
			{!loading &&
				(openLoans?.length ? (
					<Box
						display="grid"
						sx={{
							gridTemplateColumns: {
								xs: 'repeat(1, 1fr)',
								sm: 'repeat(2, 1fr)',
								md: 'repeat(3, 1fr)',
								lg: 'repeat(4, 1fr)',
								// xl: "repeat(6, 1fr)",
							},
							gap: 6,
						}}
						marginBottom="3rem"
					>
						{openLoans?.map(loan => {
							return (
								<LoanCard
									onClick={() => {
										setSelectedLoan(loan);
									}}
									key={loan.loanID}
									{...loan}
								/>
							);
						})}
					</Box>
				) : (
					<Box display="flex" alignItems="center" justifyContent="center" height="10rem" marginBottom="3rem">
						<Typography>There are no open loan requests at this moment</Typography>
					</Box>
				))}
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
					Lender Positions
				</Typography>
			</Box>
			<EnhancedTable rows={userLoans ?? []} columns={columns} loading={loading} />
		</>
	);
};

export default LoanListPage;
