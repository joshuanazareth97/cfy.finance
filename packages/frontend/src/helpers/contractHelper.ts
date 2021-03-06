import { Harmony, HarmonyExtension } from '@harmony-js/core';
import { HarmonyAbstractConnector } from '@harmony-react/abstract-connector';
import { Contract as HarmonyContract } from '@harmony-js/contract';
import { AbstractConnector } from '@web3-react/abstract-connector';
import { getExtension } from './harmonyHelpers';
import Web3 from 'web3';
import Contracts from '../contracts/contracts.json';

export const createLoanContract = (hmy: Harmony | HarmonyExtension): HarmonyContract => {
	return hmy.contracts.createContract(Contracts.contracts.LoansNFT.abi, Contracts.contracts.LoansNFT.address);
};

export const getLoanContractFromConnector = async (connector: AbstractConnector, web3Provider: any): Promise<any> => {
	const harmonyConnector = connector as HarmonyAbstractConnector;
	if (harmonyConnector.windowKey) {
		const extensionWallet: any = window[harmonyConnector.windowKey];
		const hmyExtension = getExtension(extensionWallet);
		return new Promise(resolve => resolve(createLoanContract(hmyExtension)));
	}
	// Connector is injected connector NOTE: METAMASK
	await web3Provider.provider.request({ method: 'eth_requestAccounts' });
	const web3 = new Web3(web3Provider.provider);
	const web3Contract = new web3.eth.Contract(
		Contracts.contracts.LoansNFT.abi as any,
		Contracts.contracts.LoansNFT.address,
	);
	return web3Contract;
};

export const createNFTContract = (hmy: Harmony | HarmonyExtension, nftAddress: string) => {
	return hmy.contracts.createContract(Contracts.contracts.NFT.abi, nftAddress);
};

export const getNFTContractFromConnector = async (
	connector: AbstractConnector,
	web3Provider: any,
	nftAddress: string,
): Promise<any> => {
	const harmonyConnector = connector as HarmonyAbstractConnector;
	if (harmonyConnector.windowKey) {
		const extensionWallet: any = window[harmonyConnector.windowKey];
		const hmyExtension = getExtension(extensionWallet);
		return new Promise(resolve => resolve(createNFTContract(hmyExtension, nftAddress)));
	}
	// Connector is injected connector NOTE: METAMASK
	await web3Provider.provider.request({ method: 'eth_requestAccounts' });
	const web3 = new Web3(web3Provider.provider);
	const web3Contract = new web3.eth.Contract(Contracts.contracts.NFT.abi as any, nftAddress);
	return web3Contract;
};
