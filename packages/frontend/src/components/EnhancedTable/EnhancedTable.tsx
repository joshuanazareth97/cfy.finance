import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import React from 'react';

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
};

const EnhancedTable = ({ columns, rows }: Props) => {
	return (
		<Paper sx={{ width: '100%', overflow: 'hidden' }}>
			<TableContainer sx={{ maxHeight: 440 }}>
				<Table stickyHeader aria-label="sticky table">
					<TableHead>
						<TableRow>
							{columns.map((column, idx) => (
								<TableCell key={idx} align={column.align} style={{ minWidth: column.minWidth }}>
									{column.label}
								</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{rows.map(row => {
							return (
								<TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
									{columns.map(column => {
										const value = row[column.accessor];
										return (
											<TableCell key={column.accessor} align={column.align}>
												{column.format ? (
													typeof value === 'string' ? (
														<Typography>{column.format(value)}</Typography>
													) : (
														column.format(value)
													)
												) : (
													value
												)}
											</TableCell>
										);
									})}
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</TableContainer>
		</Paper>
	);
};

export default EnhancedTable;
