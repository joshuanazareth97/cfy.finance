import { Box, Button, Typography } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';

const Homepage = (props: unknown) => {
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
					CFY
				</Typography>
			</Box>
		</Box>
	);
};

export default Homepage;
