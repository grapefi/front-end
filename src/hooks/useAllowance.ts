import {useCallback, useEffect, useState} from 'react';
import {useWallet} from 'use-wallet';
import {BigNumber} from 'ethers';
import ERC20 from '../grape-finance/ERC20';

const useAllowance = (token: ERC20, spender: string, pendingApproval?: boolean) => {
  const [allowance, setAllowance] = useState<BigNumber>(null);
  const {account} = useWallet();

  const fetchAllowance = useCallback(async () => {
    console.log(
      'FETCH ALLOWAWNCE SPENDER = ' + spender + ' for token ' + token.symbol + ' of address ' + token.address,
    );
    console.log(' account = ' + account);
    console.log(' AAAAA');
    try {
      const allowance = await token.allowance(account, spender);
      console.log(' BBBBB');
      console.log(' set allowance = ' + allowance);
      setAllowance(allowance);
    } catch (e) {
      console.error(e);
    }
  }, [account, spender, token]);

  useEffect(() => {
    if (account && spender && token) {
      fetchAllowance().catch((err) => console.error(`Failed to fetch allowance: ${err.stack}`));
    }
  }, [account, spender, token, pendingApproval, fetchAllowance]);

  return allowance;
};

export default useAllowance;
