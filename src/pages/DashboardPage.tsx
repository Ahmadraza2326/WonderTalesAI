import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageContainer } from '../components/ui/PageContainer'
import { EmptyState } from '../components/ui/EmptyState'
import { storyService } from '../services/storyService'
import { useAuth } from '../context/AuthContext'
import type { StoryRecord } from '../types/story'

export function DashboardPage() {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const [stories, setStories] = useState<StoryRecord[]>([])
  const [isLoadingStories, setIsLoadingStories] = useState(false)

  useEffect(() => {
    async function loadStories() {
      if (!user) return

      setIsLoadingStories(true)

      const { data, error } = await storyService.getStoriesForUser(user.id)
      
      if (!error && data) {
        setStories((data as StoryRecord[]).slice(0, 3))
      } else {
        setStories([])
      }

      setIsLoadingStories(false)
    }

    void loadStories()
  }, [user])

  async function handleSignOut() {
    await signOut()
    navigate('/auth', { replace: true })
  }

  if (!user) {
    return null
  }

  return (
    <PageContainer title="Dashboard" intro="Your story workspace will appear here in a future milestone.">
      <div className="card-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
        <div>
          <h2>Welcome to your workspace</h2>
          <p>You are signed in and can now access your protected dashboard area.</p>
        </div>
        <div className="dashboard-actions">
          <button type="button" className="button button-primary" onClick={() => navigate('/stories/new')}>
            Create Story
          </button>
          <button type="button" className="button button-secondary" onClick={() => navigate('/stories')}>
            My Stories
          </button>
          <button type="button" className="button button-secondary" onClick={handleSignOut}>
            Sign Out
          </button>
        </div>
      </div>

      <div className="card-panel" style={{ marginTop: '1rem' }}>
        <h3>Recent Stories</h3>
        {isLoadingStories ? (
          <p>Loading recent stories…</p>
        ) : stories.length > 0 ? (
          <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: '0.75rem', margin: '0.75rem 0 0' }}>
            {stories.map((story) => (
              <li key={story.id} className="card-panel" style={{ margin: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                  <div>
                    <strong>{story.title}</strong>
                    <p style={{ margin: '0.25rem 0 0' }}>{story.status ?? 'draft'}</p>
                  </div>
                  <button type="button" className="button button-secondary" onClick={() => navigate(`/stories/${story.id}`)}>
                    Open
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState title="No stories yet" description="Create your first story experience or visit My Stories to view existing ones." />
        )}
      </div>
    </PageContainer>
  )
}
