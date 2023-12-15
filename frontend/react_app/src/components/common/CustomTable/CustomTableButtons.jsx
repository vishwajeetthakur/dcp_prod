import React, { useState } from 'react';
import { Button, ButtonGroup  } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import RefreshIcon from '@mui/icons-material/Refresh';
import MuiTooltip from '../forms/MuiTooltip';

const CustomTableButtons = ({
    tableButtons,
    customTableButtons,
    handleOpenCreate,
    editAndDeleteButtonDisabled,
    filteredButtonDisabled,
    handleOpenEdit,
    handleDelete,
    exportTable,
    removeFilter,
    openVisualizationsModal,
    fetchData
}) => {

    const [filterIcon, setFilterIcon] = useState(FilterAltIcon)

    return tableButtons && (
        <ButtonGroup>
            {(tableButtons?.includes('c'))  && <Button onClick={handleOpenCreate}> <MuiTooltip icon={AddIcon} title={"Create"} /></Button>}
            {(tableButtons?.includes('e')) && (
                <Button 
                    disabled={editAndDeleteButtonDisabled} 
                    onClick={handleOpenEdit} 
                >
                    <MuiTooltip icon={EditIcon} title={"Edit"} color={(editAndDeleteButtonDisabled) ? 'disabled' : 'gray'} />
                </Button>
            )}
            {(tableButtons?.includes('d')) && (
                <Button 
                    disabled={editAndDeleteButtonDisabled} 
                    onClick={handleDelete} 
                >
                    <MuiTooltip icon={DeleteIcon} title={"Delete"} color={(editAndDeleteButtonDisabled) ? 'disabled' : 'gray'} />
                </Button>
            )}
            {(tableButtons?.includes('x')) && <Button onClick={exportTable} ><MuiTooltip icon={DownloadIcon} title={"Export"} /></Button>}
            {(tableButtons?.includes('v')) && <Button onClick={openVisualizationsModal}><MuiTooltip icon={ShowChartIcon} title={"Visualizations"} /></Button>}
            {
                (tableButtons?.includes('f'))
                && <Button
                        disabled={filteredButtonDisabled}
                        onClick={removeFilter}
                        onMouseOver={() => { setFilterIcon(FilterAltOffIcon) }}
                        onMouseOut={() => { setFilterIcon(FilterAltIcon) }}
                    >
                        <MuiTooltip
                            title={"Remove Filters"}
                            icon={filterIcon}
                            color={(filteredButtonDisabled) ? 'disabled' : 'gray'}
                        />
                    </Button>
                    
            }
            {(tableButtons?.includes('r')) && <Button onClick={fetchData}><MuiTooltip icon={RefreshIcon} title={"Refresh Table"} /></Button>}
            {customTableButtons}
        </ButtonGroup>
    )
}

export default React.memo(CustomTableButtons)