import { useWeb3React } from '@web3-react/core';
import { useHarmony } from 'context/harmonyContext';
import {
	createLoanContract,
	createNFTContract,
	getLoanContractFromConnector,
	getNFTContractFromConnector,
} from 'helpers/contractHelper';
import React, { useCallback, useEffect, useState } from 'react';
import { getAllLoansFromContract, getUserNFTsFromContract } from 'utils';
// import { approveNFT, depositNFT, getUserNFTs } from 'utils';

const BorrowerDashboard = (props: unknown) => {
	const { account, connector, library } = useWeb3React();
	const { hmy } = useHarmony();

	const [contract, setContract] = useState<any>(createLoanContract(hmy));
	const [loading, setLoading] = useState(true);

	const loadContract = useCallback(async () => {
		if (!account || !connector || !library) return;
		setLoading(true);
		const contractObj = await getLoanContractFromConnector(connector, library);
		const tokens = await getAllLoansFromContract(contract, account);
		setContract(contractObj);
		setLoading(false);
	}, [setLoading, account, connector, library]);

	useEffect(() => {
		loadContract();
	}, [loadContract]);
	return <div>BorrowerDashboard</div>;
};

export default BorrowerDashboard;
