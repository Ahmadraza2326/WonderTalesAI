import React from 'react'

type PageContainerProps = {
  children: React.ReactNode
  title?: string
  intro?: string
}

export function PageContainer({ children, title, intro }: PageContainerProps) {
  return (
    <section className="page-container">
      {(title || intro) && (
        <div className="page-intro">
          {title ? <h1>{title}</h1> : null}
          {intro ? <p>{intro}</p> : null}
        </div>
      )}
      {children}
    </section>
  )
}
