import * as vscode from 'vscode'
import { debounce } from './utils/utils'
import { sendStatusToSite } from './sendStatus'

export const STARTUP_TIME = new Date()

export const registerListeners = (ctx: vscode.ExtensionContext) => {
  const debouncedSendStatus = debounce(() => {
    sendStatusToSite(STARTUP_TIME)
  }, 500)

  const onActiveEditorChanged = vscode.window.onDidChangeActiveTextEditor(
    () => {
      debouncedSendStatus()
    }
  )

  ctx.subscriptions.push(onActiveEditorChanged)
}

let interval: NodeJS.Timeout

export function activate(ctx: vscode.ExtensionContext) {
  sendStatusToSite(STARTUP_TIME)

  registerListeners(ctx)

  interval = setInterval(() => {
    sendStatusToSite(STARTUP_TIME)
  }, 60 * 1000)
}

export async function deactivate() {
  clearInterval(interval)
}
