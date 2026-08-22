import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppShell } from '../components/layout/AppShell'
import { ProtectedRoute } from '../components/ProtectedRoute'
import { RouteLoadingFallback } from '../components/ui/RouteLoadingFallback'
import { useTheme } from '../hooks/useTheme'

// Route-level code splitting with React.lazy
const HomePage = lazy(() => import('../pages/HomePage').then((m) => ({ default: m.HomePage })))
const AuthPage = lazy(() => import('../pages/AuthPage').then((m) => ({ default: m.AuthPage })))
const ResetPasswordPage = lazy(() => import('../pages/ResetPasswordPage').then((m) => ({ default: m.ResetPasswordPage })))
const DashboardPage = lazy(() => import('../pages/DashboardPage').then((m) => ({ default: m.DashboardPage })))
const CreateStoryPage = lazy(() => import('../pages/CreateStoryPage').then((m) => ({ default: m.CreateStoryPage })))
const StoryWorkspacePage = lazy(() => import('../pages/StoryWorkspacePage').then((m) => ({ default: m.StoryWorkspacePage })))
const StoryLibraryPage = lazy(() => import('../pages/StoryLibraryPage').then((m) => ({ default: m.StoryLibraryPage })))
const ProfilePage = lazy(() => import('../pages/ProfilePage').then((m) => ({ default: m.ProfilePage })))
const SettingsPage = lazy(() => import('../pages/SettingsPage').then((m) => ({ default: m.SettingsPage })))
const NotFoundPage = lazy(() => import('../pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })))

export function AppRouter() {
  const { theme, toggleTheme } = useTheme()

  return (
    <BrowserRouter>
      <AppShell theme={theme} toggleTheme={toggleTheme}>
        <Suspense fallback={<RouteLoadingFallback />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/stories/new" element={<CreateStoryPage />} />
              <Route path="/stories/:id" element={<StoryWorkspacePage />} />
              <Route path="/stories" element={<StoryLibraryPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </AppShell>
    </BrowserRouter>
  )
}
