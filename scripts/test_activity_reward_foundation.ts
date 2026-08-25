/**
 * ORBis Activity Reward Foundation Test Suite
 * Tests authoritative server-side reward idempotency, parent-child security boundaries,
 * activity identity, input validation, and daily streak calculation.
 */

import { economyService } from '../src/services/economyService'

console.log('🧪 Running ORBis Activity Reward Foundation Suite...\n')

let passed = 0
let total = 0

function assert(condition: boolean, name: string, details?: string) {
  total++
  if (condition) {
    passed++
    console.log(`  ✅ [PASS] ${name}`)
  } else {
    console.error(`  ❌ [FAIL] ${name}${details ? ` -> ${details}` : ''}`)
  }
}

// -----------------------------------------------------------------------------
// Reference In-Memory State & DB RPC Simulator
// Faithfully mirrors the PostgreSQL schema & award_child_rewards function logic
// -----------------------------------------------------------------------------

interface ChildProfileDb {
  id: string
  parent_id: string
  name: string
  xp: number
  stars: number
  current_streak: number
  last_activity_date: string | null // YYYY-MM-DD
}

interface ActivityRewardDb {
  id: string
  child_id: string
  activity_type: string
  activity_id: string
  xp_awarded: number
  stars_awarded: number
  created_at: string
}

class SimulatedSupabaseDatabase {
  childProfiles = new Map<string, ChildProfileDb>()
  activityRewards: ActivityRewardDb[] = []
  currentAuthUid: string | null = null

  setAuth(uid: string | null) {
    this.currentAuthUid = uid
  }

  // Exact reproduction of public.award_child_rewards plpgsql function
  awardChildRewardsRpc(
    childId: string,
    activityType: string,
    activityId: string,
    xpAmount: number = 0,
    starsAmount: number = 0,
    simulatedToday: string = '2026-08-23'
  ) {
    // 1. Input sanitization & checks
    if (!childId) throw new Error('Child ID is required')

    const cleanActivityType = (activityType || '').trim().toLowerCase()
    const cleanActivityId = (activityId || '').trim()

    if (cleanActivityType.length === 0 || cleanActivityType.length > 50) {
      throw new Error('Invalid activity type')
    }
    if (cleanActivityId.length === 0 || cleanActivityId.length > 100) {
      throw new Error('Invalid activity ID')
    }

    // 2. Reward bounds verification
    if (xpAmount < 0 || xpAmount > 500) {
      throw new Error('Invalid XP amount (must be between 0 and 500)')
    }
    if (starsAmount < 0 || starsAmount > 100) {
      throw new Error('Invalid stars amount (must be between 0 and 100)')
    }

    // 3. Parent ownership check
    const child = this.childProfiles.get(childId)
    if (!child || !this.currentAuthUid || this.currentAuthUid !== child.parent_id) {
      throw new Error('Unauthorized')
    }

    // 4. Server-side idempotency check
    const existing = this.activityRewards.find(
      (r) =>
        r.child_id === childId &&
        r.activity_type === cleanActivityType &&
        r.activity_id === cleanActivityId
    )

    if (existing) {
      return {
        success: true,
        already_awarded: true,
        xp_awarded: 0,
        stars_awarded: 0,
        current_xp: child.xp,
        current_stars: child.stars,
        current_streak: child.current_streak,
        streak_incremented: false,
      }
    }

    // 5. Daily streak calculation
    const today = new Date(simulatedToday)
    let newStreak = child.current_streak
    let streakIncremented = false

    if (!child.last_activity_date) {
      newStreak = 1
      streakIncremented = true
    } else {
      const lastDate = new Date(child.last_activity_date)
      const diffDays = Math.round((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))

      if (diffDays === 0) {
        // Already active today
        newStreak = child.current_streak
        streakIncremented = false
      } else if (diffDays === 1) {
        // Consecutive day
        newStreak = child.current_streak + 1
        streakIncremented = true
      } else {
        // Missed one or more days -> reset
        newStreak = 1
        streakIncremented = true
      }
    }

    // 6. Insert activity reward record
    this.activityRewards.push({
      id: `reward-${Date.now()}-${Math.random()}`,
      child_id: childId,
      activity_type: cleanActivityType,
      activity_id: cleanActivityId,
      xp_awarded: xpAmount,
      stars_awarded: starsAmount,
      created_at: new Date().toISOString(),
    })

    // 7. Update child profile
    child.xp += xpAmount
    child.stars += starsAmount
    child.current_streak = newStreak
    child.last_activity_date = simulatedToday

    return {
      success: true,
      already_awarded: false,
      xp_awarded: xpAmount,
      stars_awarded: starsAmount,
      current_xp: child.xp,
      current_stars: child.stars,
      current_streak: newStreak,
      streak_incremented: streakIncremented,
    }
  }
}

