import {Grid} from '@material-ui/core';
import React from 'react';
import {Route, Switch, useRouteMatch} from 'react-router-dom';
import Page from '../../components/Page';
import GrapeNode from '../GrapeNode';
import GrapeCard from './GrapeCard';
import WineMimCard from './WineMimCard';
import LPCard from './LPCard';
import LPWlrsCard from './LPWlrsCard';
import { createGlobalStyle } from 'styled-components';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BackgroundImage = createGlobalStyle`
  body {
    background-size: cover !important;
    background: radial-gradient(circle at 52.1% -29.6%, rgb(144, 17, 105) 0%, rgb(51, 0, 131) 100.2%);
    ;
  }
`;

const GrapeNodes = () => {
  const {path} = useRouteMatch();
  return (
    <Page>
      <ToastContainer style={{ width: '500px', marginRight: '50px', marginTop: '50px'}}/>
      <BackgroundImage />
      <Switch>
        <Route exact path={path}>
          <h1 style={{fontSize: '80px', textAlign: 'center'}}>NODES</h1>
          <Grid container spacing={3} style={{marginTop: '20px'}}>
            <GrapeCard />
            <WineMimCard />
            <LPCard />
            <LPWlrsCard />
          </Grid>
        </Route>
        <Route path={`${path}/:bankId`}>
          <GrapeNode />
        </Route>
      </Switch>
    </Page>
  );
};

export default GrapeNodes;
