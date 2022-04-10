import { Chip } from '@mui/material';
import React, { useMemo } from 'react';

const StatusChip = ({ code }: { code: number }) => {
	const chip = useMemo(() => {
		switch (code) {
			case 0:
				return { label: 'Pending', color: '#f1c40f' };
			case 1:
				return { label: 'Active', color: '#2ecc71' };
			case 2:
				return { label: 'Cancelled', color: '#95a5a6' };
			case 3:
				return { label: 'Ended', color: '#f39c12' };
			case 4:
				return { label: 'Defaulted', color: '#e74c3c' };
			default:
				return { label: 'unknown', color: '#95a5a6' };
		}
	}, [code]);
	return (
		<Chip
			label={chip.label}
			sx={{
				backgroundColor: chip.color,
				'& .MuiChip-label': {
					fontWeight: 'bold',
					color: 'white',
				},
			}}
		/>
	);
};

export default StatusChip;
