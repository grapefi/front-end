import React, {useMemo, useEffect} from 'react';
import clsx from 'clsx';
import {Link} from 'react-router-dom';
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
  useMediaQuery,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@material-ui/core';

import ListItemLink from '../ListItemLink';
import useGrapeStats from '../../hooks/useGrapeStats';
import useBtcStats from '../../hooks/useBtcStats';
import useShareStats from '../../hooks/useWineStats';

import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import {makeStyles, useTheme} from '@material-ui/core/styles';
import AccountButton from './AccountButton';

import grapeLogo from '../../assets/img/logo1.png';
import {roundAndFormatNumber} from '../../0x';
import TokenSymbol from '../TokenSymbol';

const useStyles = makeStyles((theme) => ({
  '@global': {
    ul: {
      margin: 0,
      padding: 0,
      listStyle: 'none',
    },
  },
  appBar: {
    color: '#322f32',
    'background-color': 'rgba(255,255,255,0.0) !important',
    // borderBottom: `1px solid ${theme.palette.divider}`,
    padding: '10px',
    marginBottom: '3rem',
  },
  drawer: {
    width: 240,
    flexShrink: 0,
  },
  drawerPaper: {
    width: 240,
  },
  hide: {
    display: 'none',
  },
  toolbar: {
    flexWrap: 'wrap',
  },
  toolbarTitle: {
    fontFamily: 'Rubik',
    fontSize: '0px',
    flexGrow: 1,
  },
  link: {
    textTransform: 'uppercase',
    color: '#322f32',
    fontSize: '16px',
    marginTop: '15px',
    margin: theme.spacing(10, 1, 1, 2),
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'none',
    },
  },
  brandLink: {
    textDecoration: 'none',
    color: '#322f32',
    '&:hover': {
      textDecoration: 'none',
    },
  },
}));

