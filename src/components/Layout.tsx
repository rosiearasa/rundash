import React from 'react'
import { NavBar } from './NavBar'

export const Layout = ({children}: {children: React.ReactNode}) => {
    return (
  <div className="relative min-h-screen bg-white dark:bg-gray-900">
      <NavBar/>
      <main className="p-4 sm:px-8 lg:px-44">
          <div className="mx-auto max-w-6xl space-y-20">
              {children}
          </div>
      </main>
  
  </div>
    )
  }