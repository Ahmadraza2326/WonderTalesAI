import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppShell } from '../components/layout/AppShell'
import { ProtectedRoute } from '../components/ProtectedRoute'
import { AuthPage } from '../pages/AuthPage'
import { CreateStoryPage } from '../pages/CreateStoryPage'
import { DashboardPage } from '../pages/DashboardPage'
import { HomePage } from '../pages/HomePage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { ProfilePage } from '../pages/ProfilePage'
import { SettingsPage } from '../pages/SettingsPage'
import { StoriesPlaceholderPage } from '../pages/StoriesPlaceholderPage'
import { StoryWorkspacePage } from '../pages/StoryWorkspacePage'
import { useTheme } from '../hooks/useTheme'

export function AppRouter() {
  const { theme, toggleTheme } = useTheme()

  return (
    <BrowserRouter>
      <AppShell theme={theme} toggleTheme={toggleTheme}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/stories/new" element={<CreateStoryPage />} />
            <Route path="/stories/:id" element={<StoryWorkspacePage />} />
            <Route path="/stories" element={<StoriesPlaceholderPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  )
}
