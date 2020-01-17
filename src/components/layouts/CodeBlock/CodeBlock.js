import React from 'react'
import Highlight, { defaultProps } from 'prism-react-renderer'
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live'
import { mdx } from '@mdx-js/react'
import * as components from '../../../../.cache/components'

const CodeBlock = ({ children, className, live, render }) => {

  const language = className.replace(/language-/, '')

  if (live) {
    console.log('asdfsdafads')
    return (
      <div style={{ marginTop: '10px' }}>
        <LiveProvider
          code={children}
          transformCode={code => '/** @jsx mdx */' + code}
          scope={{ mdx, ...components }}
        >
          <LivePreview />
          <LiveEditor style={{ marginTop: '10px', border: '2px solid #9691ae', backgroundColor: '#130749' }} />
          <LiveError />
        </LiveProvider>
      </div>
    )
  }
  if (render) {
    return (
      <div style={{ marginTop: '40px', backgroundColor: 'red' }}>
        <LiveProvider
          code={children}
          transformCode={code => '/** @jsx mdx */' + code}
          scope={{ mdx, ...components }}
        >
          <LivePreview />
          <LiveError />
        </LiveProvider>
      </div>
    )
  }
  return (
    <Highlight {...defaultProps} code={children.trim()} language={language}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre className={className} style={{ ...style, padding: '20px' }}>
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  )
}

export default CodeBlock
