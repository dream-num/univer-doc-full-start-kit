import { LocaleType, Tools } from '@univerjs/core'
import UniverDesignEnUS from '@univerjs/design/locale/en-US'
import UniverDocsUIEnUS from '@univerjs/docs-ui/locale/en-US'
import UniverSheetsEnUS from '@univerjs/sheets/locale/en-US'
import UniverSheetsUIEnUS from '@univerjs/sheets-ui/locale/en-US'
import UniverUiEnUS from '@univerjs/ui/locale/en-US'
import DocsHyperLinkUIEnUS from '@univerjs/docs-hyper-link-ui/locale/en-US'
import DrawingUIEnUS from '@univerjs/drawing-ui/locale/en-US'
import DocsDrawingUIEnUS from '@univerjs/docs-drawing-ui/locale/en-US'
import CollaborationClientEnUS from '@univerjs-pro/collaboration-client/locale/en-US'
import UniverThreadCommentUiEnUs from '@univerjs/thread-comment-ui/locale/en-US'

export const locales = {
  [LocaleType.EN_US]: Tools.deepMerge(
    UniverSheetsEnUS,
    UniverDocsUIEnUS,
    UniverSheetsUIEnUS,
    UniverUiEnUS,
    UniverDesignEnUS,
    DocsHyperLinkUIEnUS,
    DrawingUIEnUS,
    DocsDrawingUIEnUS,
    CollaborationClientEnUS,
    UniverThreadCommentUiEnUs,
  ),
}
