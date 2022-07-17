import React from 'react';
import {Box} from '@mui/material';
import AccountButton from '../Nav/AccountButton';

const UnlockWallet = () => {
  return (
    <Box style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>
      <AccountButton />
      {/* <Button color="primary" variant="contained" onClick={() => connect('injected')}>Unlock Wallet</Button> */}
    </Box>
  );
};

export default UnlockWallet;
