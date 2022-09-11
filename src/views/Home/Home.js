import React, {useMemo, useState} from 'react';
import Page from '../../components/Page';
import InfoCard from '../../components/InfoCard';
import LPInfoCard from '../../components/LPInfoCard';
import {SyncLoader} from 'react-spinners';
import CountUp from 'react-countup';
import useGrapeStats from '../../hooks/useGrapeStats';
import useLpStats from '../../hooks/useLpStats';
import useLpStatsBTC from '../../hooks/useLpStatsBTC';
import useBondStats from '../../hooks/useBondStats';
import useWineStats from '../../hooks/useWineStats';
import useGrapeTotalNode from '../../hooks/useGrapeTotalNodes';
import useWineTotalNode from '../../hooks/useWineTotalNodes';
import useGrapeMimSWTotalNode from '../../hooks/useGrapeMimSWTotalNode';
import useTotalValueLocked from '../../hooks/useTotalValueLocked';
import useNodeRewardPoolStats from '../../hooks/useNodesRewardBalance';
import {roundAndFormatNumber} from '../../0x';
import {Button, Card, CardContent, Grid, Paper, CircularProgress, Typography} from '@material-ui/core';
import kyc from '../../assets/img/kyc.png';
import audit from '../../assets/img/audit1.png';
import {ReactComponent as IconTelegram} from '../../assets/img/telegram.svg';
import {ReactComponent as IconDiscord} from '../../assets/img/discord.svg';
import {ReactComponent as IconTwitter} from '../../assets/img/twitter.svg';

import AirdropRewardModal from './AirdropRewardModal';
import GetStartedModal from './GetStartedModal';
import useCurrentEpoch from '../../hooks/useCurrentEpoch';
import useGetBoardroomPrintRate from '../../hooks/useGetBoardroomPrintRate';
import Alert from '@mui/material/Alert';
import homeItems from '../../homePageItems.json';
import HomeCard from './HomeCard';

