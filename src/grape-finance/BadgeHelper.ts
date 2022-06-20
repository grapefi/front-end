import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, increment, setDoc, doc, DocumentData, Timestamp, Firestore, getDoc, DocumentReference } from 'firebase/firestore/lite';
import { toast } from 'react-toastify';
import allBadges from '../badges.json';

const firebaseConfig = {
  apiKey: "AIzaSyAerqWlhAF9fAUS8XMLMqo5Do27DXUqhV0",
  authDomain: "grapefi-dev.firebaseapp.com",
  projectId: "grapefi-dev",
  storageBucket: "grapefi-dev.appspot.com",
  messagingSenderId: "971684120447",
  appId: "1:971684120447:web:83f813dd508ab3ec9cfc4a"
};

export class BadgeHelper {
  wallet: string;
  unlockedBadges: Map<String, DocumentData>;
  totalPointsBadges: number = 0;
  db: Firestore;

  constructor(wallet: string) {
    this.wallet = wallet
    this.db = getFirestore(initializeApp(firebaseConfig))
    this.fetchUnlockedBadges()
  }

  // Init firecloud and wallet's total points by reading unlocked badges
  async fetchUnlockedBadges() {
    const allUserBadges = await getDocs(collection(doc(collection(this.db, 'UserBadges'), this.wallet), 'UnlockedBadges'));
    if (allUserBadges && !allUserBadges.empty) {
      this.unlockedBadges = new Map<String, DocumentData>();
      allUserBadges.forEach((doc) => {
        const badgeData = doc.data();
        this.unlockedBadges.set(doc.id, badgeData);
        // Calculating wallet's total points
        const badge = allBadges.find(badge => badge.name === doc.id);
        this.totalPointsBadges += badge ? badge.points : 0;
      });
    }
  }

  // Verifies if the action is a valid requirement for any unlockable badges
  async badgeProgressForAction(contract: string, action: string, count: number) {
    console.log('%c[addProgressOnBadge] Contract: ' + contract + ', Action: ' + action, 'color: blue')

    // Verify if action is a badge's requirement
    const badges = allBadges.filter(badge => badge.contract === contract && badge.actions?.includes(action))
    if (!badges.length) {
      console.log('%c[addProgressOnBadge] No local unlockable badge found for this action. Continue to next', 'color: red')
      return
    }

    console.log('%c[addProgressOnBadge] Found ' + badges.length + ' badge(s) for ' + action, 'color: blue')
    for (let i = 0; i < badges.length; i++) {
      const badge = badges[i]
      console.log('%c[addProgressOnBadge] (index ' + i + ') -- Badge "' + badge.name + '"', 'color: blue')
      // If user already has this badge, no need to perform logic, move on 
      if (await this.walletHasBadge(badge)) {
        console.log('%c[addProgressOnBadge] User already unlocked this badge. Continue to next', 'color: red')
        continue
      }

      // Searches for wallet's badge progress
      const badgeProgressRef = doc(this.db, "UserProgress", this.wallet, badge.name, action)
      const badgeProgress = await getDoc(badgeProgressRef)
      const isBadgeInProgress = badgeProgress && badgeProgress.exists()

      // If badge is in progress, use timeBetweenCountsInMinutes to verify time between now and latest progress update
      if (isBadgeInProgress && 
          badgeProgress.data().date && 
          !this.checkTimeBetweenProgress(badge, action, badgeProgress.data().date.seconds)) {
        console.log('%c[addProgressOnBadge] Too soon to log a new Progress for this action. Continue to next', 'color: red')
        continue
      }

      // Create or update the existing progress
      await this.addProgressForBadge(badgeProgressRef, badge, action, isBadgeInProgress, count)

      this.checkRequirementsForBadge(action, badge, badgeProgressRef)
    }
  }

  async addProgressForBadge(badgeProgressRef: DocumentReference<DocumentData>, badge: any, action: string, isBadgeInProgress: boolean, count: number) {
    await setDoc(badgeProgressRef, { count: count ? count : increment(1), date: Timestamp.fromDate(new Date()) }, { merge: isBadgeInProgress })
    console.log('%c[addProgressOnBadge] Added progress: ' + `UserProgress/${this.wallet}/${badge.name}/${action} and merge with existing = ${isBadgeInProgress}`, 'color: blue')
  }

  // Verifies if the wallet already unlocked a given badge
  async walletHasBadge(badge: any) {
    const unlockedBadgeRef = doc(this.db, "UserBadges", this.wallet, 'UnlockedBadges', badge.name);
    const unlockedBadge = await getDoc(unlockedBadgeRef);
    return unlockedBadge && unlockedBadge.exists()
  }

  // Reads the local badge's requirement and verifies if the newly added action allows the user to unlock the badge
  async checkRequirementsForBadge(action: string, badge: any, badgeProgressRef: DocumentReference<DocumentData>) {
    console.log('%c[checkRequirementsForBadge] ' + badge.name + ' - Action ' + action, 'color: blue');
    const currentActionIndex = badge.actions.indexOf(action)
    const requiredCountForCurrentAction = badge.counts[currentActionIndex];

    // Need to reload to have the latest progress udpates
    const badgeProgress = await getDoc(badgeProgressRef)
    console.log('%c[checkRequirementsForBadge] ' + badge.name + ' - Current count = ' + badgeProgress.data().count, 'color: blue')
    console.log('%c[checkRequirementsForBadge] Badge required counts: ' + requiredCountForCurrentAction, 'color: blue')
    if (badgeProgress.data().count >= requiredCountForCurrentAction) {
      // Unlocking Badge
      const newBadgeRef = doc(this.db, "UserBadges", this.wallet, 'UnlockedBadges', badge.name)
      await setDoc(newBadgeRef, {
        date: Timestamp.fromDate(new Date())
      })
      console.log('%c[checkRequirementsForBadge] ' + badge.name + ' - Unlocked badge! Created the new UnlockedBadge record.', 'color: green')

      // Displaying Toast Notification
      toast(`${badge.unlockMessage}. You earned ${badge.points} points.`, {
        position: "top-right",
        autoClose: 7000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  }

  // Verifies if requirement requires time between the same action, then verifies delay between actions
  checkTimeBetweenProgress(badge: any, action: string, lastProgressTimestamp: number) {
    const requirementIndexForAction = badge.actions.indexOf(action);
      if (badge.counts[requirementIndexForAction] > 1) {
        const lastProgressDate = new Date(lastProgressTimestamp * 1000);
        console.log('%c[addProgressOnBadge] Last Progress Date: ' + lastProgressDate, 'color: blue')

        let diffMinutes = (Date.now() - lastProgressDate.getTime()) / 1000;
        diffMinutes = Math.abs(Math.round(diffMinutes /= 60));
        console.log('%c[addProgressOnBadge] Minutes between the 2 dates: ' + diffMinutes, 'color: blue')
        console.log('%c[addProgressOnBadge] Badge Minutes required between actions: ' + badge.timeBetweenCountsInMinutes[requirementIndexForAction], 'color: blue')
        if (diffMinutes < badge.timeBetweenCountsInMinutes[requirementIndexForAction]) {
          return false;
        }
      }
    return true;
  }
}

