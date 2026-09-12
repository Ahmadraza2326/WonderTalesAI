import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppShell } from '../components/layout/AppShell'
import { ProtectedRoute } from '../components/ProtectedRoute'
import { RouteLoadingFallback } from '../components/ui/RouteLoadingFallback'
import { useTheme } from '../hooks/useTheme'
import { AudioProvider } from '../context/AudioContext'

// Route-level code splitting with React.lazy
const HomePage = lazy(() => import('../pages/HomePage').then((m) => ({ default: m.HomePage })))
const AuthPage = lazy(() => import('../pages/AuthPage').then((m) => ({ default: m.AuthPage })))
const ResetPasswordPage = lazy(() => import('../pages/ResetPasswordPage').then((m) => ({ default: m.ResetPasswordPage })))
const DashboardPage = lazy(() => import('../pages/DashboardPage').then((m) => ({ default: m.DashboardPage })))
const CreateStoryPage = lazy(() => import('../pages/CreateStoryPage').then((m) => ({ default: m.CreateStoryPage })))
const StoryWorkspacePage = lazy(() => import('../pages/StoryWorkspacePage').then((m) => ({ default: m.StoryWorkspacePage })))
const StoryLibraryPage = lazy(() => import('../pages/StoryLibraryPage').then((m) => ({ default: m.StoryLibraryPage })))
const ProfilePage = lazy(() => import('../pages/ProfilePage').then((m) => ({ default: m.ProfilePage })))
const ParentZonePage = lazy(() => import('../pages/ParentZonePage').then((m) => ({ default: m.ParentZonePage })))
const GameUniversePage = lazy(() => import('../pages/GameUniversePage').then((m) => ({ default: m.GameUniversePage })))
const CreatureLabPage = lazy(() => import('../pages/CreatureLabPage').then((m) => ({ default: m.CreatureLabPage })))
const MagicMachinePage = lazy(() => import('../pages/MagicMachinePage').then((m) => ({ default: m.MagicMachinePage })))
const InventionLabPage = lazy(() => import('../pages/InventionLabPage').then((m) => ({ default: m.InventionLabPage })))
const MysteryDetectivePage = lazy(() => import('../pages/MysteryDetectivePage').then((m) => ({ default: m.MysteryDetectivePage })))
const PotionScalesPage = lazy(() => import('../pages/PotionScalesPage').then((m) => ({ default: m.PotionScalesPage })))
const SpellforgePage = lazy(() => import('../pages/SpellforgePage').then((m) => ({ default: m.SpellforgePage })))
const MemoryMuseumPage = lazy(() => import('../pages/MemoryMuseumPage').then((m) => ({ default: m.MemoryMuseumPage })))
const RhythmSpellsPage = lazy(() => import('../pages/RhythmSpellsPage').then((m) => ({ default: m.RhythmSpellsPage })))
const RoboPathPage = lazy(() => import('../pages/RoboPathPage').then((m) => ({ default: m.RoboPathPage })))
const EcosystemSandboxPage = lazy(() => import('../pages/EcosystemSandboxPage').then((m) => ({ default: m.EcosystemSandboxPage })))
const CosmicConstellationPage = lazy(() => import('../pages/CosmicConstellationPage').then((m) => ({ default: m.CosmicConstellationPage })))
const PassportPage = lazy(() => import('../pages/PassportPage').then((m) => ({ default: m.PassportPage })))
const OverworldPage = lazy(() => import('../pages/OverworldPage').then((m) => ({ default: m.OverworldPage })))
const SanctuaryPage = lazy(() => import('../pages/SanctuaryPage').then((m) => ({ default: m.SanctuaryPage })))
const ExplorePage = lazy(() => import('../pages/ExplorePage').then((m) => ({ default: m.ExplorePage })))
const AcademyHomePage = lazy(() => import('../pages/academy/AcademyHomePage').then((m) => ({ default: m.AcademyHomePage })))
const SubjectDetailPage = lazy(() => import('../pages/academy/SubjectDetailPage').then((m) => ({ default: m.SubjectDetailPage })))
const CourseDetailPage = lazy(() => import('../pages/academy/CourseDetailPage').then((m) => ({ default: m.CourseDetailPage })))
const SkillHubPage = lazy(() => import('../pages/academy/SkillHubPage').then((m) => ({ default: m.SkillHubPage })))
const LessonPage = lazy(() => import('../pages/academy/LessonPage').then((m) => ({ default: m.LessonPage })))
const PracticePage = lazy(() => import('../pages/academy/PracticePage').then((m) => ({ default: m.PracticePage })))
const AcademyMissionsPage = lazy(() => import('../pages/academy/AcademyMissionsPage').then((m) => ({ default: m.AcademyMissionsPage })))
const AcademyLibraryPage = lazy(() => import('../pages/academy/AcademyLibraryPage').then((m) => ({ default: m.AcademyLibraryPage })))
const CreativeStudioPage = lazy(() => import('../pages/academy/CreativeStudioPage').then((m) => ({ default: m.CreativeStudioPage })))
const ThinkLabPage = lazy(() => import('../pages/academy/ThinkLabPage').then((m) => ({ default: m.ThinkLabPage })))
const ScienceLabPage = lazy(() => import('../pages/academy/ScienceLabPage').then((m) => ({ default: m.ScienceLabPage })))
const ProjectStudioPage = lazy(() => import('../pages/academy/ProjectStudioPage').then((m) => ({ default: m.ProjectStudioPage })))
const NotFoundPage = lazy(() => import('../pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })))

export function AppRouter() {
  const { theme, toggleTheme } = useTheme()

  return (
    <AudioProvider>
      <BrowserRouter>
        <AppShell theme={theme} toggleTheme={toggleTheme}>
          <Suspense fallback={<RouteLoadingFallback />}>
            <Routes>
              <Route path="/" element={<OverworldPage />} />
              <Route path="/overworld" element={<OverworldPage />} />
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/stories" element={<StoryLibraryPage />} />
              <Route path="/library" element={<StoryLibraryPage />} />
              <Route path="/stories/:id" element={<StoryWorkspacePage />} />
              <Route path="/workspace" element={<StoryLibraryPage />} />
              <Route path="/academy" element={<AcademyHomePage />} />
              <Route path="/academy/library" element={<AcademyLibraryPage />} />
              <Route path="/academy/create" element={<CreativeStudioPage />} />
              <Route path="/academy/think" element={<ThinkLabPage />} />
              <Route path="/academy/science" element={<ScienceLabPage />} />
              <Route path="/academy/projects" element={<ProjectStudioPage />} />
              <Route path="/academy/subject/:subjectId" element={<SubjectDetailPage />} />
              <Route path="/academy/course/:courseId" element={<CourseDetailPage />} />
              <Route path="/academy/skill/:skillId" element={<SkillHubPage />} />
              <Route path="/academy/lesson/:lessonId" element={<LessonPage />} />
              <Route path="/academy/practice/:practiceSetId" element={<PracticePage />} />
              <Route path="/academy/missions" element={<AcademyMissionsPage />} />
              <Route path="/games" element={<GameUniversePage />} />
              <Route path="/playroom" element={<GameUniversePage />} />
              <Route path="/games/creature-lab" element={<CreatureLabPage />} />
              <Route path="/sanctuary" element={<SanctuaryPage />} />
              <Route path="/games/sanctuary" element={<SanctuaryPage />} />
              <Route path="/games/magic-machine" element={<MagicMachinePage />} />
              <Route path="/playroom/magic-machine" element={<MagicMachinePage />} />
              <Route path="/games/invention-lab" element={<InventionLabPage />} />
              <Route path="/playroom/invention-lab" element={<InventionLabPage />} />
              <Route path="/playground/invention-lab" element={<InventionLabPage />} />
              <Route path="/games/mystery-detective" element={<MysteryDetectivePage />} />
              <Route path="/playroom/mystery-detective" element={<MysteryDetectivePage />} />
              <Route path="/games/potion-scales" element={<PotionScalesPage />} />
              <Route path="/playroom/potion-scales" element={<PotionScalesPage />} />
              <Route path="/games/spellforge" element={<SpellforgePage />} />
              <Route path="/playroom/spellforge" element={<SpellforgePage />} />
              <Route path="/playground/spellforge" element={<SpellforgePage />} />
              <Route path="/games/memory-museum" element={<MemoryMuseumPage />} />
              <Route path="/playroom/memory-museum" element={<MemoryMuseumPage />} />
              <Route path="/playground/memory-museum" element={<MemoryMuseumPage />} />
              <Route path="/games/rhythm-spells" element={<RhythmSpellsPage />} />
              <Route path="/playroom/rhythm-spells" element={<RhythmSpellsPage />} />
              <Route path="/playground/rhythm-spells" element={<RhythmSpellsPage />} />
              <Route path="/games/robopath" element={<RoboPathPage />} />
              <Route path="/playroom/robopath" element={<RoboPathPage />} />
              <Route path="/playground/robopath" element={<RoboPathPage />} />
              <Route path="/games/ecosystem-sandbox" element={<EcosystemSandboxPage />} />
              <Route path="/playroom/ecosystem-sandbox" element={<EcosystemSandboxPage />} />
              <Route path="/playground/world-builder" element={<EcosystemSandboxPage />} />
              <Route path="/games/constellations" element={<CosmicConstellationPage />} />
              <Route path="/playroom/constellations" element={<CosmicConstellationPage />} />
              <Route path="/playroom/cosmic-constellations" element={<CosmicConstellationPage />} />
              <Route path="/playground/cosmic-constellations" element={<CosmicConstellationPage />} />
              <Route path="/passport" element={<PassportPage />} />
              <Route path="/adventure-passport" element={<PassportPage />} />

              {/* Protected Parent & Creator Accounts */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/stories/new" element={<CreateStoryPage />} />
                <Route path="/parent-zone" element={<ParentZonePage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/settings" element={<ProfilePage />} />
              </Route>
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </Suspense>
      </AppShell>
    </BrowserRouter>
    </AudioProvider>
  )
}