const Home = () => {
  const TVL = useTotalValueLocked();
  const grapemimLpStats = useLpStatsBTC('GRAPE-MIM-LP');
  const bSharemimLpStats = useLpStats('WINE-MIM-LP');

  const newPair = useLpStats('GRAPE-WINE-LP');
  const grapeMimSWStats = useLpStats('GRAPE-MIM-SW');

  const grapeStats = useGrapeStats();
  const bShareStats = useWineStats();
  const tBondStats = useBondStats();
  const nodeRewardPoolStats = useNodeRewardPoolStats();
  const useGrapeTotal = useGrapeTotalNode();
  const useWineTotal = useWineTotalNode();
  const useGrapeMimSWTotal = useGrapeMimSWTotalNode();
  const [rewardModelOpen, setModalOpen] = useState(false);
  const [getStartedModalOpen, setGetStartedModalOpen] = useState(false);
  const currentEpoch = useCurrentEpoch();

  const buyGrapeAddress =
    'https://app.bogged.finance/avax/swap?tokenIn=0x130966628846BFd36ff31a822705796e8cb8C18D&tokenOut=0x5541D83EFaD1f281571B343977648B75d95cdAC2';
  const buyWineAddress =
    'https://app.bogged.finance/avax/swap?tokenIn=0x130966628846BFd36ff31a822705796e8cb8C18D&tokenOut=0xC55036B5348CfB45a932481744645985010d3A44';
  const wineChart = 'https://dexscreener.com/avalanche/0x00cb5b42684da62909665d8151ff80d1567722c3';
  const grapeChart = 'https://dexscreener.com/avalanche/0xb382247667fe8ca5327ca1fa4835ae77a9907bc8';

  const grapeLPStats = useMemo(() => (grapemimLpStats ? grapemimLpStats : null), [grapemimLpStats]);
  const wineLPStats = useMemo(() => (bSharemimLpStats ? bSharemimLpStats : null), [bSharemimLpStats]);
  const newPairLPStats = useMemo(() => (newPair ? newPair : null), [newPair]);
  const grapePriceInDollars = useMemo(
    () => (grapeStats ? Number(grapeStats.priceInDollars).toFixed(2) : null),
    [grapeStats],
  );
  const grapePriceInAVAX = useMemo(() => (grapeStats ? Number(grapeStats.tokenInFtm).toFixed(4) : null), [grapeStats]);
  const grapeCirculatingSupply = useMemo(
    () => (grapeStats ? Number(grapeStats.circulatingSupply) : null),
    [grapeStats],
  );
  const grapeTotalSupply = useMemo(() => (grapeStats ? Number(grapeStats.totalSupply) : null), [grapeStats]);

  const winePriceInDollars = useMemo(
    () => (bShareStats ? Number(bShareStats.priceInDollars).toFixed(2) : null),
    [bShareStats],
  );
  const grapeMimSWPriceInDollars = useMemo(
    () => (grapeMimSWStats ? Number(grapeMimSWStats.priceOfOne).toFixed(2) : null),
    [grapeMimSWStats],
  );

  const bShareCirculatingSupply = useMemo(
    () => (bShareStats ? String(bShareStats.circulatingSupply) : null),
    [bShareStats],
  );
  const bShareTotalSupply = useMemo(() => (bShareStats ? String(bShareStats.totalSupply) : null), [bShareStats]);

  const tBondPriceInDollars = useMemo(
    () => (tBondStats ? Number(tBondStats.priceInDollars).toFixed(2) : null),
    [tBondStats],
  );

  const tBondCirculatingSupply = useMemo(
    () => (tBondStats ? String(tBondStats.circulatingSupply) : null),
    [tBondStats],
  );
  const tBondTotalSupply = useMemo(() => (tBondStats ? String(tBondStats.totalSupply) : null), [tBondStats]);

  // const cashStat = useCashPriceInEstimatedTWAP();
  // const twap = useMemo(() => (cashStat ? Number(cashStat.priceInDollars).toFixed(4) : null), [cashStat]);

  const handleCloseModal = () => {
    setModalOpen(false);
    setGetStartedModalOpen(false);
  };

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const openGetStarted = () => {
    setGetStartedModalOpen(true);
  };

  const printRate = useGetBoardroomPrintRate();

  const scrollDown = () => {
    console.log('going down');
    document.getElementById('apps').scrollIntoView();
  };

  return (
    <Page>
      <GetStartedModal open={getStartedModalOpen} handleClose={handleCloseModal} />
      <AirdropRewardModal
        open={rewardModelOpen}
        handleClose={handleCloseModal}
        grapes={useGrapeTotal[0]}
        grapePrice={grapePriceInDollars}
        wines={useWineTotal[0]}
        winePrice={winePriceInDollars}
        grapeMimSW={useGrapeMimSWTotal[0]}
        grapeMimSWPrice={grapeMimSWPriceInDollars}
        totalGrapes={nodeRewardPoolStats?.grapes}
        totalWine={nodeRewardPoolStats?.wines}
        totalGrapeMimSW={nodeRewardPoolStats?.grapeMimSWs}
      />

      <Grid container direction="column" justifyContent="space-between" style={{minHeight: '80vh'}}>
        <Grid item xs={12} style={{textAlign: 'center'}}>
          <Grid container justifyContent="center" spacing={2} alignItems="center">
            <Grid item>
              <img alt="burning grape" src={require('../../assets/img/burninggrape.png')} className="burning-grape" />
            </Grid>
            <Grid item>
              <span className="welcome-text">Welcome to Grape Finance</span>
            </Grid>
            <Grid item>
              {' '}
              <Button onClick={openGetStarted} variant="contained" className="winepress get-started">
                Get Started
              </Button>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <div className="front-text-top">TOTAL VALUE LOCKED</div>
          <div className="front-text-tvl">
            {TVL ? (
              <CountUp end={TVL} separator="," prefix="$" />
            ) : (
              <span className="loading-tvl">
                <SyncLoader color="#E647E6" size={40} />
              </span>
            )}
          </div>
        </Grid>
        <Grid item xs={12} style={{textAlign: 'center'}} id="apps">
          <img
            style={{cursor: 'pointer'}}
            onClick={scrollDown}
            alt="down arrow"
            src={require('../../assets/img/arrow-down-animated.gif')}
            width={55}
            height={35}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} style={{marginTop: '30px'}}>
        <Grid item xs={12}>
          <Grid container spacing={5}>
            {homeItems.map((item) => (
              <HomeCard item={item} />
            ))}
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Alert variant="outlined" severity="info">
            <b style={{fontSize: '1.1rem', color: '#e647e6'}}>Grape Finance Suggestions</b>
            <br />
            <br />
            <b>🟣 General -</b> Below Peg, compounding is recommended. Avoid selling.
            <br />
            <b>🟣 Nodes -</b> Compound 3 times, Claim 1 time. You can use your claimed Grapes in{' '}
            <a style={{color: '#e647e6'}} href="https://winemaker.grapefinance.app/">
              Winemaker
            </a>{' '}
            Game, or in{' '}
            <a style={{color: '#e647e6'}} href="https://winepress.grapefinance.app/">
              Wine Press
            </a>{' '}
            to buy Lotto tickets.
            <br />
            <b>🟣 Vineyard -</b> If you use AutoCompounders (Beefy, Yieldwolf), move your LPs to{' '}
            <a style={{color: '#e647e6'}} href="https://magik.farm/#/avax">
              Magik
            </a>
            . Same returns, but burns Grape🔥.
            <br />
            <b>🟣 Winery -</b> If you have extra MIM, unstake your wine, provide{' '}
            <a
              style={{color: '#e647e6'}}
              href="https://traderjoexyz.com/pool/0x130966628846bfd36ff31a822705796e8cb8c18d/0xc55036b5348cfb45a932481744645985010d3a44#/"
            >
              WINE-MIM LP
            </a>{' '}
            and use it in{' '}
            <a style={{color: '#e647e6'}} href="https://winepress.grapefinance.app/">
              Wine Press!
            </a>
          </Alert>
        </Grid>

        <Grid item xs={12} sm={12} md={7}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" variant="h3" gutterBottom>
                🔥Grape News
              </Typography>
              <Grid container direction="column">
                <Grid item>
                  #1 ✨ <b>Discord Server Migration</b> will occur today (8th)! Please follow official announcements in
                  the discord{' '}
                </Grid>
                <Grid item>
                  #2 🧊 <b>Nodes v2 </b> officially released day after server migration - Friday 9th! Will require some
                  Grape node downtime, official time TBA{' '}
                </Grid>
                <Grid item>
                  #3 🏺
                  <b>
                    <a style={{color: '#e647e6'}} href="https://winepress.grapefinance.app/">
                      WINE PRESS:
                    </a>
                  </b>{' '}
                  Earn 1.25% daily + bonus + lottery!
                </Grid>
                <Grid item>
                  #4 🎲 Play{' '}
                  <b>
                    <a style={{color: '#e647e6'}} href="https://casino.grapefinance.app">
                      GRAPE CASINO
                    </a>
                  </b>{' '}
                  NOW and Burn Grape!
                </Grid>
                <Grid item>
                  #5 👫 Come and say Hi to our newest Core Team Members:{' '}
                  <b>
                    Vintner (Head of Marketing), Fizzyl (Head of Education & Strategy), and Tazz (Head of FE
                    Engineering)
                  </b>
                </Grid>
                <Grid item>
                  #6 🍭 <b>Swapsicle POPs </b> for GRAPE-MIM LP are now claimable on{' '}
                  <a style={{color: '#e647e6'}} href="https://www.swapsicle.io/rewards">
                    Swapsicle
                  </a>
                  , instead of airdrops.
                </Grid>
                <Grid item>
                  #7 🔥 <b>Keep it burnin',</b> <span style={{color: '#e647e6'}}>340,000+</span> Grape burned thanks to
                  Winemaker!
                </Grid>

                <Grid item>
                  #8 🍷 <b>Vinium </b> will be audited the first week of September. Official release expected soon
                  after.
                </Grid>
              </Grid>

              <p style={{textAlign: 'center'}}>
                To Follow the latest news, join us on Discord, Telegram and Twitter <br />
                <a
                  href="https://discord.gg/grapefinance"
                  rel="noopener noreferrer"
                  target="_blank"
                  style={{color: '#fff'}}
                >
                  <IconDiscord width="40" style={{fill: '#fff', height: '40px'}} />
                </a>{' '}
                <a
                  href="https://t.me/GrapeDefi"
                  rel="noopener noreferrer"
                  target="_blank"
                  style={{marginLeft: '20px', color: '#fff'}}
                >
                  <IconTelegram width="40" style={{fill: '#fff', height: '40px'}} />
                </a>
                <a
                  href="https://twitter.com/grape_finance"
                  rel="noopener noreferrer"
                  target="_blank"
                  style={{marginLeft: '30px', color: '#fff'}}
                >
                  <IconTwitter width="40" style={{fill: '#fff', height: '40px'}} />
                </a>
              </p>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={12} md={5}>
          <Grid container xs={12}>
            <Grid item xs={12} style={{marginTop: '20px'}}>
              <Card>
                <CardContent>
                  <Typography className="reward-pool-text" color="textPrimary" variant="h4" gutterBottom>
                    NFT REWARD POOL
                  </Typography>

                  <Grid container direction="column" spacing={2}>
                    <Grid item>
                      <Grid container justifyContent="space-between">
                        <Grid item>
                          <Typography color="textPrimary" align="center" variant="h5">
                            {nodeRewardPoolStats?.grapes} Grape
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Typography color="textSecondary" align="center" variant="h5" style={{fontWeight: 700}}>
                            {nodeRewardPoolStats != null ? (
                              `≈$${roundAndFormatNumber(nodeRewardPoolStats?.grapes * grapePriceInDollars, 0)}`
                            ) : (
                              <CircularProgress size={22} color="inherit" />
                            )}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item>
                      <Grid container justifyContent="space-between">
                        <Grid item>
                          <Typography color="textPrimary" align="center" variant="h5">
                            {nodeRewardPoolStats?.wines} Wine
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Typography color="textSecondary" align="center" variant="h5" style={{fontWeight: 700}}>
                            {nodeRewardPoolStats != null ? (
                              `≈$${roundAndFormatNumber(nodeRewardPoolStats?.wines * winePriceInDollars, 0)}`
                            ) : (
                              <CircularProgress size={22} color="inherit" />
                            )}{' '}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Button onClick={handleOpenModal} className="shinyButton" style={{width: '100%', marginTop: '10px'}}>
                    Estimate my Rewards
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        <Grid item sm={12} md={12} lg={12} style={{marginTop: '10px'}}>
          <Grid container spacing={3}>
            <Grid item xs={6} md={4} lg={2} style={{color: 'white', textAlign: 'center'}}>
              <Typography color="textPrimary" variant="h6">
                EPOCH
              </Typography>{' '}
              {currentEpoch ? (
                <CountUp style={{fontSize: '30px'}} end={currentEpoch} />
              ) : (
                <CircularProgress size={28} color="inherit" />
              )}
            </Grid>
            <Grid item xs={6} md={4} lg={2} style={{color: 'white', textAlign: 'center'}}>
              <Typography color="textPrimary" variant="h6">
                Above Peg
              </Typography>
              {printRate ? (
                <span style={{fontSize: '30px'}}>{printRate.toFixed(2)}%</span>
              ) : (
                <CircularProgress size={28} color="inherit" />
              )}
            </Grid>
            <Grid item xs={12} md={4} lg={3} style={{color: 'white', textAlign: 'center'}}>
              <Typography color="textPrimary" variant="h6">
                Started On
              </Typography>
              <span style={{fontSize: '30px'}}>Jan 16, 2022</span>
            </Grid>
            <Grid item xs={6} md={6} lg={2} style={{color: 'white', textAlign: 'center'}}>
              <Typography color="textPrimary" variant="h6">
                KYC
              </Typography>
              <a
                href="https://twitter.com/0xGuard/status/1480457336082907137"
                rel="noopener noreferrer"
                target="_blank"
              >
                <img alt="0xGuard KYC" style={{height: '70px'}} src={kyc} />
              </a>
            </Grid>
            <Grid item xs={6} md={6} lg={2} style={{color: 'white', textAlign: 'center'}}>
              <Typography color="textPrimary" variant="h6">
                Audit
              </Typography>
              <a href="https://grapefinance.app/audit.pdf" rel="noopener noreferrer" target="_blank">
                <img alt="0xGuard Audit" style={{height: '50px'}} src={audit} />
              </a>
            </Grid>
          </Grid>
        </Grid>

        <Grid item lg={12} md={12} xs={12} sm={12}>
          <Paper style={{height: '5px'}}></Paper>
        </Grid>

        {/* GRAPE */}
        <Grid item xs={12} sm={12} md={6} lg={4}>
          <InfoCard
            name="Grape"
            buyAddress={buyGrapeAddress}
            chartAddress={grapeChart}
            price={grapePriceInAVAX}
            circulatingSupply={grapeCirculatingSupply}
            totalSupply={grapeTotalSupply}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={4}>
          <InfoCard
            name="Wine"
            buyAddress={buyWineAddress}
            chartAddress={wineChart}
            price={winePriceInDollars}
            circulatingSupply={bShareCirculatingSupply}
            totalSupply={bShareTotalSupply}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={4}>
          <InfoCard
            name="Gbond"
            buyAddress="/bond"
            internalLink={true}
            price={tBondPriceInDollars}
            circulatingSupply={tBondCirculatingSupply}
            totalSupply={tBondTotalSupply}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={4}>
          <LPInfoCard
            name="Grape-MIM-LP"
            token1Name="Grape"
            token1Value={grapeLPStats?.tokenAmount}
            token2Name="MIM"
            token2Value={grapeLPStats?.mimAmount}
            poolAddress="/vineyard/GrapeMimLPWineRewardPool"
            price={grapeLPStats?.priceOfOne}
            circulatingSupply={grapeLPStats?.totalLiquidity}
            totalSupply={grapeLPStats?.totalSupply}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={4}>
          <LPInfoCard
            name="Wine-MIM-LP"
            token1Name="Wine"
            token1Value={wineLPStats?.tokenAmount}
            token2Name="MIM"
            token2Value={wineLPStats?.mimAmount}
            poolAddress="/vineyard/WineMimLPWineRewardPool"
            price={wineLPStats?.priceOfOne}
            circulatingSupply={wineLPStats?.totalLiquidity}
            totalSupply={wineLPStats?.totalSupply}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={4}>
          <LPInfoCard
            name="Grape-Wine-LP"
            token1Name="Grape"
            token1Value={newPairLPStats?.tokenAmount}
            token2Name="Wine"
            token2Value={newPairLPStats?.mimAmount}
            poolAddress="/vineyard/GrapeWineLPWineRewardPool"
            price={newPairLPStats?.priceOfOne}
            circulatingSupply={newPairLPStats?.totalLiquidity}
            totalSupply={newPairLPStats?.totalSupply}
          />
        </Grid>
      </Grid>
    </Page>
  );
};

export default Home;
