// Packages
import React from 'react';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';

// Components
import Nav from '../Nav';

// Styles
import { Main } from '../styled.components'
import './Layout.scss';


const Layout = () => {
  const { menus } = useSelector(state => state.globalStates)

  return (
    <Box>
      <Nav />
      <Main open={!menus['sidenav']}>
        <Outlet />
      </Main>
    </Box>
  );
};

export default Layout;
