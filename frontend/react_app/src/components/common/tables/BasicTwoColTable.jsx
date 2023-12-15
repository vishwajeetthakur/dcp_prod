import React from 'react';
import { Typography, Table, TableRow, TableBody, TableContainer } from '@mui/material';

// Styles
import { StyledTableCell, } from './../styled.components'

export const BasicTwoColTable = ({ data, rows, headerColWidth = '25%' }) => (
    <TableContainer>
        <Table sx={{ height: '100%', width: '100%', border: 'theme.border', overflow: 'hidden' }} size="small">
            {data && (
                <TableBody>
                    {rows.map(({ label, value }) => (
                        <TableRow key={label + '-row'} sx={{ border: 'theme.border' }}>
                            <StyledTableCell sx={{ width: headerColWidth, backgroundColor: '#eee' }}>
                                {label}
                            </StyledTableCell>
                            <StyledTableCell>
                                <Typography variant="body1" component="p" children={value} sx={{ wordBreak: 'break-word' }} />
                            </StyledTableCell>
                        </TableRow>
                    ))}
                </TableBody>
            )}
        </Table>
    </TableContainer>
)