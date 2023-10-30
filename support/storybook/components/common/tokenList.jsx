import React from 'react'
import TokenValue from './tokenValue'
import { getClassNames } from '@docs/utils'

export default function TokenList({ data, isColorVisible }) {
  return (
    <div className="token-list">
      {data.tokens.map((token, index) => {
        const divider = index > 0 && token.filters?.every((filter) => !data.tokens[index - 1].filters.includes(filter))

        return (
          <li
            className={getClassNames(['token-list__item', divider ? 'token-list__item--divider' : ''])}
            data-color={'red'}
            key={token.name}
          >
            <TokenValue token={token} isColorVisible={isColorVisible} />
          </li>
        )
      })}
    </div>
  )
}
