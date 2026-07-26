import { PageContainer } from '../components/ui/PageContainer'
import { EmptyState } from '../components/ui/EmptyState'

export function DashboardPage() {
  return (
    <PageContainer title="Dashboard" intro="Your story workspace will appear here in a future milestone.">
      <EmptyState title="No stories yet" description="Create your first story experience once the next milestone is ready." />
    </PageContainer>
  )
}
