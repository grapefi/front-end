import { useCallback } from 'react';
import useGrapeFinance from './useGrapeFinance';
import { Bank } from '../grape-finance';

const useMassClaim = () => {
  const grapeFinance = useGrapeFinance();

  const handleMassClaim = useCallback(async (
      // Vineyard 
      grapeMimBank: Bank = null, wineMimBank: Bank = null, grapeWineBank: Bank = null, grapeBank: Bank = null, wampBank: Bank = null, 
      // Winery
      harvestWinery: boolean = false, 
      // Nodes
      grapeNodesBank: Bank = null, 
      wineNodesBank: Bank = null,  
      grapeMimSWNodesBank: Bank = null) => {

    if (!grapeFinance.myAccount) return;

    const harvestTxs = [];

    // Vineyard
    if (grapeMimBank) {
      harvestTxs.push(await grapeFinance.harvest(grapeMimBank.contract, grapeMimBank.poolId, grapeMimBank.sectionInUI));
    }
    if (wineMimBank) {
      harvestTxs.push(await grapeFinance.harvest(wineMimBank.contract, wineMimBank.poolId, wineMimBank.sectionInUI));
    }
    if (grapeWineBank) {
      harvestTxs.push(await grapeFinance.harvest(grapeWineBank.contract, grapeWineBank.poolId, grapeWineBank.sectionInUI));
    }
    if (grapeBank) {
      harvestTxs.push(await grapeFinance.harvest(grapeBank.contract, grapeBank.poolId, grapeBank.sectionInUI));
    }
    if (wampBank) {
      harvestTxs.push(await grapeFinance.harvest(wampBank.contract, wampBank.poolId, wampBank.sectionInUI));
    }

    // Winery
    if (harvestWinery) {
      harvestTxs.push(await grapeFinance.harvestCashFromBoardroom());
    }

    // Nodes
    if (grapeNodesBank) {
      harvestTxs.push(await grapeFinance.harvest(grapeNodesBank.contract, grapeNodesBank.poolId, grapeNodesBank.sectionInUI));
    }
    if (wineNodesBank) {
      harvestTxs.push(await grapeFinance.harvest(wineNodesBank.contract, wineNodesBank.poolId, wineNodesBank.sectionInUI));
    }
    if (grapeMimSWNodesBank) {
      harvestTxs.push(await grapeFinance.harvest(grapeMimSWNodesBank.contract, grapeMimSWNodesBank.poolId, grapeMimSWNodesBank.sectionInUI));
    }

    await Promise.all(harvestTxs.map((tx) => tx.wait()));

  }, [grapeFinance]);
  return { executeMassClaim: handleMassClaim };
};

export default useMassClaim;
