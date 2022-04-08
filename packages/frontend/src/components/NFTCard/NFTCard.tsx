import { Box, CardActionArea, CardActionsProps, Typography } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import React from 'react';
import { MdApproval, MdMail } from 'react-icons/md';
import { theme } from 'theme';

type Props = {
	uri: string;
	primaryText?: React.ReactNode;
	secondaryText?: React.ReactNode;
	onClick?: React.MouseEventHandler<HTMLButtonElement>;
	disabled?: boolean;
};

const NFTCard = ({ secondaryText, uri, primaryText, onClick, disabled }: Props) => {
	return (
		<Card raised sx={{ maxWidth: 345 }}>
			<CardActionArea
				onClick={disabled ? undefined : onClick}
				sx={{
					height: '100%',
					display: 'flex',
					flexDirection: 'column',
				}}
			>
				<CardMedia
					component="img"
					sx={{
						flexGrow: 1,
					}}
					//   height="140"
					image={uri}
					alt={`Fractionalised Token ${uri}`}
				/>
				<CardContent>
					{primaryText}
					{secondaryText}
				</CardContent>
			</CardActionArea>
		</Card>
	);
};

export default NFTCard;
