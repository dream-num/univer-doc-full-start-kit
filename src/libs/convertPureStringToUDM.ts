import type { IDocumentBody } from '@univerjs/core'

const UNIVER_PARAGRAPH_END_SYMBOL = '\r'
const UNIVER_SECTION_END_SYMBOL = '\n'

/**
 * convert pure string to UMD (Univer Document Model)
 * @param text
 * @returns
 */
export function convertPureStringToUDM(text: string): IDocumentBody {
  if (!text)
    return emptyUDM()

  let preText = text

  if (preText.includes('\n'))
    preText = preText.replace(/\n/g, UNIVER_PARAGRAPH_END_SYMBOL)

  if (preText[text.length - 1] !== UNIVER_SECTION_END_SYMBOL)
    preText += UNIVER_SECTION_END_SYMBOL

  const body: IDocumentBody = {
    dataStream: preText,
    textRuns: [],
    paragraphs: [],
    sectionBreaks: [],
  }

  for (let i = 0; i < preText.length; i++) {
    if (preText[i] === UNIVER_PARAGRAPH_END_SYMBOL) {
      body.paragraphs!.push({
        startIndex: i,
        // paragraphStyle: {
        //   spaceAbove: 10,
        //   lineSpacing: 2,
        //   spaceBelow: 0,
        // },
      })
    }

    if (preText[i] === UNIVER_SECTION_END_SYMBOL) {
      body.sectionBreaks!.push({
        startIndex: i,
      })
    }
  }

  return body
}

export function emptyUDM(): IDocumentBody {
  return {
    dataStream: '\r\n',
    textRuns: [],
    paragraphs: [
      {
        startIndex: 0,
      },
    ],
    sectionBreaks: [
      {
        startIndex: 1,
      },
    ],
  }
}
