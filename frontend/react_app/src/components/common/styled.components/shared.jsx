// License
import { LicenseInfo } from '@mui/x-license-pro'
// Packages
import { 
  Box, Button, Paper, TextField, TableCell, TableRow, FormControl,
} from '@mui/material';
import { colors } from '@mui/material';
import { alpha, styled } from '@mui/material/styles'
import { tableCellClasses } from '@mui/material/TableCell'
import { DataGridPro } from '@mui/x-data-grid-pro'

const muiKey = 'ed688e7cd31992d06366758194e2115dTz00NjY1OSxFPTE2ODgzMDc1NTM5MTYsUz1wcm8sTE09c3Vic2NyaXB0aW9uLEtWPTI='

LicenseInfo.setLicenseKey(muiKey)

// theme.spacing(1) === '8px'
// theme.spacing(2) === '16px' ... etc...

// all other theme props can be found in ./themes/themeConfig

  
// Shared
export const OuterContentPaper = styled(Paper)(({ theme }) => ({
  border: theme.border.main,
  textAlign: 'center',
  margin: theme.spacing(1)
}))

export const InnerContentPaper = styled(Paper)(({ theme }) => ({
  border: theme.border.main,
  textAlign: 'center',
  margin: theme.spacing(5),
}))


export const LargerInnerContentPaper = styled(Paper)(({ theme }) => ({
  border: theme.border.main,
  textAlign: 'center',
  margin: theme.spacing(1.3),
}))

export const PrimaryTitleBox = styled(Box)(({ theme, color = true }) => ({
  borderRadius: theme.spacing(1), 
  borderBottomLeftRadius: 0, 
  borderBottomRightRadius: 0,  
  backgroundColor: color ? theme.palette.primary.titleBox : theme.palette.primary, 
  color: theme.palette.mode === 'dark' ?
    theme.palette.common.white :
    color ?
      theme.palette.common.white :
      theme.palette.primary.main,
  padding: theme.spacing(2)
}))

export const SecondaryTitleBox = styled(Box)(({ theme }) => ({
  borderRadius: theme.spacing(1), 
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
  backgroundColor: theme.palette.secondary.titleBox, 
  color: theme.palette.common.white,
  padding: theme.spacing(2)
}))

export const LeftFormAction = styled(TextField)(() => ({ 
  boxShadow: 'none',
  '& .MuiOutlinedInput-root': { 
    borderBottomRightRadius: 0, 
    borderTopRightRadius: 0,
  }
}))

export const MiddleFormAction = styled(TextField)(() => ({
  '& .MuiOutlinedInput-root': { 
    borderRadius: 0
  },
}))

export const MiddleFormControl = styled(FormControl)(() => ({
  '& .MuiOutlinedInput-root': { 
    borderRadius: 0
  },
}))

export const RightFormAction = styled(Button)(() => ({
  height: '100%',
  borderBottomLeftRadius: 0,
  borderTopLeftRadius: 0
}))

export const LeftButtonBox = styled(Box)(({ theme }) => ({ 
  cursor: 'pointer',
  textAlign: 'center',
  width: '30%',
  height: '100%',
  border: 'rgba(33, 33, 33, 0.1) solid 1px',
  borderTopLeftRadius: theme.shape.borderRadius,
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.45),
    color: theme.palette.mode === 'dark' && '#fff',
  },
}))

export const LeftButton = styled(Button)(({ theme }) => ({ 
  borderRadius: 0, 
  borderBottomLeftRadius: theme.shape.borderRadius, 
  borderTopLeftRadius: theme.shape.borderRadius
}))

export const RightButton = styled(Button)(({ theme }) => ({
  borderRadius: 0,
  borderBottomRightRadius: theme.shape.borderRadius,
  borderTopRightRadius: theme.shape.borderRadius
}))

export const LookupField = styled(TextField)(({ theme }) => ({
  height: '100%',
  width: '40%',
  '& .MuiOutlinedInput-root': {
    height: '100%',
    borderRadius: 0,
    borderTopRightRadius: theme.shape.borderRadius
  }
}))

export const ResultsBox = styled(Box)(({ theme }) => ({
  margin: 'auto',
  padding: theme.spacing(2)
}))

export const TopFormBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3), 
  marginBottom: theme.spacing(6),
}))

export const TitleBox = styled(Box)(({ theme }) => ({
  borderRadius: theme.spacing(1.5), 
  borderBottomLeftRadius: 0, 
  borderBottomRightRadius: 0, 
  backgroundColor: theme.palette.primary.titleBox, 
  color: theme.palette.common.white,
  padding: theme.spacing(2)
}))

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
  borderTop: theme.palette.mode === 'dark'
    ? '1px solid rgba(255, 255, 255, 0.2)'
    : '1px solid rgba(0, 0, 0, 0.2)',
  borderBottom: theme.palette.mode === 'dark'
    ? '1px solid rgba(255, 255, 255, 0.2)'
    : '1px solid rgba(0, 0, 0, 0.2)', 
  '&:last-child td, &:last-child th': { 
    borderBottom: theme.palette.mode === 'dark'
      ? '1px solid rgba(255, 255, 255, 0.2)'
      : '1px solid rgba(0, 0, 0, 0.2)', 
  },
  // '& :hover': { backgroundColor: 'rgba(100,100,100, 0.2)'},
}))

export const StyledLabelCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    fontSize: 14,
    border: theme.border.main,
    borderRight: theme.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.2)' : 0, 
    // '&:last-child td, &:last-child th': { 
    //   border: 0 
    // }
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    border: theme.border.main,
    borderRight: theme.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.2)' : 0, 
    backgroundColor: theme.palette.mode === 'light' ? '#eee ' : '#333',
    color: theme.palette.mode === 'light' ? '#333' : '#eee',
    width: '25%',
    // '&:last-child td, &:last-child th': { 
    //   border: 0 
    // }
  },
}));

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    fontSize: 14,
    border: theme.border.main,
    '&:last-child td, &:last-child th': { 
      border: 0 
    }
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    border: theme.border.main,
    '&:last-child td, &:last-child th': { 
      // border: 0 
    }
  },
}));

export const StyledDataGrid = styled(DataGridPro)(({ theme }) => ({
  border: theme.border.main,
  '& .MuiDataGrid-columnHeaders': {
      borderBottom: theme.border.main,
  },
  '& .MuiDataGrid-columnHeader, .MuiDataGrid-cell': {
      borderRight: theme.border.main,
  },
  '& .MuiDataGrid-columnsContainer, .MuiDataGrid-cell': {
      borderBottom: theme.border.main,
  },
  '& .MuiDataGrid-cell': {
      color: theme.border.main,
  },
  '& .MuiPaginationItem-root': {
      borderRadius: 0,
  },
  '& .MuiDataGrid-root, .MuiDataGrid-iconSeparator': {
    color: alpha(colors.grey[100], 0.4)
  },
  '& .MuiDataGrid-footerContainer': {
      borderTop: theme.border.main,
  },
}));

// Gander
export const NotesBox = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',
  cursor: 'pointer',
  color: 'rgba(33, 33, 33, 0.6)',
  '&:hover': {
    color: 'rgba(33, 33, 33, 0.9)'
  }
}))

export const StyledSpan = styled('span')(({ theme }) => ({
  fontWeight: 700, 
  color: theme.palette.error.text,
}))