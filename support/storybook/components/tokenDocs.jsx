import React from 'react'
import { capitalize } from '@/_utils/formatter'
import TokenList from './common/tokenList'
import DocHeader from '@docs/components/common/docHeader'

function TokenAnchors({ tokenTypes }) {
  return tokenTypes.map((tokenType, index) => (
    <React.Fragment key={`${tokenType}-anchor`}>
      <a href={`#${tokenType}`} target="_self">
        {capitalize(tokenType)}
      </a>
      {index !== tokenTypes.length - 1 ? ', ' : '.'}
    </React.Fragment>
  ))
}

/** Документ с токенами */
export default function TokenDocs({ theme, token, date }) {
  return (
    <>
      <DocHeader description={date} descTitle="Дата обновления">
        Тема «{capitalize(theme)}»
      </DocHeader>
      <p>
        Группы токенов: <TokenAnchors tokenTypes={token.types} /> <br />
      </p>

      {token.types.map((tokenType) => (
        <div key={tokenType}>
          <DocHeader
            id={tokenType}
            level={2}
            title={`${capitalize(tokenType)} токены`}
            description={`${token[tokenType].tokens.length} шт.`}
            descTitle="Кол-во токенов"
          />
          <TokenList data={token[tokenType]} isColorVisible={tokenType === 'color'} />
        </div>
      ))}
    </>
  )
}
