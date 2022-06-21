import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, increment, setDoc, doc, DocumentData, Timestamp, Firestore, getDoc, DocumentReference, DocumentSnapshot } from 'firebase/firestore/lite';
import { toast } from 'react-toastify';
import generalBadges from '../badges-general.json';
import nodesBadges from '../badges-nodes.json';
import wineryBadges from '../badges-winery.json';
import vineyardBadges from '../badges-vineyard.json';
import bondsBadges from '../badges-bonds.json';

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

  // Fetching the right json file based on category. If new file is created: 
  // Add new import
  // update condition to fetch new file below
  getBadges(category: string, contract: string, action: string, count: number): Array<any> {

    // Simple filtering
    if (category === 'General') {
      return generalBadges && generalBadges.filter(badge => badge.action === action)
    }

    let categoryBadges;
    if (category === 'Nodes') {
      categoryBadges = nodesBadges
    }
    else if (category === 'Winery') {
      categoryBadges = wineryBadges
    }
    else if (category === 'Vineyard') {
      categoryBadges = vineyardBadges
    }
    else if (category === 'Bonds') {
      categoryBadges = bondsBadges
    }
    return categoryBadges && categoryBadges.filter(badge => badge.contract === contract && badge.action === action && badge.requiredCount <= count)
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
        this.totalPointsBadges += badgeData.points;
      });
    }
  }

  // Verifies if the action is a valid requirement for any unlockable badges
  async badgeProgressForAction(category: string, contract: string, action: string, count: number) {
    console.log('%c[addProgressOnBadge] Contract: ' + contract + ', Action: ' + action + ', Count = ' + count, 'color: blue')

    // Verify if action is a badge's requirement
    const badges = this.getBadges(category, contract, action, count)
    if (!badges || !badges.length) {
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

      if (this.shouldContinueProgressBadge(badge, isBadgeInProgress, action, count, badgeProgress)) {
        // Create or update the existing progress
        await this.addProgressForBadge(badgeProgressRef, badge, action, isBadgeInProgress, count)
        // Once progress is added, check requirements to unlock badge
        this.checkRequirementsForBadge(action, badge, badgeProgressRef)
      }
    }
  }

  async addProgressForBadge(badgeProgressRef: DocumentReference<DocumentData>, badge: any, action: string, isBadgeInProgress: boolean, count: number) {
    await setDoc(badgeProgressRef, { count: count ? Number(count) : increment(1), date: Timestamp.fromDate(new Date()) }, { merge: isBadgeInProgress })
    const logMsg = `UserProgress/${this.wallet}/${badge.name}/${action} and merge with existing = ${isBadgeInProgress}`
    console.log('%c[addProgressOnBadge] Added progress: ' + logMsg, 'color: blue')
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

    // Need to reload to have the latest progress udpates
    const badgeProgress = await getDoc(badgeProgressRef)
    console.log('%c[checkRequirementsForBadge] ' + badge.name + ' - Current count = ' + badgeProgress.data().count, 'color: blue')
    console.log('%c[checkRequirementsForBadge] Badge required counts: ' + badge.requiredCount, 'color: blue')
    if (badgeProgress.data().count >= badge.requiredCount) {
      // Unlocking Badge
      const newBadgeRef = doc(this.db, "UserBadges", this.wallet, 'UnlockedBadges', badge.name)
      await setDoc(newBadgeRef, {
        date: Timestamp.fromDate(new Date()), 
        points: badge.points
      })
      console.log('%c[checkRequirementsForBadge] ' + badge.name + ' - Unlocked badge! Created the new UnlockedBadge record.', 'color: green')

      this.totalPointsBadges += badge.points

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

  shouldContinueProgressBadge(badge: any, isBadgeInProgress: boolean, action: string, count: number, badgeProgress: DocumentSnapshot<DocumentData>): boolean {
    // If badge is in progress and progress count is the same than current count, no need to add progress
    if (isBadgeInProgress && action === 'Count' && 
        (count && Number(badgeProgress.data().count) === Number(count))) {
      console.log('%c[addProgressOnBadge] Count is the same. Continue to next', 'color: red')
      return false;
    }

    // If badge is in progress, use timeBetweenCountsInMinutes to verify time between now and latest progress update
    if (isBadgeInProgress && badgeProgress.data().date && 
        !this.checkTimeBetweenProgress(badge, badgeProgress.data().date.seconds)) {
      console.log('%c[addProgressOnBadge] Too soon to log a new Progress for this action. Continue to next', 'color: red')
      return false;
    }
    return true;
  }

  // Verifies if requirement requires time between the same action, then verifies delay between actions
  checkTimeBetweenProgress(badge: any, lastProgressTimestamp: number) {

    if (badge.requiredCount > 1) {
        const lastProgressDate = new Date(lastProgressTimestamp * 1000);
        console.log('%c[addProgressOnBadge] Last Progress Date: ' + lastProgressDate, 'color: blue')

        let diffMinutes = (Date.now() - lastProgressDate.getTime()) / 1000;
        diffMinutes = Math.abs(Math.round(diffMinutes /= 60));
        console.log('%c[addProgressOnBadge] Minutes between the 2 dates: ' + diffMinutes, 'color: blue')
        console.log('%c[addProgressOnBadge] Badge Minutes required between actions: ' + badge.timeBetweenCountsInMinutes, 'color: blue')
        if (diffMinutes < badge.timeBetweenCountsInMinutes) {
          return false;
        }
      }
    return true;
  }
}

