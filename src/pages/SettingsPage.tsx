import { PageContainer } from '../components/ui/PageContainer'
import { EmptyState } from '../components/ui/EmptyState'

export function SettingsPage() {
  return (
    <PageContainer title="Settings" intro="Adjust the app experience as the product grows.">
      <EmptyState title="Settings coming soon" description="Theme and preference controls will be expanded in future milestones." />
    </PageContainer>
  )
}