const Nav = () => {
  const matches = useMediaQuery('(min-width:900px)');
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  //const grapeStats = useGrapeStats();
  //const btcStats = useBtcStats();
  //const shareStats = useShareStats();

  const [connected, setConnected] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };


  return (
    <AppBar position="sticky" elevation={0} className={classes.appBar}>
      <Toolbar className={classes.toolbar}>
        {matches ? (
          <>
            <Typography variant="h6" color="inherit" noWrap style={{ flexGrow: '0' }} className={classes.toolbarTitle}>
              {/* <a className={ classes.brandLink } href="/">Grape Money</a> */}
              <Link to="/" color="inherit" className={classes.brandLink}>
                <img alt="Grape Finance" src={grapeLogo} height="60px" />
              </Link>
            </Typography>
            <Box style={{ paddingLeft: '15px', paddingTop: '10px', fontSize: '1rem', flexGrow: '1' }}>
              <Link to="/" className={'navLink ' + classes.link}>
                Home
              </Link>

              <Link to="/vineyard" className={'navLink ' + classes.link}>
                Vineyard
              </Link>
              <Link to="/winery" className={'navLink ' + classes.link}>
                Winery
              </Link>
              <Link to="/nodes" className={'navLink ' + classes.link}>
                Nodes
              </Link>
              <Link to="/leaderboard" className={'navLink ' + classes.link}>
                Leaderboard
              </Link>

              <Link to="/bond" className={'navLink ' + classes.link}>
                Bonds
              </Link>
              <Link to="/raffle" className={'navLink ' + classes.link}>
                Raffle
              </Link>
              <div className={'dropdown'}>
                <button className={'dropbtn'}>AUTO VAULTS</button>
                <div className={'dropdown-content'}>
                  <a href="https://magik.farm/#/avax" className={classes.link} rel="noopener" target="_blank">
                    Magik
                  </a>
                  <a href="https://app.beefy.finance/#/" className={classes.link} rel="noopener" target="_blank">
                    Beefy
                  </a>
                  <a href="https://yieldwolf.finance/avalanche" className={classes.link} rel="noopener" target="_blank">
                    Yield Wolf
                  </a>
                </div>
              </div>

              <div className={'dropdown'}>
                <button className={'dropbtn'}>GRAPE'S WALLETS</button>
                <div className={'dropdown-content'}>
                  <a
                    href="https://debank.com/profile/0xb260547c37bC80fBD1a0D742Af71C2324151640c"
                    className={classes.link}
                    rel="noopener"
                    target="_blank"
                  >
                    Treasury
                  </a>
                  <a
                    href="https://debank.com/profile/0xEB6c4b5aC4822480860476FF543D77D3882244e1"
                    className={classes.link}
                    rel="noopener"
                    target="_blank"
                  >
                    DAO
                  </a>
                  <a
                    href="https://debank.com/profile/0xc0702Ae0374F83fc3bA71CE2B30A323b09EC19da"
                    className={classes.link}
                    rel="noopener"
                    target="_blank"
                  >
                    Nodes Rewards
                  </a>
                </div>
              </div>
              <div className={'dropdown'}>
                <button className={'dropbtn'}>USEFUL LINKS</button>
                <div className={'dropdown-content'}>
                  <Link to="/strategies" className={classes.link}>
                    Strategy
                  </Link>
                  <Link to="/stats" className={classes.link}>
                    Stats
                  </Link>
                  <Link to="/roadmap" className={classes.link}>
                    Roadmap
                  </Link>
                  <Link to="/help" className={classes.link}>
                    Help
                  </Link>
                </div>
              </div>

              {/*<a
                href="https://snapshot.org/#/grapefinance.eth"
                className={'navLink ' + classes.link}
                rel="noopener"
                target="_blank"
              >
                Voting
            </a>*/}
              <a
                href="https://shop.grapefinance.app/"
                className={'navLink ' + classes.link}
                rel="noopener"
                target="_blank"
              >
                Merch
              </a>
              <a
                href="https://grapefinance.gitbook.io/grape-finance-docs/"
                className={'navLink ' + classes.link}
                rel="noopener"
                target="_blank"
              >
                Docs
              </a>
            </Box>

            <Box
              style={{
                flexGrow: '0',
                paddingLeft: '15px',
                paddingTop: '5px',
                fontSize: '1rem',
                paddingRight: '15px',
                height: '30px',
                display: 'flex',
              }}
            ></Box>
            <AccountButton text="Connect" />
          </>
        ) : (
          <>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              className={clsx(open && classes.hide)}
            >
              <MenuIcon />
            </IconButton>

            <img
              alt="grape.money"
              src={grapeLogo}
              style={{ height: '40px', marginTop: '-10px', marginLeft: '10px', marginRight: '15px' }}
            />
            <AccountButton text="Connect" />
            <Drawer
              className={classes.drawer}
              onClose={handleDrawerClose}
              // onEscapeKeyDown={handleDrawerClose}
              // onBackdropClick={handleDrawerClose}
              variant="temporary"
              anchor="left"
              open={open}
              classes={{
                paper: classes.drawerPaper,
              }}
            >
              <div>
                <IconButton onClick={handleDrawerClose}>
                  {theme.direction === 'rtl' ? (
                    <ChevronRightIcon htmlColor="white" />
                  ) : (
                    <ChevronLeftIcon htmlColor="white" />
                  )}
                </IconButton>
              </div>
              <Divider />
              <List>
                <ListItem>
                  <AccountButton text="Connect" />
                </ListItem>
                <ListItemLink primary="Home" to="/" />
                <ListItemLink primary="Vineyard" to="/vineyard" />
                <ListItemLink primary="Winery" to="/winery" />
                <ListItemLink primary="Nodes" to="/nodes" />
                <ListItemLink primary="Leaderboard" to="/leaderboard" />
                <ListItemLink primary="Bond" to="/bond" />
                <ListItemLink primary="Raffle" to="/raffle" />
                <ListItem button component="a" href="https://magik.farm/#/avax">
                  <ListItemText>Magik</ListItemText>
                </ListItem>
                <ListItem button component="a" href="https://app.beefy.finance/#/">
                  <ListItemText>Beefy</ListItemText>
                </ListItem>
                <ListItem button component="a" href="https://yieldwolf.finance/avalanche">
                  <ListItemText>Yield Wolf</ListItemText>
                </ListItem>      
                {/*<ListItemLink primary="Launchpad" to="/launchpad" />*/}
                <ListItem
                  button
                  component="a"
                  href="https://debank.com/profile/0xb260547c37bC80fBD1a0D742Af71C2324151640c"
                >
                  <ListItemText>Treasury</ListItemText>
                </ListItem>
                <ListItem
                  button
                  component="a"
                  href="https://debank.com/profile/0xEB6c4b5aC4822480860476FF543D77D3882244e1"
                >
                  <ListItemText>DAO</ListItemText>
                </ListItem>
                <ListItem
                  button
                  component="a"
                  href="https://debank.com/profile/0xc0702Ae0374F83fc3bA71CE2B30A323b09EC19da"
                >
                  <ListItemText>Nodes Rewards</ListItemText>
                </ListItem>

                <ListItemLink primary="Strategy" to="/strategies" />
                <ListItemLink primary="Stats" to="/stats" />
                <ListItemLink primary="Roadmap" to="/roadmap" />
                <ListItemLink primary="Help" to="/help" />
                <ListItem button component="a" href="https://shop.grapefinance.app/">
                  <ListItemText>Merch</ListItemText>
                </ListItem>
                {/* <ListItem button component="a" href="https://snapshot.org/#/grapefinance.eth">
                  <ListItemText>Voting</ListItemText>
                  </ListItem>*/}

                <ListItem button component="a" href="https://grapefinance.gitbook.io/grape-finance-docs/">
                  <ListItemText>Docs</ListItemText>
                </ListItem>
              </List>
            </Drawer>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Nav;
