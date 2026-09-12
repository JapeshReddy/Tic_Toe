import { useEffect } from 'react'
import { DELIVERY_PAUSE_MS, DELIVERY_STATES } from '../utils/constants'

// The Delivery's timeline, which is the login card's own business rather than
// the game's. Today it is a single pause standing in for the choreography that
// later tickets fill in; the hook exists now so that the card stays
// presentational and the timeline has one home rather than one per stage.
export function useDelivery(delivery, onArrive) {
  useEffect(() => {
    if (delivery !== DELIVERY_STATES.DELIVERING) return undefined
    const timer = setTimeout(onArrive, DELIVERY_PAUSE_MS)
    return () => clearTimeout(timer)
  }, [delivery, onArrive])
}
