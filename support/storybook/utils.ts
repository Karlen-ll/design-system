/** Сформировать классы */
export function getClassNames(classNames: string[]) {
  return classNames.filter(Boolean).join(' ')
}

export function copyToClipboard(textToCopy: string) {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(textToCopy)
  } else {
    const textArea = document.createElement('textarea')
    textArea.value = textToCopy
    textArea.classList.add('visually-hidden')

    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()

    return new Promise((res, rej) => {
      document.execCommand('copy') ? res(textToCopy) : rej()
      textArea.remove()
    })
  }
}
