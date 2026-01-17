import { window, workspace } from 'vscode'
import { WorkspaceStatus } from './types'

export const getStatus = (startupTime: Date): WorkspaceStatus => {
  const editor = window.activeTextEditor

  return {
    projectName: workspace.name ?? 'unknown',
    startupTime: startupTime.toISOString(),
    activeFile: editor
      ? (editor.document.fileName.split('/').pop() ?? null)
      : null,
    languageId: editor ? editor.document.languageId : null,
    lastUpdate: new Date().toISOString()
  }
}
