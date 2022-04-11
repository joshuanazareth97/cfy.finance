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
				alignItems="stretch"
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
						marginBottom: '1rem',
					}}
				>
					Instant, hassle-free loans
				</Typography>
				<Typography
					textAlign="center"
					color="black"
					fontWeight="bold"
					variant="h6"
					sx={{
						marginBottom: '1rem',
					}}
				>
					Access liquidity without giving up NFT ownership.
				</Typography>
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
								Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam, eveniet.
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
								Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam, eveniet.
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
								Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam, eveniet.
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
								Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam, eveniet.
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
								Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam, eveniet.
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
								Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam, eveniet.
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
