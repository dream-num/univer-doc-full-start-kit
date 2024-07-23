import '@univerjs/design/lib/index.css'
import '@univerjs/ui/lib/index.css'
import '@univerjs/docs-hyper-link-ui/lib/index.css'
import '@univerjs/drawing-ui/lib/index.css'
import '@univerjs/docs-drawing-ui/lib/index.css'
import '@univerjs-pro/collaboration-client/lib/index.css'

import { IConfigService, IUndoRedoService, LocaleType, LogLevel, Univer, UniverInstanceType } from '@univerjs/core'
import { defaultTheme } from '@univerjs/design'
import { UniverDocsPlugin } from '@univerjs/docs'
import { UniverDocsUIPlugin } from '@univerjs/docs-ui'
import { UniverFormulaEnginePlugin } from '@univerjs/engine-formula'
import { UniverRenderEnginePlugin } from '@univerjs/engine-render'
import { UniverUIPlugin } from '@univerjs/ui'
import { UniverDocsHyperLinkPlugin } from '@univerjs/docs-hyper-link'
import { UniverDocsHyperLinkUIPlugin } from '@univerjs/docs-hyper-link-ui'
import { IImageIoService, UniverDrawingPlugin } from '@univerjs/drawing'
import { UniverDrawingUIPlugin } from '@univerjs/drawing-ui'
import { UniverDocsDrawingPlugin } from '@univerjs/docs-drawing'
import { UniverDocsDrawingUIPlugin } from '@univerjs/docs-drawing-ui'
import { UniverCollaborationPlugin } from '@univerjs-pro/collaboration'
import { COLLAB_SUBMIT_CHANGESET_URL_KEY, COLLAB_WEB_SOCKET_URL_KEY, SEND_CHANGESET_TIMEOUT_KEY, SNAPSHOT_SERVER_URL_KEY, UniverCollaborationClientPlugin } from '@univerjs-pro/collaboration-client'

import { FUniver } from '@univerjs/facade'
import { locales } from './locale'

export function setupUniver() {
  const univer = new Univer({
    theme: defaultTheme,
    locale: LocaleType.EN_US,
    logLevel: LogLevel.VERBOSE,
    locales,
    override: [
      [IUndoRedoService, null], // collaboration plugin will provide undo/redo service
    ],
  })

  // core plugins
  univer.registerPlugin(UniverRenderEnginePlugin)
  univer.registerPlugin(UniverFormulaEnginePlugin)
  univer.registerPlugin(UniverUIPlugin, {
    container: 'univer',
    footer: false,
  })
  univer.registerPlugin(UniverDocsPlugin)
  univer.registerPlugin(UniverDocsUIPlugin, {
    container: 'univerdoc',
    layout: {
      docContainerConfig: {
        innerLeft: false,
      },
    },
  })

  // hyper link plugins
  univer.registerPlugin(UniverDocsHyperLinkPlugin)
  univer.registerPlugin(UniverDocsHyperLinkUIPlugin)

  // drawing plugins
  univer.registerPlugin(UniverDrawingPlugin, {
    override: [[IImageIoService, null]], // DocsDrawingPlugin will provide image io service
  })
  univer.registerPlugin(UniverDrawingUIPlugin)
  univer.registerPlugin(UniverDocsDrawingPlugin)
  univer.registerPlugin(UniverDocsDrawingUIPlugin)

  const configService = univer.__getInjector().get(IConfigService)
  const host = window.location.host
  configService.setConfig(SNAPSHOT_SERVER_URL_KEY, `/universer-api/snapshot`)
  configService.setConfig(COLLAB_SUBMIT_CHANGESET_URL_KEY, `/universer-api/comb`)
  configService.setConfig(COLLAB_WEB_SOCKET_URL_KEY, `ws://${host}/universer-api/comb/connect`)
  configService.setConfig(SEND_CHANGESET_TIMEOUT_KEY, 200) // 200ms

  univer.registerPlugin(UniverCollaborationPlugin)
  univer.registerPlugin(UniverCollaborationClientPlugin, {
    enableOfflineEditing: true,
    enableSingleActiveInstanceLock: true,
    collaborationUniverTypes: [UniverInstanceType.UNIVER_DOC],
    enableAuthServer: true,
  })

  const url = new URL(window.location.href)
  const unit = url.searchParams.get('unit')

  if (unit) {
    // do nothing, wait for the unit to be loaded
  }
  else {
    fetch(`/universer-api/snapshot/${UniverInstanceType.UNIVER_DOC}/unit/-/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: UniverInstanceType.UNIVER_DOC,
        name: 'New Doc By Univer',
        creator: 'user',
      }),
    })

      .then((res) => {
        if (!res.ok)
          throw new Error('create unit failed')
        return res.json()
      })
      .then((res) => {
        if (!res.unitID)
          throw new Error('create unit failed')

        url.searchParams.set('unit', res.unitID)
        url.searchParams.set('type', String(UniverInstanceType.UNIVER_DOC))
        window.location.href = url.toString()
      })
      .catch((error) => {
        console.error(error)
      })
  }

  const univerAPI = FUniver.newAPI(univer)

  // univerAPI.getActiveDocument()?.appendText('Hello World!')

  return univerAPI
}
