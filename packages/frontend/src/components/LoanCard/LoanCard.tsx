import { Box, Button, Card, CardActions, CardContent, CardMedia, Typography } from '@mui/material';
import { ILoanRequest } from 'components/BorrowerDashboard/BorrowerDashboard';
import { INFT } from 'components/NFTGallery/NFTGallery';
import { useHarmony } from 'context/harmonyContext';
import { createNFTContract } from 'helpers/contractHelper';
import React, { useEffect, useState } from 'react';
import { ImClock } from 'react-icons/im';
import { MdAccountCircle } from 'react-icons/md';
import { getNFT, msToDays, sToDays, truncateString } from 'utils';

interface Props extends ILoanRequest {
	onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const LoanCard = (props: Props) => {
	const { hmy } = useHarmony();
	const contract = createNFTContract(hmy, props.smartContractAddressOfNFT);
	const [nft, setNFT] = useState<INFT | null>(null);
	const [loading, setLoading] = useState(true);
	const load = async () => {
		setLoading(true);
		setNFT(await getNFT(parseInt(props.tokenIdNFT), contract));
		setLoading(false);
	};
	useEffect(() => {
		load();
	}, []);

	return (
		<Card
			sx={{
				height: '100%',
				display: 'flex',
				flexDirection: 'column',
			}}
		>
			<CardMedia
				sx={{
					flexGrow: 1,
				}}
				component="img"
				src={nft?.uri}
			></CardMedia>
			<CardContent>
				<Typography
					textAlign="center"
					sx={{
						marginBottom: '0.5rem',
					}}
				>
					{nft?.name} #{nft?.id}
				</Typography>
				<Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="0.5rem">
					<Typography fontWeight="bold">{props.loanAmount} ONE</Typography>
					<Typography fontWeight="bold" fontSize="0.75rem" color="darkgray">
						{props.interestAmount} ONE
					</Typography>
				</Box>
				<Box display="flex" justifyContent="center" alignItems="center" marginBottom="1rem">
					<ImClock style={{ marginRight: '1rem' }} />
					<Typography fontWeight="bold" fontSize="0.75rem" color="darkgray">
						{sToDays(parseInt(props.singlePeriodTime))} days x {props.maximumInterestPeriods}
					</Typography>
				</Box>
				<Box display="flex" justifyContent="center" alignItems="center">
					<MdAccountCircle size="1.25rem" style={{ marginRight: '1rem' }} />
					<Typography fontWeight="bold" fontSize="0.75rem">
						{truncateString(props.borrower, 20)}
					</Typography>
				</Box>
			</CardContent>
			<CardActions
				sx={{
					display: 'flex',
					justifyContent: 'center',
				}}
			>
				<Button onClick={props.onClick}>Underwrite</Button>
			</CardActions>
		</Card>
	);
};

export default LoanCard;
