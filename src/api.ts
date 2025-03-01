import type { FUniver } from '@univerjs/presets'

export function setupCommandsListenerSwitch($toolbar: HTMLElement, univerAPI: FUniver) {
  const $button = document.createElement('a')
  $button.textContent = 'start listening commands'
  $toolbar.appendChild($button)
  const el = $button
  let listener: any = null

  $button.addEventListener('click', () => {
    if (!univerAPI)
      throw new Error('univerAPI is not defined')

    if (listener) {
      listener.dispose()
      listener = null
      el.innerHTML = 'start listening commands'
      return
    }

    listener = univerAPI.addEvent(univerAPI.Event.CommandExecuted, (command) => {
      // eslint-disable-next-line no-console
      console.log(command)
    })
    el.innerHTML = 'stop listening commands'

    // eslint-disable-next-line no-alert
    alert('Press "Ctrl + Shift + I" to open the console and do some actions in the Univer Sheets, you will see the commands in the console.')
  })
}

export function setupEditSwitch($toolbar: HTMLElement, univerAPI: FUniver) {
  const $button = document.createElement('a')
  $button.textContent = 'disable edit'
  $toolbar.appendChild($button)
  const el = $button
  let listener: any = null
  let errListener: any = null

  $button.addEventListener('click', () => {
    if (!univerAPI)
      throw new Error('univerAPI is not defined')

    class DisableEditError extends Error {
      constructor() {
        super('editing is disabled')
        this.name = 'DisableEditError'
      }
    }

    if (listener) {
      listener.dispose()
      window.removeEventListener('error', errListener)
      window.removeEventListener('unhandledrejection', errListener)
      listener = null
      el.innerHTML = 'disable edit'
      return
    }

    errListener = (e: PromiseRejectionEvent | ErrorEvent) => {
      const error = e instanceof PromiseRejectionEvent ? e.reason : e.error
      if (error instanceof DisableEditError) {
        e.preventDefault()
        console.warn('editing is disabled')
      }
    }
    window.addEventListener('error', errListener)
    window.addEventListener('unhandledrejection', errListener)
    listener = univerAPI.addEvent(univerAPI.Event.BeforeCommandExecute, () => {
      throw new DisableEditError()
    })

    // eslint-disable-next-line no-alert
    alert('Editing is disabled, try to edit a cell to see the effect')
    el.innerHTML = 'enable edit'
  })
}

export function setupUndo($toolbar: HTMLElement, univerAPI: FUniver) {
  const $button = document.createElement('a')
  $button.textContent = 'undo'
  $toolbar.appendChild($button)

  $button.addEventListener('click', () => {
    if (!univerAPI)
      throw new Error('univerAPI is not defined')

    univerAPI.undo()
  })
}

export function setupRedo($toolbar: HTMLElement, univerAPI: FUniver) {
  const $button = document.createElement('a')
  $button.textContent = 'redo'
  $toolbar.appendChild($button)

  $button.addEventListener('click', () => {
    if (!univerAPI)
      throw new Error('univerAPI is not defined')

    univerAPI.redo()
  })
}

export function setupSelectText($toolbar: HTMLElement, univerAPI: FUniver) {
  const $button = document.createElement('a')
  $button.textContent = 'select text'
  $toolbar.appendChild($button)

  $button.addEventListener('click', () => {
    if (!univerAPI)
      throw new Error('univerAPI is not defined')

    univerAPI.getActiveDocument()?.setSelection(0, 1)
  })
}
