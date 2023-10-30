import React from 'react'

const DEFAULT_LEVEL = 1

export default function DocHeader({ id, level, title, description, descTitle, children }) {
  const HeaderTag = `h${Math.min(level ?? DEFAULT_LEVEL, 6)}`

  return (
    <HeaderTag className="doc-header" id={id}>
      {title ?? children}
      {description ? (
        <span className="doc-header__desc" title={descTitle}>
          {description}
        </span>
      ) : null}
    </HeaderTag>
  )
}
