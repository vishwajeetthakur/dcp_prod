// Packages
import React from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown'
import {
    Button, Card, CardActions, CardActionArea, CardContent,
    Chip, Grid, Link, List, ListItem, ListItemText,
    Table, TableBody, TableCell, TableContainer, TableRow,
    Typography, Skeleton,
} from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';

// Hooks
import { useSelector } from 'react-redux';
import { useQuery, } from 'react-query';

// Components
import { BasicWrapper, ToolWrapper } from '../../common';

// Utilities
import { repos, serviceLinks } from './contentManagement'
import { a11yProps, formatDate } from '../../../utilities'
import paths from '../../../paths'

// Styles
import {
    PrimaryTitleBox,
    OuterContentPaper,
} from '../../common/styled.components';
import './HomePage.scss';


const Home = ({ pageID = 'home' }) => {
    const { tabs } = useSelector(state => state.globalStates)
    const { data, isLoading } = useQuery('HomePageData', () => axios.get(paths.HOMEPAGE_JSON))

    const systemStatusData = data?.data?.system_status;
    const releaseData = data?.data?.gitlab;

    return (
        <BasicWrapper pageID={pageID}>

            <Grid container spacing={4} px={4}>

                {/* Header */}
                <Grid item md={5} pt={0}>
                    <PrimaryTitleBox color={false}>
                        <Typography variant="h4" children="System Status" />
                    </PrimaryTitleBox>

                    {/* System Status Table */}
                    <TableContainer component={OuterContentPaper} sx={{ p: 2 }} elevation={18}>
                        <Table aria-label="system status table" size="small">

                            <TableBody>

                                {Array
                                    .from({ length: 9 })
                                    .map((_, key) => (

                                        <TableRow key={key}>
                                            <TableCell>
                                                <Skeleton key={'skeleton_' + key} shape="rectangle" style={{ padding: '4px' }} />
                                            </TableCell>
                                        </TableRow>

                                    ))}

                                {/* {!isLoading && Object
                                    .entries(systemStatusData)
                                    .map(([system, data], i) => (
                                        <TableRow key={i}>
                                            <TableCell sx={{ width: '5%', border: 0 }}>
                                                <CircleIcon color={data.status} />
                                            </TableCell>
                                            <TableCell sx={{ cursor: 'pointer', width: '47.5%', border: 0 }}>
                                                {system.replace('_', ' ')}
                                            </TableCell>
                                            <TableCell sx={{ width: '47.5%', border: 0 }}>
                                                {data.value === '' ? '' : data.value}
                                            </TableCell>
                                        </TableRow>
                                    ))} */}

                            </TableBody>

                        </Table>

                    </TableContainer>
                </Grid>

                {/* Release Notes */}
                <Grid item md={7}>
                    <ToolWrapper
                        wrapperLabel={"Release Notes"}
                        tabDefinitions={repos.map(({ name }) => ({ label: name, }))}
                        inputElement={(
                            <Grid container spacing={2} sx={{
                                height: '400px',
                                maxHeight: '400px',
                                overflow: isLoading ? 'hidden' : 'auto',
                                scrollbarBaseColor: 'primary',
                                mb: 2,
                                textAlign: 'left',
                            }}
                            >
                                {releaseData &&
                                    typeof releaseData?.find(({ name }) => name === repos[tabs].name.toLowerCase())?.data == 'string'
                                    ? <Grid item key={name} sm={12} px={4} ml={2}>
                                        {
                                            releaseData
                                                ?.find(({ name }) => name === repos[tabs].name.toLowerCase())
                                                ?.data
                                        }
                                    </Grid>
                                    : releaseData
                                        ?.find(({ name }) => name === repos[tabs].name.toLowerCase())
                                        ?.data
                                        ?.map(release => (
                                            <Grid item key={release.name} sm={12} px={4} ml={2}>
                                                <Card sx={{ display: 'flex', p: 1 }}>
                                                    <CardActionArea component="a" href={release._links.self} px={2}>
                                                        <CardContent sx={{ flex: 1 }}>
                                                            <Chip
                                                                color="primary"
                                                                label={
                                                                    <Typography component="h5" variant="h5" children={release.name} />
                                                                }
                                                            />
                                                            <Typography variant="subtitle1" color="text.secondary" children={formatDate(release.released_at)} />
                                                            <ReactMarkdown children={release.description} />
                                                            <CardActions>
                                                                <Button variant="text" color="primary" size="large" children="View Repository" />
                                                            </CardActions>
                                                        </CardContent>
                                                    </CardActionArea>
                                                </Card>
                                            </Grid>
                                        ))

                                }
                            </Grid>
                        )}
                        isLoading={isLoading}
                    />

                </Grid>

                <Grid item md={12} pt={0}>
                    <PrimaryTitleBox color={false}>
                        <Typography variant="h4" children="Service Engineering Links" />
                    </PrimaryTitleBox>
                    <OuterContentPaper elevation={18}>
                        <Grid container px={6} py={2} justifyContent="space-around">
                            <Grid item sm={12} md={4} textAlign="left" my={2}>
                                <Typography variant="h6" children="Design Standards" sx={theme => ({ borderBottom: theme.border.main, width: '50%', mb: 2 })} />
                                <List disablePadding>
                                    {serviceLinks['Design_Standards'].map((props, i) => (
                                        <ListItem key={i} component={Link} button href={props.to} sx={{ pl: 0 }}>
                                            <ListItemText>{props.label}</ListItemText>
                                        </ListItem>
                                    ))}
                                </List>
                            </Grid>
                            <Grid item sm={12} md={8}>
                                <Grid container>
                                    {Object
                                        .keys(serviceLinks)
                                        .filter(key => key !== 'Design_Standards')
                                        .map(key => (
                                            <Grid key={key} item sm={12} md={6} textAlign="left" my={2}>
                                                <Typography variant="h6" children={key.replace('_', ' ')} sx={theme => ({ borderBottom: theme.border.main, width: '50%', mb: 2 })} />
                                                <List disablePadding>
                                                    {serviceLinks[key].map((props, i) => (
                                                        <ListItem key={i} component={Link} button href={props.to} target="_blank" sx={{ pl: 0 }}>
                                                            <ListItemText>{props.label}</ListItemText>
                                                        </ListItem>
                                                    ))}
                                                </List>
                                            </Grid>
                                        ))}
                                </Grid>
                            </Grid>
                        </Grid>
                    </OuterContentPaper>
                </Grid>
            </Grid>
        </BasicWrapper>
    );
};

export default Home
