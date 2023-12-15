// Packages
import {
    TableContainer,
    Table,
    TableBody,
    TableRow,
    TableCell
} from '@mui/material'

export const  BasicCategoryTable = ({
    data
}) => (
    <TableContainer >
        <Table size="small">
            <TableBody>
            {
                Object.entries(data)
                    .filter(([,val]) => typeof val == 'string')
                    .map(([key, val]) => (
                        <TableRow
                            key={key}
                            sx={{ 'td, th': { border: '1px solid rgba(33,33,33,0.2)' } }}
                        >
                            <TableCell sx={{ background: '#eee', fontWeight: 'bold' }}>{key}</TableCell>
                            <TableCell sx={{ whiteSpace: 'pre' }}>{val}</TableCell>
                        </TableRow>
                    ))
            }
            </TableBody>
        </Table>
    </TableContainer>
)
