import * as vscode from 'vscode'
import { debounce } from './utils/utils'
import { sendStatusToSite } from './sendStatus'

const IDLE_AFTER = 5 * 60_000 // 5 minutes
const HEARTBEAT = 60_000

let interval: NodeJS.Timeout
let lastInteraction = Date.now()

export function activate(ctx: vscode.ExtensionContext) {
  const markActive = () => {
    lastInteraction = Date.now()
  }

  const send = debounce(() => {
    if (Date.now() - lastInteraction > IDLE_AFTER) {
      return
    }
    sendStatusToSite(getStartupTime(ctx))
  }, 500)

  markActive()
  send()

  ctx.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor(() => {
      markActive()
      send()
    }),
    vscode.workspace.onDidChangeTextDocument(() => {
      markActive()
      send()
    }),
    vscode.window.onDidChangeWindowState(() => {
      markActive()
      send()
    })
  )

  interval = setInterval(() => {
    if (Date.now() - lastInteraction > IDLE_AFTER) {
      return
    }
    sendStatusToSite(getStartupTime(ctx))
  }, HEARTBEAT)
}

export function deactivate() {
  clearInterval(interval)
}

const STARTUP_TIME_KEY = 'workspaceStatus.startupTime'

function getStartupTime(ctx: vscode.ExtensionContext): Date {
  const stored = ctx.globalState.get<string>(STARTUP_TIME_KEY)
  if (stored) {
    return new Date(stored)
  }

  const now = new Date()
  ctx.globalState.update(STARTUP_TIME_KEY, now.toISOString())
  return now
}
