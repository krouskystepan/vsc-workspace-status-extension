import { window, workspace } from 'vscode'

export const getStatus = (startup_time: Date) => {
  const activeEditor = window.activeTextEditor

  const STATUS = {
    project_name: workspace.name || 'Unknown Project',
    startup_time: startup_time.toISOString(),
    active_file: activeEditor
      ? activeEditor.document.fileName.split('/').pop()
      : 'No Active File',
  }

  return STATUS
}
