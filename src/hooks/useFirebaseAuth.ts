import {useEffect, useState} from 'react';
import {useWallet} from 'use-wallet';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, getDoc, doc } from 'firebase/firestore/lite';

const firebaseConfig = {
  apiKey: "AIzaSyAerqWlhAF9fAUS8XMLMqo5Do27DXUqhV0",
  authDomain: "grapefi-dev.firebaseapp.com",
  projectId: "grapefi-dev",
  storageBucket: "grapefi-dev.appspot.com",
  messagingSenderId: "971684120447",
  appId: "1:971684120447:web:83f813dd508ab3ec9cfc4a"
};

const useFirebaseAuth = () => {
  const {account} = useWallet();
  const [firebase, setFirebase] = useState(null);
  
  useEffect(() => {
    async function fetchFirebaseAuth() {
      try {
        if (account) {
          console.log('fetchFirebaseAuth');
          const db = getFirestore(initializeApp(firebaseConfig));
          const badgeCollection = collection(db, 'AvailableBadges');
          const allBadges = await getDocs(badgeCollection);
          const badgeList = allBadges.docs.map(doc => doc.data());
          console.log('Badges = ', JSON.stringify(badgeList, null, 2));

          const allUserBadges = await getDocs(collection(doc(collection(db, 'UserBadges'), 'test-wallet'), 'UnlockedBadges'));
          const userBadgeList = allUserBadges.docs.map(doc => doc.data());
          console.log('user Badges = ' + JSON.stringify(userBadgeList, null, 2));
          
          setFirebase(db);
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchFirebaseAuth();
  }, [account]);

  return firebase;
};

export default useFirebaseAuth;
