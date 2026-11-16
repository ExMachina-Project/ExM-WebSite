'use client'

import CopyCommand from './CopyCommand.jsx'
import useInstallCommands from './useInstallCommands.js'

export default function InstallCommand({ compact = false }) {
  const { unix: command } = useInstallCommands()

  return (
    <div className={`install-command${compact ? ' install-command--compact' : ''}`}>
      <span className="command-prompt" aria-hidden="true">$</span>
      <code>{command}</code>
      <CopyCommand command={command} className="command-copy" />
    </div>
  )
}
