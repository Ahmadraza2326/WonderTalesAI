import { PageContainer } from '../components/ui/PageContainer'

export function NotFoundPage() {
  return (
    <PageContainer title="Page not found" intro="The page you are looking for does not exist.">
      <div className="card-panel">
        <h2>Oops</h2>
        <p>Please return to the home page or choose another section in the navigation.</p>
      </div>
    </PageContainer>
  )
}
