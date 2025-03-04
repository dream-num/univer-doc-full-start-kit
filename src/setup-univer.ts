import { LocaleType, UniverInstanceType, createUniver, defaultTheme, merge } from '@univerjs/presets'

import { UniverDocsCollaborationPreset } from '@univerjs/presets/preset-docs-collaboration'
import docsCollaborationZhCN from '@univerjs/presets/preset-docs-collaboration/locales/zh-CN'

import { UniverDocsCorePreset } from '@univerjs/presets/preset-docs-core'
import docsCoreZhCN from '@univerjs/presets/preset-docs-core/locales/zh-CN'

import { UniverDocsDrawingPreset } from '@univerjs/presets/preset-docs-drawing'
import docsDrawingZhCN from '@univerjs/presets/preset-docs-drawing/locales/zh-CN'

import '@univerjs/presets/lib/styles/preset-docs-core.css'
import '@univerjs/presets/lib/styles/preset-docs-collaboration.css'
import '@univerjs/presets/lib/styles/preset-docs-drawing.css'

export function setupUniver() {
  const { univerAPI } = createUniver({
    locale: LocaleType.ZH_CN,
    locales: {
      zhCN: merge(
        {},
        docsCoreZhCN,
        docsCollaborationZhCN,
        docsDrawingZhCN,
      ),
    },
    theme: defaultTheme,
    collaboration: true,
    presets: [
      UniverDocsCorePreset({
        container: 'univer',
        collaboration: true,
      }),
      UniverDocsCollaborationPreset(),
      UniverDocsDrawingPreset({ collaboration: true }),
    ],
  })

  // check if the unit is already created
  const url = new URL(window.location.href)
  const unit = url.searchParams.get('unit')
  if (unit) {
  // waiting for the unit to be loaded
  }
  else {
    fetch(`/universer-api/snapshot/${UniverInstanceType.UNIVER_DOC}/unit/-/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: UniverInstanceType.UNIVER_DOC,
        name: 'New Sheet By Univer',
        creator: 'user',
      }),
    })
      .then((response) => {
        if (!response.ok)
          throw new Error('Failed to create new sheet')

        return response.json()
      })
      .then((data) => {
        if (!data.unitID)
          throw new Error('create unit failed')

        url.searchParams.set('unit', data.unitID)
        url.searchParams.set('type', String(UniverInstanceType.UNIVER_DOC))
        window.location.href = url.toString()
      })
      .catch((error) => {
        console.error(error)
      })
  }

  return univerAPI
}
