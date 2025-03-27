import axios from 'axios'
import { getStatus } from './getStatus'
import { getAPIUrlFromConfig, getGithubToken } from './utils/utils'
import { window } from 'vscode'

export const sendStatusToSite = async (startup_time: Date) => {
  const API_URL = getAPIUrlFromConfig()

  if (!API_URL) {
    window.showErrorMessage('API URL not set')
    return
  }

  const githubToken = await getGithubToken()

  const status = getStatus(startup_time)

  try {
    await axios.post(
      API_URL,
      { status },
      {
        headers: {
          Authorization: `Bearer ${githubToken}`,
          'Content-Type': 'application/json',
        },
      }
    )
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 403) {
      window.showErrorMessage(
        'Invalid GitHub token. Cannot send status to site'
      )
    }
  }
}
