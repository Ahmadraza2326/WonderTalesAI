/**
 * Diagnose route rendering and runtime exceptions across ORBis routes.
 */

import React from 'react'
import { renderToString } from 'react-dom/server'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '../src/context/AuthContext'
import { I18nProvider } from '../src/context/I18nContext'
import { AudioProvider } from '../src/context/AudioContext'
import { AppShell } from '../src/components/layout/AppShell'
import { ProtectedRoute } from '../src/components/ProtectedRoute'
import { HomePage } from '../src/pages/HomePage'
import { AuthPage } from '../src/pages/AuthPage'
import { GameUniversePage } from '../src/pages/GameUniversePage'
import { AcademyHomePage } from '../src/pages/academy/AcademyHomePage'
import { LessonPage } from '../src/pages/academy/LessonPage'
import { MagicMachinePage } from '../src/pages/MagicMachinePage'
import { GameUniverseHub } from '../src/components/games/universe/GameUniverseHub'
import { StarArrayManipulative } from '../src/components/academy/practice/manipulatives/StarArrayManipulative'
import { MagicMachineLab } from '../src/components/playroom/stations/MagicMachineLab'

async function diagnoseRoutes() {
  console.log('🔍 Diagnosing ORBis Route Rendering...\n')

  const testComponent = (name: string, Component: React.ReactElement) => {
    try {
      const html = renderToString(Component)
      console.log(`  ✅ ${name}: Rendered successfully (${html.length} chars)`)
      return true
    } catch (err: any) {
      console.error(`  ❌ ${name} ERROR:`, err.message)
      console.error(err.stack)
      return false
    }
  }

  // Test 1: Direct Component Renders
  console.log('▶️ 1. Testing Isolated Components...')
  testComponent('StarArrayManipulative', <StarArrayManipulative />)
  testComponent('GameUniverseHub', <MemoryRouter><GameUniverseHub /></MemoryRouter>)
  testComponent('MagicMachineLab', <MemoryRouter><AuthProvider><MagicMachineLab /></AuthProvider></MemoryRouter>)
  testComponent('HomePage', <MemoryRouter><AuthProvider><I18nProvider><HomePage /></I18nProvider></AuthProvider></MemoryRouter>)
  testComponent('AuthPage', <MemoryRouter><AuthProvider><I18nProvider><AuthPage /></I18nProvider></AuthProvider></MemoryRouter>)
  testComponent('GameUniversePage', <MemoryRouter><AuthProvider><I18nProvider><GameUniversePage /></I18nProvider></AuthProvider></MemoryRouter>)

  // Test 2: Full Route Navigation with MemoryRouter
  console.log('\n▶️ 2. Testing MemoryRouter Route Trees...')
  const routesToTest = ['/', '/auth', '/games', '/academy', '/playroom/magic-machine', '/academy/lesson/lesson_g2_array_multiplication']

  for (const route of routesToTest) {
    try {
      const html = renderToString(
        <AuthProvider>
          <I18nProvider>
            <AudioProvider>
              <MemoryRouter initialEntries={[route]}>
                <AppShell theme="dark" toggleTheme={() => {}}>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/auth" element={<AuthPage />} />
                    <Route path="/games" element={<GameUniversePage />} />
                    <Route path="/academy" element={<AcademyHomePage />} />
                    <Route path="/playroom/magic-machine" element={<MagicMachinePage />} />
                    <Route path="/academy/lesson/:lessonId" element={<LessonPage />} />
                    <Route element={<ProtectedRoute />}>
                      <Route path="/dashboard" element={<HomePage />} />
                    </Route>
                  </Routes>
                </AppShell>
              </MemoryRouter>
            </AudioProvider>
          </I18nProvider>
        </AuthProvider>
      )
      console.log(`  ✅ Route "${route}": Rendered successfully (${html.length} chars)`)
    } catch (err: any) {
      console.error(`  ❌ Route "${route}" ERROR:`, err.message)
      console.error(err.stack)
    }
  }
}

diagnoseRoutes()
