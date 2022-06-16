import {useEffect, useState} from 'react';
import {useWallet} from 'use-wallet';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, getDoc, doc } from 'firebase/firestore/lite';
import { toast } from 'react-toastify';
import useGrapeFinance from '../hooks/useGrapeFinance';

const firebaseConfig = {
  apiKey: "AIzaSyAerqWlhAF9fAUS8XMLMqo5Do27DXUqhV0",
  authDomain: "grapefi-dev.firebaseapp.com",
  projectId: "grapefi-dev",
  storageBucket: "grapefi-dev.appspot.com",
  messagingSenderId: "971684120447",
  appId: "1:971684120447:web:83f813dd508ab3ec9cfc4a"
};

const useFetchBadges = () => {
  const {account} = useWallet();
  const grapeFinance = useGrapeFinance();
  const [firebase, setFirebase] = useState(null);
  
  useEffect(() => {
    async function fetchBadges() {
      try {
        console.log('useFetchBadges');
        grapeFinance.unlockableBadges = require('../badges.json'); // Storing Unlockable Badges locally to reduce Firecloud queries
        if (account) {
          const db = getFirestore(initializeApp(firebaseConfig));
          const allUserBadges = await getDocs(collection(doc(collection(db, 'UserBadges'), 'test-wallet'), 'UnlockedBadges'));

          for (let i = 0; i < allUserBadges.docs.length; i++) {
            const badge = allUserBadges.docs[i];
            const badgeData = badge.data();
            const badgeId: String = badge.id;
            console.log('Badge Id = ' + badge.id);
            console.log('Badge Data = ' + JSON.stringify(badgeData, null, 2));
            // grapeFinance.unlockedBadges.set(badge.id, badgeData);
            grapeFinance.totalPointsBadges += grapeFinance.unlockableBadges.get(badgeId).Points;
            toast("🍇 New Badge! 🍷 You've unlocked: '" + badge.id + "'!", {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          }  
          console.log('User Total Points = ' + grapeFinance.totalPointsBadges);        
          setFirebase(db);
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchBadges();
  }, [account]);

  return firebase;
};

export default useFetchBadges;
