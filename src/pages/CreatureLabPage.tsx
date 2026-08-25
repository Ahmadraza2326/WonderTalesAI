import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { childProfileService } from '../services/childProfileService'
import type { ChildProfile } from '../types/childProfile'
import { CreatureLab } from '../components/games/creature-lab/CreatureLab'

export function CreatureLabPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [activeChild, setActiveChild] = useState<ChildProfile | null>(null)
  const [, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadChild() {
      if (!user) {
        setIsLoading(false)
        return
      }

      try {
        const { data, error } = await childProfileService.getChildProfiles(user.id)
        if (!error && data && data.length > 0) {
          setActiveChild(data[0])
        }
      } catch {
        // Fallback to guest mode
      } finally {
        setIsLoading(false)
      }
    }

    void loadChild()
  }, [user])

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 64px)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CreatureLab
        childId={activeChild?.id}
        childName={activeChild?.name || 'Explorer'}
        onBack={() => navigate('/dashboard')}
      />
    </div>
  )
}
