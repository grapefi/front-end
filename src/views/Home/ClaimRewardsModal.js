import {Modal, Box, Checkbox, CircularProgress, Grid, Button, makeStyles} from '@material-ui/core';
import React, {useState} from 'react';
import CloseIcon from '@material-ui/icons/Close';
import useEarningsOnBoardroom from '../../hooks/useEarningsOnBoardroom';
import {getDisplayBalance} from '../../utils/formatBalance';
import useEarnings from '../../hooks/useEarnings';
import useBanks from '../../hooks/useBanks';
import useMassClaim from '../../hooks/useMassClaim';

const useStyles = makeStyles((theme) => ({
  cellLeft: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'left',
    overflow: 'hidden',
  },

  cellRight: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'right',
    overflow: 'hidden',
  },
}));

const style = {
  position: 'absolute',
  color: '#fff',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 'min(90%, 500px)',
  bgcolor: 'rgba(0,0,0,0.8)',
  p: '24px',
  display: 'flex',
  flexDirection: 'column',
  outline: 'none',
  boxSizing: 'border-box',
  borderRadius: '12px',
};

const ClaimRewardsModal = ({open, handleClose}) => {
  const classes = useStyles();
  const [banks] = useBanks();
  const [claimBtnDisabled, setClaimBtnDisabled] = useState(true);
  const { executeMassClaim } = useMassClaim();
  const [loading, setLoading] = useState(false);

  // Vineyard
  const grapeMimBank = banks.find((bank) => bank.contract === 'GrapeMimLPWineRewardPool');
  const wineMimBank = banks.find((bank) => bank.contract === 'WineMimLPWineRewardPool');
  const grapeWineBank = banks.find((bank) => bank.contract === 'GrapeWineLPWineRewardPool');
  const grapeBank = banks.find((bank) => bank.contract === 'GrapeStaking');
  const wampBank = banks.find((bank) => bank.contract === 'WampStaking');
  
  const [grapeMimChecked, setGrapeMimChecked] = useState(false);
  const [wineMimChecked, setWineMimChecked] = useState(false);
  const [grapeWineChecked, setGrapeWineChecked] = useState(false);
  const [grapeChecked, setGrapeChecked] = useState(false);
  const [wampChecked, setwampChecked] = useState(false);

  const grapeMimClaimableRewards = useEarnings(grapeMimBank.contract, grapeMimBank.earnTokenName, grapeMimBank.poolId);
  const wineMimClaimableRewards = useEarnings(wineMimBank.contract, wineMimBank.earnTokenName, wineMimBank.poolId);
  const grapeWineClaimableRewards = useEarnings(grapeWineBank.contract, grapeWineBank.earnTokenName, grapeWineBank.poolId);
  const grapeClaimableRewards = useEarnings(grapeBank.contract, grapeBank.earnTokenName, grapeBank.poolId);
  const wampClaimableRewards = useEarnings(wampBank.contract, wampBank.earnTokenName, wampBank.poolId);

  // Winery rewards
  const [wineryChecked, setWineryChecked] = useState(false);
  const wineryClaimableRewards = useEarningsOnBoardroom();

  // Nodes
  const grapeNodeBank = banks.find((bank) => bank.contract === 'GrapeNode');
  const wineNodeBank = banks.find((bank) => bank.contract === 'WineNode');
  const grapeMimSWNodesBank = banks.find((bank) => bank.contract === 'LPNode');

  const [grapeNodesChecked, setGrapeNodesChecked] = useState(false);
  const [wineNodesChecked, setWineNodesChecked] = useState(false);
  const [grapeMimSWNodesChecked, setGrapeMimSWNodesChecked] = useState(false);

  const grapeNodesClaimableRewards = useEarnings(grapeNodeBank.contract, grapeNodeBank.earnTokenName, grapeNodeBank.poolId);
  const wineNodesClaimableRewards = useEarnings(wineNodeBank.contract, wineNodeBank.earnTokenName, wineNodeBank.poolId);
  const grapeMimSWNodesClaimableRewards = useEarnings(grapeMimSWNodesBank.contract, grapeMimSWNodesBank.earnTokenName, grapeMimSWNodesBank.poolId);

  React.useEffect(() => {
    const isEnabled = 
    // Vineyard
    grapeMimChecked || wineMimChecked || grapeWineChecked || grapeChecked || wampChecked ||
    // Winery
    wineryChecked || 
    // Nodes
    grapeNodesChecked || wineNodesChecked || grapeMimSWNodesChecked;

    setClaimBtnDisabled(!isEnabled);
  }, [grapeMimChecked, wineMimChecked, grapeWineChecked, grapeChecked, wampChecked, wineryChecked, grapeNodesChecked, wineNodesChecked, grapeMimSWNodesChecked]);

  async function startMassClaim() {
    try {
      await executeMassClaim(
        // Vineyard
          grapeMimChecked ? grapeMimBank : null, 
          wineMimChecked ? wineMimBank : null,
          grapeWineChecked ? grapeWineBank : null,
          grapeChecked ? grapeBank : null,
          wampChecked ? wampBank : null,
          // Winery
          wineryChecked, 
          // Nodes
          grapeNodesChecked ? grapeNodeBank : null, 
          wineNodesChecked ? wineNodeBank : null,
          grapeMimSWNodesChecked ? grapeMimSWNodesBank : null);

    } catch (error) {
      console.log(error);
    }
    finally {
      setLoading(false);
    }
  }

  const claimRewards = () => {
    return function() {
      setLoading(true);
      startMassClaim();
    }
  }

  return (
    <Modal open={open}>
      <Box sx={style}>
        <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
          <Box
            sx={{
              cursor: 'pointer',
            }}
            onClick={() => {
              handleClose();
            }}
          >
            <CloseIcon />
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <h2 style={{fontSize: '25px'}}>Claim your Rewards</h2>

          <h3 style={{fontSize: '20px'}}>VINEYARD</h3>
          <Grid container>
            <Grid item xs={8} sm={9} md={9} lg={10} xl={10} className={classes.cellLeft}>
              Claim {getDisplayBalance(grapeMimClaimableRewards)} Grape-Mim LP Rewards
            </Grid>
            <Grid item xs={4} sm={3} md={3} lg={2} xl={2} className={classes.cellRight}>
              <Checkbox
                disabled={grapeMimClaimableRewards.isZero()}
                checked={grapeMimChecked}
                onChange={(e) => {
                  setGrapeMimChecked(e.target.checked);
                }}
              />
            </Grid>

            <Grid item xs={8} sm={9} md={9} lg={10} xl={10} className={classes.cellLeft}>
              Claim {getDisplayBalance(wineMimClaimableRewards)} Wine-Mim LP Rewards
            </Grid>
            <Grid item xs={4} sm={3} md={3} lg={2} xl={2} className={classes.cellRight}>
              <Checkbox
                  disabled={wineMimClaimableRewards.isZero()}
                  checked={wineMimChecked}
                  onChange={(e) => {
                    setWineMimChecked(e.target.checked);
                  }}
                />
            </Grid>

            <Grid item xs={8} sm={9} md={9} lg={10} xl={10} className={classes.cellLeft}>
              Claim {getDisplayBalance(grapeWineClaimableRewards)} Grape-Wine LP Rewards
            </Grid>
            <Grid item xs={4} sm={3} md={3} lg={2} xl={2} className={classes.cellRight}>
              <Checkbox
                  disabled={grapeWineClaimableRewards.isZero()}
                  checked={grapeWineChecked}
                  onChange={(e) => {
                    setGrapeWineChecked(e.target.checked);
                  }}
                />
            </Grid>

            <Grid item xs={8} sm={9} md={9} lg={10} xl={10} className={classes.cellLeft}>
              Claim {getDisplayBalance(grapeClaimableRewards)} Grape Rewards
            </Grid>
            <Grid item xs={4} sm={3} md={3} lg={2} xl={2} className={classes.cellRight}>
              <Checkbox
                  disabled={grapeClaimableRewards.isZero()}
                  checked={grapeChecked}
                  onChange={(e) => {
                    setGrapeChecked(e.target.checked);
                  }}
                />
            </Grid>

            <Grid item xs={8} sm={9} md={9} lg={10} xl={10} className={classes.cellLeft}>
              Claim {getDisplayBalance(wampClaimableRewards)} Wamp Rewards
            </Grid>
            <Grid item xs={4} sm={3} md={3} lg={2} xl={2} className={classes.cellRight}>
              <Checkbox
                  disabled={wampClaimableRewards.isZero()}
                  checked={wampChecked}
                  onChange={(e) => {
                    setwampChecked(e.target.checked);
                  }}
                />
            </Grid>
          </Grid>
          <h3 style={{fontSize: '20px'}}>WINERY</h3>
          <Grid container>
            <Grid item xs={8} sm={9} md={9} lg={10} xl={10} className={classes.cellLeft}>
              Claim {getDisplayBalance(wineryClaimableRewards)} Grape Rewards
            </Grid>
            <Grid item xs={4} sm={3} md={3} lg={2} xl={2} className={classes.cellRight}>
              <Checkbox 
                disabled={wineryClaimableRewards.isZero()}
                checked={wineryChecked}
                onChange={(e) => {
                  setWineryChecked(e.target.checked);
                }}
              />
            </Grid>
          </Grid>
          <h3 style={{fontSize: '20px'}}>NODES</h3>
          <Grid container>
            <Grid item xs={8} sm={9} md={9} lg={10} xl={10} className={classes.cellLeft}>
              Claim {getDisplayBalance(grapeNodesClaimableRewards)} Grape Nodes Rewards
            </Grid>
            <Grid item xs={4} sm={3} md={3} lg={2} xl={2} className={classes.cellRight}>
              <Checkbox
                  disabled={grapeNodesClaimableRewards.isZero()}
                  checked={grapeNodesChecked}
                  onChange={(e) => {
                    setGrapeNodesChecked(e.target.checked);
                  }}
                />
            </Grid>

            <Grid item xs={8} sm={9} md={9} lg={10} xl={10} className={classes.cellLeft}>
              Claim {getDisplayBalance(wineNodesClaimableRewards)} Wine Nodes Rewards
            </Grid>
            <Grid item xs={4} sm={3} md={3} lg={2} xl={2} className={classes.cellRight}>
              <Checkbox
                    disabled={wineNodesClaimableRewards.isZero()}
                    checked={wineNodesChecked}
                    onChange={(e) => {
                      setWineNodesChecked(e.target.checked);
                    }}
                  />
            </Grid>

            <Grid item xs={8} sm={9} md={9} lg={10} xl={10} className={classes.cellLeft}>
              Claim {getDisplayBalance(grapeMimSWNodesClaimableRewards)} Grape-Mim SW Nodes Rewards
            </Grid>
            <Grid item xs={4} sm={3} md={3} lg={2} xl={2} className={classes.cellRight}>
              <Checkbox
                    disabled={grapeMimSWNodesClaimableRewards.isZero()}
                    checked={grapeMimSWNodesChecked}
                    onChange={(e) => {
                      setGrapeMimSWNodesChecked(e.target.checked);
                    }}
                  />
            </Grid>
          </Grid>

          <Grid container>
            <Grid
              item
              xs={12}
              sm={12}
              lg={12}
              style={{marginTop: '20px', display: 'flex', textAlign: 'center', justifyContent: 'center', verticalAlign: 'middle'}}
            >
              {!loading ?
                    <Button onClick={claimRewards()} 
                    disabled={claimBtnDisabled}
                    className={claimBtnDisabled ? 'shinyButtonDisabled' : 'shinyButton'}
                    style={{width: '220px', height: '60px'}}>
                      Claim your rewards
                    </Button>
                    :
                    <div>
                      <CircularProgress color='inherit' />
                      <div style={{ fontSize: '15px', marginTop: '12px', color: 'red' }}><i>Submitting multiple claim transactions... Please do not exit this window</i></div>
                    </div>
                  }
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Modal>
  );
};

export default ClaimRewardsModal;
