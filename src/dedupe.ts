import { WorkspaceStatus } from './types'

let lastHash: string | null = null

export const hasChanged = (status: WorkspaceStatus): boolean => {
  const hash = JSON.stringify({
    projectName: status.projectName,
    activeFile: status.activeFile,
    languageId: status.languageId
  })

  if (hash === lastHash) {
    return false
  }

  lastHash = hash
  return true
}
