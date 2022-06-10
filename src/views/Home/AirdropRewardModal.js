import { Modal, Box, Typography, makeStyles } from '@material-ui/core';
import React, { useState } from 'react';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((theme) => ({
  textField: {
    color: 'black',
    '& *': {
      color: 'black',
    },
  },
  text: {
    fontSize: '14px',
  },
  biggerText: {
    fontSize: '15px',
  },
  purpleText: {
    fontSize: '16px',
    color: '#930993'
  },
  subTitle: {
    color: '#0a274280',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  greenText: {
    color: '#36d846',
    fontSize: '14px',
  },
  inputButton: {
    marginLeft: '8px',
    fontSize: '12px',
    borderRadius: '4px',
    background: '#0c7aca',
    border: 'none',
    outline: 'none',
    padding: '0px 4px',
    lineHeight: '24px',
    color: 'white',
    cursor: 'pointer',
  },
  input: {
    appearance: 'none',
    fontSize: '20px',
    border: 'none',
    outline: 'none',
    padding: 'none',
    width: '100%',
    paddingBlock: '5px',
    backgroundColor: 'transparent',
    '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
      WebkitAppearance: 'none',
    },
    '&[type=number]': {
      MozAppearance: 'none',
    },
  },
}));

const style = {
  position: 'absolute',
  color: '#fff',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 'min(90%, 450px)',
  bgcolor: 'rgba(0,0,0,0.8)',
  p: '24px',
  display: 'flex',
  flexDirection: 'column',
  outline: 'none',
  boxSizing: 'border-box',
  borderRadius: '12px',
};

const NFT_TICKET_COUNT = 9600;
 
const AirdropRewardModal = ({ open, handleClose, grapes, grapePrice, wines, winePrice, grapeMimSW, grapeMimSWPrice, totalGrapes, totalWine, totalGrapeMimSW }) => {
  const [ticketNumber, setTicketNumber] = useState(1);
  const classes = useStyles();

  const getNumberOfNodes = (coin) => {
    if (coin === 'GRAPE') {
      return Number(grapes);
    }
    else if (coin === 'WINE') {
      return Number((wines));
    }
    else if (coin === 'GRAPE-MIM SW') {
      return Number((grapeMimSW));
    }
  }

  const getPriceForNodes = (coin) => {
    if (coin === 'GRAPE') {
      return Number((totalGrapes * grapePrice).toFixed(0));
    }
    else if (coin === 'WINE') {  
      return Number((totalWine * winePrice).toFixed(0)); 
    }
    else if (coin === 'GRAPE-MIM SW') {
      return Number((totalGrapeMimSW * grapeMimSWPrice).toFixed(0));
    }
  }

  const getTotalPriceForNodes = () => {
    return getPriceForNodes('GRAPE') + getPriceForNodes('WINE') + getPriceForNodes('GRAPE-MIM SW');
  }

  const getShareValue = () => {
    return Number(((ticketNumber * (getTotalPriceForNodes())) / (getTotalNumberOfNodes() + 9600)).toFixed(0));
  }

  const getShareGrapes = () => {
    return Number((ticketNumber * totalGrapes) / (getTotalNumberOfNodes() + NFT_TICKET_COUNT)).toFixed(2);
  }

  const getShareWines = () => {
    return Number((ticketNumber * totalWine) / (getTotalNumberOfNodes() + NFT_TICKET_COUNT)).toFixed(2);
  }

  const getShareGrapeMimSW = () => {
    return Number((ticketNumber * totalGrapeMimSW) / (getTotalNumberOfNodes() + NFT_TICKET_COUNT)).toFixed(2);
  }

  const getTotalNumberOfNodes = () => {
    return getNumberOfNodes('GRAPE') + getNumberOfNodes('WINE') + getNumberOfNodes('GRAPE-MIM SW');
  }

  return (
    <Modal open={open}>
      <Box sx={style}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Box
            sx={{
              cursor: 'pointer',
            }}
            onClick={() => {
              handleClose();
              setTicketNumber(1);
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
          <h2 style={{fontSize: '22px'}}>Enter your number of tickets</h2>
          <Box
            sx={{
              borderRadius: '10px',
              bgcolor: '#eff2f4',
              border: '1px solid #d0d3d4',
              p: '10px',
              mt: '10px',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                mb: '10px',
              }}
            >
              <input
                type="number"
                value={ticketNumber}
                className={classes.input}
                onChange={(e) => setTicketNumber(e.target.value)}
              /> <br/>
            </Box>
            <Box sx={{ fontStyle: 'italic', marginTop: '10px', fontSize: '11px', color: '#000' }}>
                1 node (Grape, Wine or Grape-Mim SW) gives 1 ticket<br/>
                1 Goon Bag gives 1 ticket<br/>
                1 Glass gives 3 tickets<br/>
                1 Decanter gives 9 tickets<br/>
                1 Goblet gives 30 tickets<br/>
              </Box>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              marginTop: '20px',
            }}
          >
            <Box>
              <h2 style={{fontSize: '22px'}}>Details</h2>
              <Typography className={classes.text}>{getNumberOfNodes('GRAPE')} Total Grape Nodes ({totalGrapes} Grapes in pool)</Typography>
              <Typography className={classes.text}>{getNumberOfNodes('WINE')} Total Wine Nodes ({totalWine} Wines in pool) </Typography>
              <Typography className={classes.text}>{getNumberOfNodes('GRAPE-MIM SW')} Total Grape-Mim SW Nodes</Typography>
              
              <Box sx={{ marginTop: '10px'}} className={classes.text}>Total Tickets from Nodes: {getTotalNumberOfNodes()}</Box>
              <Typography className={classes.text}>Total Tickets from NFTs: {NFT_TICKET_COUNT}</Typography>
              <Typography className={classes.biggerText}><b>TOTAL TICKETS: {getTotalNumberOfNodes() + NFT_TICKET_COUNT}</b></Typography>

              <Box sx={{ marginTop: '10px'}} className={classes.purpleText}><b>At current prices, your {ticketNumber} tickets are worth approx. ≈${getShareValue()}</b></Box>
              <Typography className={classes.text}>≈{getShareGrapes()} Grape(s)</Typography>
              <Typography className={classes.text}>≈{getShareWines()} Wine(s)</Typography>
              {/*<Typography className={classes.text}>≈{getShareGrapeMimSW()} Grape-Mim SW(s)</Typography>*/}

              <Box sx={{ fontStyle: 'italic', marginTop: '10px', fontSize: '11px' }}>Please note that the numbers are only an estimation, they are based upon the current balance of the reward pool and the current prices. They also estimate that all NFTs are held by node holders. Do not consider the results as your final reward amount.</Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default AirdropRewardModal;
