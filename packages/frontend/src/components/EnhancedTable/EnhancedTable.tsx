import {
	Box,
	LinearProgress,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from '@mui/material';
import React from 'react';
import { MdWarning } from 'react-icons/md';
import { theme } from 'theme';

export interface Column {
	accessor: string;
	label: string;
	minWidth?: number;
	align?: 'right' | 'left' | 'center';
	format?: (value: any) => React.ReactNode;
}

type Props = {
	columns: Column[];
	rows: any[] | [];
	loading?: boolean;
	passToCell?: any;
};

const EnhancedTable = ({ columns, rows, loading, passToCell }: Props) => {
	return (
		<Paper sx={{ width: '100%', overflow: 'hidden', marginBottom: '2rem' }}>
			<TableContainer sx={{ maxHeight: 440 }}>
				<Table stickyHeader aria-label="sticky table">
					<TableHead>
						<TableRow>
							{columns.map((column, idx) => (
								<TableCell
									key={idx}
									align={column.align}
									style={{ minWidth: column.minWidth, fontWeight: 'bold', fontSize: '1rem' }}
								>
									{column.label}
								</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{rows.map((row, index) => {
							return (
								<TableRow hover role="checkbox" tabIndex={-1} key={index}>
									{columns.map((column, colIdx) => {
										const value = row[column.accessor];
										return (
											<TableCell key={colIdx} align={column.align}>
												{column.format
													? column.format({ value, original: row, rows, id: index, ...passToCell })
													: value}
											</TableCell>
										);
									})}
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
				{loading && <LinearProgress />}
				{!rows.length && !loading && (
					<Box display="flex" alignItems="center" flexDirection="column" padding="2rem">
						<MdWarning color={theme.palette.warning.main} size="3rem" />
						<Typography fontSize="1.5rem" fontWeight="bold">
							There is no data
						</Typography>
					</Box>
				)}
			</TableContainer>
		</Paper>
	);
};

export default EnhancedTable;
