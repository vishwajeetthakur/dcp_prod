// Packages
import React from 'react';
import { 
  Avatar, Box, Card, CardContent, 
  Container, Grid, Paper,
  Table, TableBody, TableRow, Typography 
} from '@mui/material';

// Components

// Hooks
import { useKeycloakUser } from '../../hooks';

// Utils

// Styles
import {
  StyledLabelCell,
  StyledTableCell,
} from '../../common/styled.components';
import './Profile.scss';


const Profile = () => {
  // ==============================================
  // Hooks
  // ==============================================
  const { keycloakUser } = useKeycloakUser()

  // =============================================
  // State/Refs
  // =============================================

  // =============================================
  // Helpers (Memo, CB, vars)
  // =============================================
  const formatDate = date => new Date(date).toLocaleString('en-US', {
    weekday: 'short',
    day: 'numeric',
    year: 'numeric',
    month: 'long',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  })

  const { azp, name, data: { email,  id, username, last_login, manager, }} = keycloakUser
  
  const profileFields = [
    { id: 'eset_id', label: 'ESET ID', value: id },
    { id: 'username', label: 'Username', value: email },
    { id: 'pid', label: 'PID', value: username },
    { id: 'title', label: 'Title', value: '' },
    { id: 'eset_role', label: 'Role', value: '' },
    { id: 'dept', label: 'Department', value: azp },
    { id: 'manager_pid', label: 'Manager', value: manager },
    { id: 'last_login', label: 'Last Login', value: formatDate(last_login) },
  ]

  // =============================================
  // Interaction Handlers
  // =============================================

  // =============================================
  // Render Methods
  // =============================================

  // =============================================
  // Effects
  // =============================================

  // =============================================
  // Return
  // =============================================
  return (
    <Container className="profile">
      <Grid container>
        <Grid item sm={12} md={12}>
          <Card component={Paper} elevation={14}>
            <Box sx={{ px: 4, pt: 2, width: '100%', display: 'flex' }}>
              <Avatar children={name.slice(0, 1)} px={2} />
              <Typography variant="h5" px={4} children={name}/>
            </Box>
            <CardContent>
              <Table sx={{ height: '100%', width: '100%', borderRadius: 'theme.borderRadius' }} size="small">
                {keycloakUser && (
                  <TableBody>
                    {profileFields.map(({ label, value }) => (
                      <TableRow key={label + '-row'}>
                        <StyledLabelCell>
                          <strong>{label}</strong>
                        </StyledLabelCell>
                        <StyledTableCell>
                          <Typography variant="body2" component="p" children={value} />
                        </StyledTableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                )}
              </Table>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile;
