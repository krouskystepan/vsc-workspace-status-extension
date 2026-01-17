import axios from 'axios'
import { window } from 'vscode'
import { getStatus } from './getStatus'
import { hasChanged } from './dedupe'
import { getAPIUrlFromConfig, getGithubToken } from './utils/utils'

export const sendStatusToSite = async (startupTime: Date): Promise<void> => {
  const API_URL = getAPIUrlFromConfig()
  if (!API_URL) {
    return
  }

  const token = await getGithubToken()
  if (!token) {
    return
  }

  const status = getStatus(startupTime)
  if (!hasChanged(status)) {
    return
  }

  try {
    await axios.post(API_URL, status, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
  } catch {
    window.showWarningMessage('Failed to send workspace status')
  }
}