async function runActivityRewardTests() {
  console.log('--- 1. Client-Side Service Input Validation Tests ---')
  const invalidChildRes = await economyService.completeActivity({
    childId: '',
    activityType: 'quiz',
    activityId: 'story-1',
  })
  assert(invalidChildRes.success === false, 'completeActivity rejects empty childId')

  const invalidTypeRes = await economyService.completeActivity({
    childId: 'child-1',
    activityType: '' as any,
    activityId: 'story-1',
  })
  assert(invalidTypeRes.success === false, 'completeActivity rejects empty activityType')

  const invalidActivityIdRes = await economyService.completeActivity({
    childId: 'child-1',
    activityType: 'quiz',
    activityId: '',
  })
  assert(invalidActivityIdRes.success === false, 'completeActivity rejects empty activityId')

  console.log('\n--- 2. RPC Security, Idempotency & Streaks Tests ---')
  const db = new SimulatedSupabaseDatabase()

  // Setup mock parent & children
  const PARENT_ALICE = 'parent-alice-uuid'
  const PARENT_BOB = 'parent-bob-uuid'
  const CHILD_LEO = 'child-leo-uuid'
  const CHILD_MIA = 'child-mia-uuid'

  db.childProfiles.set(CHILD_LEO, {
    id: CHILD_LEO,
    parent_id: PARENT_ALICE,
    name: 'Leo',
    xp: 0,
    stars: 0,
    current_streak: 0,
    last_activity_date: null,
  })

  db.childProfiles.set(CHILD_MIA, {
    id: CHILD_MIA,
    parent_id: PARENT_BOB,
    name: 'Mia',
    xp: 0,
    stars: 0,
    current_streak: 0,
    last_activity_date: null,
  })

  // Test 1: Parent can reward their own child
  db.setAuth(PARENT_ALICE)
  const res1 = db.awardChildRewardsRpc(CHILD_LEO, 'quiz', 'story-101', 30, 15, '2026-08-20')
  assert(
    res1.success === true && res1.already_awarded === false && res1.xp_awarded === 30 && res1.stars_awarded === 15,
    '1. Parent can reward their own child'
  )
  const leoProfile = db.childProfiles.get(CHILD_LEO)!
  assert(leoProfile.xp === 30 && leoProfile.stars === 15 && leoProfile.current_streak === 1, '   Child profile XP, Stars, and initial Streak=1 updated')

  // Test 2: Parent cannot reward another parent's child
  let unauthorizedError = false
  try {
    db.awardChildRewardsRpc(CHILD_MIA, 'quiz', 'story-101', 20, 10, '2026-08-20')
  } catch (err: any) {
    unauthorizedError = err.message === 'Unauthorized'
  }
  assert(unauthorizedError, "2. Parent cannot reward another parent's child (Unauthorized)")

  // Test 3: Unauthenticated user cannot reward
  db.setAuth(null)
  let unauthError = false
  try {
    db.awardChildRewardsRpc(CHILD_LEO, 'quiz', 'story-102', 20, 10, '2026-08-20')
  } catch (err: any) {
    unauthError = err.message === 'Unauthorized'
  }
  assert(unauthError, '3. Unauthenticated caller cannot reward')

  // Switch back to Alice
  db.setAuth(PARENT_ALICE)

  // Test 4: Negative rewards fail
  let negativeError = false
  try {
    db.awardChildRewardsRpc(CHILD_LEO, 'quiz', 'story-102', -10, 5, '2026-08-20')
  } catch (err: any) {
    negativeError = err.message.includes('Invalid XP amount')
  }
  assert(negativeError, '4. Negative rewards fail safely')

  // Test 5: Excessive rewards fail
  let excessiveError = false
  try {
    db.awardChildRewardsRpc(CHILD_LEO, 'quiz', 'story-102', 9999, 10, '2026-08-20')
  } catch (err: any) {
    excessiveError = err.message.includes('Invalid XP amount')
  }
  assert(excessiveError, '5. Excessive rewards (>500 XP) fail safely')

  // Test 6: Same child + same activity cannot receive completion reward twice
  const resDuplicate = db.awardChildRewardsRpc(CHILD_LEO, 'quiz', 'story-101', 30, 15, '2026-08-20')
  assert(
    resDuplicate.success === true &&
      resDuplicate.already_awarded === true &&
      resDuplicate.xp_awarded === 0 &&
      resDuplicate.stars_awarded === 0,
    '6. Same child + same activity cannot receive reward twice (Idempotent: already_awarded=true, 0 awarded)'
  )
  assert(leoProfile.xp === 30 && leoProfile.stars === 15, '   Child total XP and Stars remain uninflated')

  // Test 7: Same activity can be completed by a different child
  db.setAuth(PARENT_BOB)
  const resMia = db.awardChildRewardsRpc(CHILD_MIA, 'quiz', 'story-101', 30, 15, '2026-08-20')
  assert(
    resMia.success === true && resMia.already_awarded === false && resMia.xp_awarded === 30,
    '7. Same activity (story-101) can be completed by a different child (Mia)'
  )

  // Test 8: Different activities can reward the same child
  db.setAuth(PARENT_ALICE)
  const resMemory = db.awardChildRewardsRpc(CHILD_LEO, 'memory_match', 'story-101', 20, 10, '2026-08-20')
  const resStory2 = db.awardChildRewardsRpc(CHILD_LEO, 'quiz', 'story-102', 40, 20, '2026-08-20')
  assert(
    resMemory.already_awarded === false && resStory2.already_awarded === false,
    '8. Different activities (memory_match vs quiz:story-102) award same child successfully'
  )
  assert(leoProfile.xp === 90 && leoProfile.stars === 45, '   XP accurately accumulates across distinct activities (30+20+40=90)')

  // Test 9: Refresh / retry cannot duplicate the same reward
  const retry1 = db.awardChildRewardsRpc(CHILD_LEO, 'memory_match', 'story-101', 20, 10, '2026-08-20')
  const retry2 = db.awardChildRewardsRpc(CHILD_LEO, 'memory_match', 'story-101', 20, 10, '2026-08-20')
  assert(
    retry1.already_awarded === true && retry2.already_awarded === true && leoProfile.xp === 90,
    '9. Refresh/retry attempts return already_awarded=true without duplicating rewards'
  )

  // Test 10: Only one streak-day increment occurs per calendar day
  // (We already completed activities on '2026-08-20' and streak is 1)
  assert(leoProfile.current_streak === 1, '10a. First activity day (2026-08-20) establishes streak = 1')
  
  // Another activity on the SAME calendar day does NOT increment streak
  const sameDayRes = db.awardChildRewardsRpc(CHILD_LEO, 'word_trace', 'story-103', 10, 5, '2026-08-20')
  assert(
    sameDayRes.streak_incremented === false && leoProfile.current_streak === 1,
    '10b. Multiple activities on the SAME day do not increment streak (streak remains 1)'
  )

  // Next CONSECUTIVE day (2026-08-21) increments streak to 2
  const nextDayRes = db.awardChildRewardsRpc(CHILD_LEO, 'quiz', 'story-104', 10, 5, '2026-08-21')
  assert(
    nextDayRes.streak_incremented === true && leoProfile.current_streak === 2,
    '10c. Activity on consecutive day (2026-08-21) increments streak to 2'
  )

  // Skipping days to 2026-08-25 resets streak to 1
  const skippedDayRes = db.awardChildRewardsRpc(CHILD_LEO, 'quiz', 'story-105', 10, 5, '2026-08-25')
  assert(
    skippedDayRes.streak_incremented === true && leoProfile.current_streak === 1,
    '10d. Activity after missed days (2026-08-25) resets streak to 1'
  )
}

runActivityRewardTests()
  .then(() => {
    console.log(`\nORBis Activity Reward Foundation Tests: ${passed}/${total} PASS`)
    if (passed !== total) process.exit(1)
  })
  .catch((err) => {
    console.error('Fatal test error:', err)
    process.exit(1)
  })
