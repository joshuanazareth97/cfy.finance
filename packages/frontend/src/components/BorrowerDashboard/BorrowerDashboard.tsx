import { Unit } from '@harmony-js/utils';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import EnhancedTable, { Column } from 'components/EnhancedTable/EnhancedTable';
import { INFT } from 'components/NFTGallery/NFTGallery';
import StatusChip from 'components/StatusChip/StatusChip';
import { useHarmony } from 'context/harmonyContext';
import { createLoanContract, createNFTContract, getLoanContractFromConnector } from 'helpers/contractHelper';
import React, { useCallback, useEffect, useState } from 'react';
import { MdAdd, MdArrowRightAlt, MdCancel } from 'react-icons/md';
import { getAllLoansFromContract, getNFT, truncateString } from 'utils';
// import { approveNFT, depositNFT, getUserNFTs } from 'utils';

export interface ILoanRequest {
	loanID: string;
	lender: string;
	borrower: string;
	smartContractAddressOfNFT: string;
	tokenIdNFT: string;
	loanAmount: string;
	interestAmount: string;
	singlePeriodTime: string;
	maximumInterestPeriods: string;
	endLoanTimeStamp: string;
	status: string;
}

const BorrowerDashboard = (props: unknown) => {
	const { account, connector, library } = useWeb3React();
	const { hmy } = useHarmony();

	const [contract, setContract] = useState<any>(createLoanContract(hmy));
	const [rows, setRows] = useState<ILoanRequest[]>([]);
	const [loading, setLoading] = useState(true);

	const loadContract = useCallback(async () => {
		if (!account || !connector || !library) return;
		setLoading(true);
		const contractObj = await getLoanContractFromConnector(connector, library);
		const tokens = await getAllLoansFromContract(contract);
		setRows(tokens.filter(token => token.borrower.toLowerCase() === account.toLowerCase()));
		setContract(contractObj);
		setLoading(false);
	}, [setLoading, account, connector, library]);

	useEffect(() => {
		loadContract();
	}, [loadContract]);

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
				console.log(val);
				return val ? new Date(val * 1000).toDateString() : 'NA';
			},
		},
		{
			accessor: 'lender',
			label: 'Lender',
			format: props => (
				<Typography fontSize="0.875rem" fontWeight="bold">
					{truncateString(props.value)}
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
		{
			accessor: 'loanID',
			label: 'Actions',
			align: 'center',
			format: props => {
				const { account, connector, library } = useWeb3React();

				const [contract, setContract] = useState<any>(null);
				const [loading, setLoading] = useState(false);

				const loadContract = useCallback(async () => {
					if (!account || !connector || !library) return;
					const contractObj = await getLoanContractFromConnector(connector, library);
					setContract(contractObj);
				}, [account, connector, library, setContract]);
				useEffect(() => {
					loadContract();
				}, [loadContract]);

				const cancel = useCallback(async () => {
					if (!contract || !account) return;
					setLoading(true);
					const id = parseInt(props.value);
					const tx = await contract.methods.cancelLoanRequest(id).send({ from: account });
					console.log(tx);
					setLoading(false);
					props.loadContract();
				}, [contract, account, props.loadContract]);

				const extend = useCallback(async () => {
					if (!contract || !account) return;
					try {
						setLoading(true);
						const id = parseInt(props.value);
						const interest = parseInt(props.original.interestAmount);
						const tx = await contract.methods
							.extendLoanRequest(id)
							.send({ from: account, value: new Unit(interest).asOne().toWei() });
						console.log(tx);
					} catch (err) {
						setLoading(false);
					} finally {
						setLoading(false);
						props.loadContract();
					}
				}, [contract, account, props.loadContract]);

				const repay = useCallback(async () => {
					if (!contract || !account) return;
					try {
						setLoading(true);
						const id = parseInt(props.value);
						const amt = parseFloat(props.original.loanAmount);
						const tx = await contract.methods
							.endLoanRequest(id)
							.send({ from: account, value: new Unit(amt).asOne().toWei() });
						console.log(tx);
						setLoading(false);
					} catch (err) {
						console.log(err);
					} finally {
						setLoading(false);
						props.loadContract();
					}
				}, [contract, account, props.loadContract]);

				if (loading) {
					return <CircularProgress />;
				} else if (props.original.status === '0') {
					return (
						<Button onClick={cancel} color="warning" startIcon={<MdCancel />}>
							Cancel
						</Button>
					);
				} else if (props.original.status === '1') {
					return (
						<Box>
							<Button
								disabled={parseInt(props.original.maximumInterestPeriods) <= 0}
								onClick={extend}
								color="warning"
								startIcon={<MdAdd />}
							>
								Extend
							</Button>
							<Button onClick={repay} startIcon={<MdArrowRightAlt />}>
								Repay
							</Button>
						</Box>
					);
				}
			},
		},
	];

	return <EnhancedTable rows={rows} columns={columns} loading={loading} passToCell={{ loadContract }} />;
};

export default BorrowerDashboard;
