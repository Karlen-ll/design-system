import React, { useState } from 'react'
import { copyToClipboard, getClassNames } from '@docs/utils'

export default function CopyValue({ className, text, children }) {
  const [isAnimate, setIsAnimate] = useState(false)

  const handleCopy = async () => {
    setIsAnimate(true)
    await copyToClipboard(text)

    setTimeout(() => setIsAnimate(false), 2000)
  }

  return (
    <span
      className={getClassNames([className, 'copy-value', isAnimate ? 'copy-value--animated' : ''])}
      onClick={handleCopy}
    >
      <>
        {children}
        <div className="copy-value__wrapper">
          <span className="copy-value__text">{text}</span>
          {isAnimate ? (
            <svg
              className="copy-value__icon"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeMiterlimit="10"
              strokeWidth="2"
              viewBox="0 0 16 16"
            >
              <path d="m3 8 3.3 3L13 5" />
            </svg>
          ) : null}
        </div>
      </>
    </span>
  )
}
