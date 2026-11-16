'use client'

import CopyCommand from './CopyCommand'
import useInstallCommands from './useInstallCommands'

interface InstallCommandProps {
  compact?: boolean
}

export default function InstallCommand({ compact = false }: InstallCommandProps) {
  const { unix: command } = useInstallCommands()

  return (
    <div className={`install-command${compact ? ' install-command--compact' : ''}`}>
      <span className="command-prompt" aria-hidden="true">$</span>
      <code>{command}</code>
      <CopyCommand command={command} className="command-copy" />
    </div>
  )
}
