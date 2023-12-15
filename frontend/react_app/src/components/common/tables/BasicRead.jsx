// Packages
import React, { useState } from 'react';
import {
  Paper, Table, TableBody, TableContainer,
  TableHead, TableRow, TextField, Typography
} from '@mui/material'
import PropTypes from 'prop-types'

// Styles
import {
  StyledTableCell,
  StyledTableRow,
} from '../styled.components'


export const BasicRead = ({ title = '', columns = [], rows = [], size }) => (
  <TableContainer mt={3}>
    {title && <Typography variant="h5" p={2} children={title.replace('_', ' ')} />}
    <Table aria-label="simple table" size={size}>
      <TableHead>
        <StyledTableRow>
          {columns.map(({ header }) => <StyledTableCell key={header} align="left">{header}</StyledTableCell>)}
        </StyledTableRow>
      </TableHead>
      <TableBody>
        {!rows.length ? (
          <StyledTableRow>
            <StyledTableCell align="center">No Data Available</StyledTableCell>
          </StyledTableRow>
        ) : rows.map((row, i) => (
          <StyledTableRow key={i}>
            {columns.map(({ key }, i) => <StyledTableCell key={i} align="left">{row[key]}</StyledTableCell>)}
          </StyledTableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
)

export const VerticalTwoColumn = ({ title, columns, rows }) => {
  const [fields, setFields] = useState({})

  const handleChange = (e, key) => setFields(prev => ({ ...prev, [key]: e.target.value }))

  return (
    <TableContainer component={Paper} mt={3}>
      {title && <Typography variant="h5" p={2} children={title.replace('_', ' ')} />}
      <Table aria-label="simple table" size="small">
        <TableBody>
          {!rows.length ? (
            <StyledTableRow>
              <StyledTableCell align="center">No Data Available</StyledTableCell>
            </StyledTableRow>
          ) : rows.map(row => columns.map(({ key, header }, i) => (
            <StyledTableRow key={i}>
              <StyledTableCell align="left">{header}</StyledTableCell>
              <StyledTableCell component={TextField} value={fields[row[key]] || row[key]} align="left" onChange={e => handleChange(e, row[key])} />
            </StyledTableRow>
          )))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

BasicRead.propTypes = {
  title: PropTypes.string,
  columns: PropTypes.array.isRequired,
  rows: PropTypes.array.isRequired,
  size: PropTypes.string,
}