import React from 'react'
import CopyValue from '@docs/components/common/copyValue'

export default function IconList({ icons }) {
  return (
    <div className="icon-list">
      {Object.keys(icons).map((icon, index) => (
        <CopyValue className="icon-list__item" key={`${icon}#${index}`} text={icon}>
          <div className="icon-list__wrapper">
            <img src={icons[icon]} alt={icon} />
          </div>
        </CopyValue>
      ))}
    </div>
  )
}
