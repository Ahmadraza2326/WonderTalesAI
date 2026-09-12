import React from 'react'
import { renderToString } from 'react-dom/server'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '../src/context/AuthContext'
import { I18nProvider } from '../src/context/I18nContext'
import { AudioProvider } from '../src/context/AudioContext'
import { AppShell } from '../src/components/layout/AppShell'
import { CreateStoryPage } from '../src/pages/CreateStoryPage'
import { DashboardPage } from '../src/pages/DashboardPage'

async function testPhase1Pages() {
  console.log('🧪 Verifying Phase 1 Story Studio & Dashboard Page Rendering...\n')

  const testRoute = (name: string, route: string, Component: React.ReactElement) => {
    try {
      const html = renderToString(
        <AuthProvider>
          <I18nProvider>
            <AudioProvider>
              <MemoryRouter initialEntries={[route]}>
                <AppShell theme="dark" toggleTheme={() => {}}>
                  <Routes>
                    <Route path={route} element={Component} />
                  </Routes>
                </AppShell>
              </MemoryRouter>
            </AudioProvider>
          </I18nProvider>
        </AuthProvider>
      )
      console.log(`  ✅ [PASS] ${name} (${route}) rendered successfully (${html.length} chars)`)
      return true
    } catch (err: any) {
      console.error(`  ❌ [FAIL] ${name} (${route}) ERROR:`, err.message)
      console.error(err.stack)
      return false
    }
  }

  const r1 = testRoute('CreateStoryPage', '/stories/new', <CreateStoryPage />)
  const r2 = testRoute('DashboardPage', '/dashboard', <DashboardPage />)

  if (r1 && r2) {
    console.log('\n🎉 ALL PHASE 1 SCREENS RENDER CLEANLY WITH ZERO EXCEPTIONS!')
  } else {
    console.error('\n❌ PHASE 1 SCREEN RENDERING DETECTED FAILURES!')
    process.exit(1)
  }
}

testPhase1Pages()
