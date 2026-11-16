'use client'

import { useSyncExternalStore } from 'react'
import { BASE_PATH, getInstallCommands, ORIGIN } from '../site.js'

const subscribe = () => () => {}
const getOrigin = () => ORIGIN || `${window.location.origin}${BASE_PATH}`
const getServerOrigin = () => ORIGIN

export default function useInstallCommands() {
  return getInstallCommands(useSyncExternalStore(subscribe, getOrigin, getServerOrigin))
}
