import React from 'react'
import CopyValue from 'support/storybook/components/common/copyValue'

export default function TokenValue({ token, isColorVisible }) {
  return (
    <>
      <CopyValue className="token-name" text={`$${token.name}`} />
      <CopyValue className="token-value" text={token.value}>
        {isColorVisible ? <span className="token-value__block" style={{ backgroundColor: token.value }} /> : null}
      </CopyValue>
    </>
  )
}
