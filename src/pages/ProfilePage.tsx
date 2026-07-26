import { PageContainer } from '../components/ui/PageContainer'
import { EmptyState } from '../components/ui/EmptyState'

export function ProfilePage() {
  return (
    <PageContainer title="Profile" intro="A placeholder profile page for the future app experience.">
      <EmptyState title="Profile coming soon" description="This space will evolve into a user profile and account overview." />
    </PageContainer>
  )
}
