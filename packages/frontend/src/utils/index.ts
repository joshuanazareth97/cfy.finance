import { ILoanRequest } from 'components/BorrowerDashboard/BorrowerDashboard';
import { INFT } from 'components/NFTGallery/NFTGallery';
import Contracts from 'contracts/contracts.json';
import { fromWei, Units } from '@harmony-js/utils';

export const getListFromFunction = async (func: any, limit: number) => {
	const final: any = [];
	for (let i = 0; i < limit; i++) {
		const res = await func(i)();
		final.push();
	}
	return final;
};

export const truncateString = (str: string, numChars?: number) => {
	if (!str) return '';
	if (numChars) {
		return `${str.slice(0, Math.floor(numChars / 2))}...${str.slice(-Math.ceil(numChars / 2))}`;
	} else {
		return `${str.slice(0, 5)}...${str.slice(-5)}`;
	}
};

export function splitArray<T>(arr: any[], predicate: (a0: T) => boolean) {
	const positive: T[] = [];
	const negative: T[] = [];
	for (let i = 0; i < arr.length; i++) {
		if (predicate(arr[i])) {
			positive.push(arr[i]);
		} else {
			negative.push(arr[i]);
		}
	}
	return [positive, negative];
}

export const getNFT = async (tokenId: number, nftContract: any) => {
	const approvedAddress = await nftContract.methods.getApproved(tokenId).call();
	const uri = await nftContract.methods.tokenURI(tokenId).call();
	const symbol = await nftContract.methods.symbol().call();
	const name = await nftContract.methods.name().call();
	return {
		id: tokenId,
		approvedAddress,
		approved: approvedAddress.toLowerCase() === Contracts.contracts.LoansNFT.address.toLowerCase(),
		uri,
		symbol,
		name,
	} as INFT;
};

export const getUserNFTsFromContract = async (nftContract: any, userAddress: string) => {
	const numTokens = decodeSmartContractResult(await nftContract.methods.balanceOf(userAddress).call());
	const symbol = await nftContract.methods.symbol().call();
	const name = await nftContract.methods.name().call();
	const tokens: INFT[] = [];
	for (let id = 0; id < numTokens; id++) {
		const res = await nftContract.methods.tokenOfOwnerByIndex(userAddress, id).call();
		const element = decodeSmartContractResult(res);
		const approvedAddress = await nftContract.methods.getApproved(element).call();
		const uri = await nftContract.methods.tokenURI(element).call();
		tokens.push({
			id: element,
			approvedAddress,
			approved: approvedAddress.toLowerCase() === Contracts.contracts.LoansNFT.address.toLowerCase(),
			uri,
			symbol,
			name,
		});
	}
	return tokens;
};

export const getAllLoansFromContract = async (contract: any) => {
	console.dir(contract);
	const numTokens = await contract.methods.totalLoanRequests().call();
	const tokens: ILoanRequest[] = [];
	for (let id = numTokens - 1; id >= 0; id--) {
		const res: ILoanRequest = await contract.methods.allLoanRequests(id).call();
		tokens.push({
			...res,
			loanAmount: fromWei(res.loanAmount, Units.one),
			interestAmount: fromWei(res.interestAmount, Units.one),
		});
	}
	return tokens;
};

export const decodeSmartContractResult = (res: any) => {
	return res.words?.[0] ?? '';
};

const S_PER_DAY = 86400;
export const daysToS = (days: number) => days * S_PER_DAY;
export const sToDays = (ms: number) => ms / S_PER_DAY;

const MS_PER_DAY = S_PER_DAY * 1000;
export const daysToMs = (days: number) => days * MS_PER_DAY;
export const msToDays = (ms: number) => ms / MS_PER_DAY;
