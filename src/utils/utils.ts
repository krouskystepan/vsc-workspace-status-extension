import { authentication, workspace } from 'vscode'

export const debounce = <T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | undefined

  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(() => fn(...args), delay)
  }
}

export const getGithubToken = async (): Promise<string | null> => {
  try {
    const session = await authentication.getSession('github', ['read:user'], {
      createIfNone: true
    })
    return session?.accessToken ?? null
  } catch {
    return null
  }
}

export const getAPIUrlFromConfig = (): string | undefined => {
  const config = workspace.getConfiguration()
  return config.get<string>('vscodeWorkspaceStatus.apiUrl')
}
