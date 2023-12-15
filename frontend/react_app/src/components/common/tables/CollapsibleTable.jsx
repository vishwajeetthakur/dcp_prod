import React, { useRef } from 'react';
import Box from '@mui/material/Box';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { StyledDataGrid, StyledTableCell } from '../styled.components';
import CustomTableButtons from './CustomTableButtons';
import { DataGridPro } from '@mui/x-data-grid-pro';


export default function CollapsibleTable(props) {
  const topLevelDataGridRef = useRef()
  const nestedDataGridRef = useRef()

  console.log('Top level DataGrid: ', topLevelDataGridRef, props)

  return (
    <TableContainer component={Paper}>
      <CustomTableButtons
        aria-label="custom-table-buttons"
        tableButtons={'cedxf'}
        // handleOpenCreate={handleOpenCreate}
        // editAndDeleteButtonDisabled={editAndDeleteButtonDisabled}
        // filteredButtonDisabled={filteredButtonDisabled}
        // removeFilter={removeFilter}
        // exportTable={exportTable}
        // handleOpenEdit={() => handleOpenEdit(tableState)}
        // handleDelete={handleDelete}
        // openVisualizationsModal={() => dispatch(actions.handleMenu({ key: 'visualization-modal', value: true }))}
      />
      <Box sx={{ height: 800, width: '100%' }}>
        {/* <DataGridPro
          density="compact"
          columns={[
            { field: 'name', headerName: 'Product', flex: 1 },
            {
              field: 'quantity',
              headerName: 'Quantity',
              align: 'center',
              type: 'number',
            },
            { field: 'unitPrice', headerName: 'Unit Price', type: 'number' },
            {
              field: 'total',
              headerName: 'Total',
              type: 'number',
              valueGetter: ({ row }) => row.quantity * row.unitPrice,
            },
          ]}
          rows={[]}
          sx={{ flex: 1 }}
          hideFooter
        /> */}
        <DataGridPro
          apiRef={topLevelDataGridRef}
          rows={props.rows}
          columns={props.nestedColumns}
          // initialState={{
          //   pagination: {
          //     paginationModel: {
          //       pageSize: 5,
          //     },
          //   },
          // }}
          // pageSizeOptions={[5]}
          checkboxSelection
          getDetailPanelContent={({ row }) => (
            <Box sx={{ height: 300, width: '100%' }}>
              <CustomTableButtons
                aria-label="custom-table-buttons"
                tableButtons={'cedxf'}
                // handleOpenCreate={handleOpenCreate}
                // editAndDeleteButtonDisabled={editAndDeleteButtonDisabled}
                // filteredButtonDisabled={filteredButtonDisabled}
                // removeFilter={removeFilter}
                // exportTable={exportTable}
                // handleOpenEdit={() => handleOpenEdit(tableState)}
                // handleDelete={handleDelete}
                // openVisualizationsModal={() => dispatch(actions.handleMenu({ key: 'visualization-modal', value: true }))}
              />
                <StyledDataGrid
                  apiRef={nestedDataGridRef}
                  rows={props.rows}
                  columns={props.nestedColumns}
                  initialState={{
                    pagination: {
                      paginationModel: {
                        pageSize: 5,
                      },
                    },

                  }}
                  pageSizeOptions={[5]}
                  checkboxSelection
                  disableRowSelectionOnClick
                />
              </Box>
          )}
          getDetailPanelHeight={({ row }) => 'auto'} // Height based on the content.
          // disableRowSelectionOnClick
          // slots={{
          //   row: () => {
              // <Box sx={{ height: 300, width: '100%' }}>
              //   <StyledDataGrid
              //     apiRef={nestedDataGridRef}
              //     rows={props.rows}
              //     columns={props.nestedColumns}
              //     initialState={{
              //       pagination: {
              //         paginationModel: {
              //           pageSize: 5,
              //         },
              //       },

              //     }}
              //     pageSizeOptions={[5]}
              //     checkboxSelection
              //     disableRowSelectionOnClick
              //   />
              // </Box>
          // }}}
        />
      </Box>
    </TableContainer>
  );
}