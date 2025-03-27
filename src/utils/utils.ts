import { authentication, workspace } from 'vscode'

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => Promise<ReturnType<T> | undefined>) => {
  let timeoutId: ReturnType<typeof setTimeout>

  return (...args: Parameters<T>): Promise<ReturnType<T> | undefined> => {
    clearTimeout(timeoutId)
    return new Promise((resolve) => {
      timeoutId = setTimeout(() => {
        const result = func(...args)
        resolve(result)
      }, delay)
    })
  }
}

export const getGithubToken = async (): Promise<string | null> => {
  try {
    const session = await authentication.getSession('github', ['read:user'], {
      createIfNone: true,
    })
    return session?.accessToken ?? null
  } catch (error) {
    console.error('Chyba při získávání GitHub tokenu:', error)
    return null
  }
}

export const getAPIUrlFromConfig = () => {
  const config = workspace.getConfiguration()
  return config.get<string>('vscodeWorkspaceStatus.apiUrl')
}
