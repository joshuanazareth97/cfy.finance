import { Box, Button, Typography } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';

type Props = {};

const Homepage = (props: Props) => {
	return (
		<Box flexGrow={1} display="flex" alignItems="center">
			<Box
				display="flex"
				flexDirection="column"
				alignItems="stretch"
				justifyContent="center"
				sx={{
					padding: '3rem 0',
				}}
				flexBasis="50%"
			>
				<Typography
					fontWeight="bold"
					color="primary"
					variant="h2"
					sx={{
						marginBottom: '1rem',
					}}
				>
					LiquiNFT
				</Typography>
				<Typography
					variant="h5"
					sx={{
						marginBottom: '0.5rem',
					}}
				>
					A Zilliqa based NFT fractionalization platform.
				</Typography>
				<Typography
					fontSize="1rem"
					color="darkGrey"
					sx={{
						marginBottom: '2rem',
					}}
				>
					LiquiNFT contracts allow users to lock up their NFT in the LiquiNFT contract, which then creates a new
					fungible token representing fractional ownership of the NFT. <br />
					The requirement for redemption is simply that the user's balance of the fractional shares is exactly equal to
					the total supply of the fractional shares, at the time of redemption.{' '}
				</Typography>
				<Box
					sx={{
						display: 'grid',
						gridTemplateColumns: 'repeat(2, 1fr)',
						gap: 3,
					}}
				>
					<Button
						// onClick={async () => await zilPay.wallet.connect()}
						// href=""
						variant="contained"
						color="primary"
					>
						Get Started
					</Button>
					<Button href="https://github.com/FoundationCryptoLabs/LiquiNFT" variant="outlined" color="primary">
						Read the whitepaper
					</Button>
				</Box>
			</Box>
			<Box
				flexBasis="50%"
				display="flex"
				justifyContent="center"
				sx={{
					'& img': {
						width: '80%',
					},
				}}
			></Box>
		</Box>
	);
};

export default Homepage;
