'use client'

import { useSyncExternalStore } from 'react'
import { BASE_PATH, getInstallCommands, ORIGIN } from '../site'
import type { InstallCommands } from '../site'

const subscribe = () => () => {}
const getOrigin = () => ORIGIN || `${window.location.origin}${BASE_PATH}`
const getServerOrigin = () => ORIGIN

export default function useInstallCommands(): InstallCommands {
  return getInstallCommands(useSyncExternalStore(subscribe, getOrigin, getServerOrigin))
}
