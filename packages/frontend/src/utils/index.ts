import { INFT } from 'components/NFTGallery/NFTGallery';
import Contracts from 'contracts/contracts.json';

export const getListFromFunction = async (func: any, limit: number) => {
	const final: any = [];
	for (let i = 0; i < limit; i++) {
		const res = await func(i)();
		console.log('here', res);
		final.push();
	}
	return final;
};

export const truncateString = (str: string) => {
	if (!str) return;
	return `${str.slice(0, 5)}...${str.slice(-5)}`;
};

export const getUserNFTsFromContract = async (nftContract: any, userAddress: string) => {
	const numTokens = decodeSmartContractResult(await nftContract.methods.balanceOf(userAddress).call());
	const listIndexes = (idx: number) => {
		return;
	};
	const tokens: INFT[] = [];
	for (let id = 0; id < numTokens; id++) {
		const res = await nftContract.methods.tokenOfOwnerByIndex(userAddress, id).call();
		const element = decodeSmartContractResult(res);
		const approvedAddress = await nftContract.methods.getApproved(element).call();
		const uri = await nftContract.methods.tokenURI(element).call();
		tokens.push({
			id,
			approvedAddress,
			approved: approvedAddress.toLowerCase() === Contracts.contracts.LoansNFT.address.toLowerCase(),
			uri,
		});
	}
	return tokens;
};

export const getAllLoansFromContract = async (contract: any, userAddress: string) => {
	// const numTokens = decodeSmartContractResult(await nftContract.methods.balanceOf(userAddress).call());
	const numTokens = await contract.methods.allLoanRequests(1).call();
	// console.log(numTokens);
};

export const decodeSmartContractResult = (res: any) => {
	return res.words?.[0] ?? '';
};
