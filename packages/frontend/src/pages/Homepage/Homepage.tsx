import lenderImg from 'assets/images/lender.png';
import borrowerImg from 'assets/images/borrower.png';
import {
	Box,
	Button,
	Card,
	CardContent,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Paper,
	Typography,
} from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';
import { MdCheck } from 'react-icons/md';
import { theme } from 'theme';
import { ImCheckmark } from 'react-icons/im';

const Homepage = (props: unknown) => {
	return (
		<Box flexGrow={1} display="flex" flexDirection="column" justifyContent="center" alignItems="stretch">
			<Box
				display="flex"
				flexDirection="column"
				alignItems="center"
				alignSelf="center"
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
						marginBottom: '2rem',
					}}
				>
					Hassle free, NFT - collateralized loans
				</Typography>
				<Typography
					color="black"
					fontWeight="bold"
					variant="h6"
					sx={{
						marginBottom: '2rem',
					}}
				>
					Access liquidity using any HRC721 NFT without giving up ownership.
				</Typography>
				<Button
					component="a"
					href="https://github.com/FoundationCryptoLabs/CFY/tree/updated1/docs"
					target="_blank"
					sx={{
						marginBottom: '4rem',
					}}
					variant="contained"
				>
					Read the documentation
				</Button>
			</Box>

			<Box
				display="flex"
				alignItems="center"
				justifyContent="space-between"
				marginBottom="5rem"
				sx={{
					'& img': {
						width: '30%',
					},
				}}
			>
				<Box
					display="flex"
					flexDirection="column"
					alignItems="stretch"
					justifyContent="center"
					sx={{
						padding: '3rem 0',
					}}
				>
					<Typography
						fontWeight="bold"
						color="#266DD3"
						variant="h4"
						sx={{
							marginBottom: '1rem',
						}}
					>
						Borrowers
					</Typography>
					<List>
						<ListItem>
							<ListItemIcon>
								<ImCheckmark color={theme.palette.primary.main} />
							</ListItemIcon>
							<ListItemText
								primaryTypographyProps={{
									fontWeight: 'bold',
									color: 'gray',
								}}
							>
								Lock up any HRC721 token as collateral for a loan request under the 'Borrow' tab.
							</ListItemText>
						</ListItem>
						<ListItem>
							<ListItemIcon>
								<ImCheckmark color={theme.palette.primary.main} />
							</ListItemIcon>
							<ListItemText
								primaryTypographyProps={{
									fontWeight: 'bold',
									color: 'gray',
								}}
							>
								Setup loan request parameters, including loan amount, interest amount, and maximum interest periods
							</ListItemText>
						</ListItem>
						<ListItem>
							<ListItemIcon>
								<ImCheckmark color={theme.palette.primary.main} />
							</ListItemIcon>
							<ListItemText
								primaryTypographyProps={{
									fontWeight: 'bold',
									color: 'gray',
								}}
							>
								Any lender can underwrite your loan request after reviewing the terms
							</ListItemText>
						</ListItem>
						<ListItem>
							<ListItemIcon>
								<ImCheckmark color={theme.palette.primary.main} />
							</ListItemIcon>
							<ListItemText
								primaryTypographyProps={{
									fontWeight: 'bold',
									color: 'gray',
								}}
							>
								After loan is funded, you can extend the loan period upto the maximum interest periods
							</ListItemText>
						</ListItem>
						<ListItem>
							<ListItemIcon>
								<ImCheckmark color={theme.palette.primary.main} />
							</ListItemIcon>
							<ListItemText
								primaryTypographyProps={{
									fontWeight: 'bold',
									color: 'gray',
								}}
							>
								Upon repayment of the loan with interest within the time specified, the LoansNFT.sol contract releases
								your NFT back to you
							</ListItemText>
						</ListItem>
						<ListItem>
							<ListItemIcon>
								<ImCheckmark color={theme.palette.primary.main} />
							</ListItemIcon>
							<ListItemText
								primaryTypographyProps={{
									fontWeight: 'bold',
									color: 'gray',
								}}
							>
								If you fail to repay the loan within the promised time, the NFT collateral is transferred to the
								creditor
							</ListItemText>
						</ListItem>
					</List>
				</Box>
				<img src={borrowerImg} alt="borrowers" />
			</Box>

			<Box
				display="flex"
				flexDirection="row-reverse"
				alignItems="center"
				justifyContent="space-between"
				sx={{
					'& img': {
						width: '30%',
					},
				}}
				marginBottom="2rem"
			>
				<Box
					display="flex"
					flexDirection="column"
					alignItems="stretch"
					justifyContent="center"
					sx={{
						padding: '3rem 0',
					}}
				>
					<Typography
						fontWeight="bold"
						color="#FF6B6C"
						variant="h4"
						sx={{
							marginBottom: '1rem',
						}}
					>
						Lenders
					</Typography>
					<List>
						<ListItem>
							<ListItemIcon>
								<ImCheckmark color={theme.palette.primary.main} />
							</ListItemIcon>
							<ListItemText
								primaryTypographyProps={{
									fontWeight: 'bold',
									color: 'gray',
								}}
							>
								Go to lending page, to review currently open loan requests.
							</ListItemText>
						</ListItem>
						<ListItem>
							<ListItemIcon>
								<ImCheckmark color={theme.palette.primary.main} />
							</ListItemIcon>
							<ListItemText
								primaryTypographyProps={{
									fontWeight: 'bold',
									color: 'gray',
								}}
							>
								Evaluate the terms of each P2P loan. Consider weather you would be willing to accept the collateral NFT
								offered by the user, in case they default on the loan.
							</ListItemText>
						</ListItem>
						<ListItem>
							<ListItemIcon>
								<ImCheckmark color={theme.palette.primary.main} />
							</ListItemIcon>
							<ListItemText
								primaryTypographyProps={{
									fontWeight: 'bold',
									color: 'gray',
								}}
							>
								When you find a request with terms that you like, click on 'underwrite loan'. You will be asked to pay
								the loan amount, which will be transferred to the borrower. The NFT will be held in escrow until the
								loan is repaid.
							</ListItemText>
						</ListItem>
						<ListItem>
							<ListItemIcon>
								<ImCheckmark color={theme.palette.primary.main} />
							</ListItemIcon>
							<ListItemText
								primaryTypographyProps={{
									fontWeight: 'bold',
									color: 'gray',
								}}
							>
								Whenever the borrower repays the loan, the loan + interest amount will be directly transferred to your
								wallet. No further steps needed on your part!
							</ListItemText>
						</ListItem>
						<ListItem>
							<ListItemIcon>
								<ImCheckmark color={theme.palette.primary.main} />
							</ListItemIcon>
							<ListItemText
								primaryTypographyProps={{
									fontWeight: 'bold',
									color: 'gray',
								}}
							>
								In case the loan term has expired but the borrower has not repaid it, you can foreclose the loan and
								claim the collateral NFT.
							</ListItemText>
						</ListItem>
					</List>
				</Box>
				<img src={lenderImg} alt="lenders" />
			</Box>
		</Box>
		// </Box>
	);
};

export default Homepage;
