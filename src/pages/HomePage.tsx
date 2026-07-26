import { PageContainer } from '../components/ui/PageContainer'

const features = [
  {
    title: 'Gentle story crafting',
    description:
      'Shape whimsical adventures with a simple prompt and a warm creative flow.',
  },
  {
    title: 'Personalized themes',
    description:
      'Choose moods, genres, and characters to make every tale feel tailored.',
  },
  {
    title: 'Readable, shareable output',
    description:
      'Enjoy polished storytelling that is easy to read, save, and revisit.',
  },
]

const steps = [
  'Choose a story idea or mood',
  'Guide the experience with a few simple details',
  'Publish a story you can read and share',
]

export function HomePage() {
  return (
    <PageContainer>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Create stories that feel magical</p>
          <h1>Bring your favorite ideas to life with gentle, AI-assisted storytelling.</h1>
          <p className="hero-text">
            WonderTalesAI helps you discover charming story paths, build memorable
            characters, and turn imagination into something beautiful.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#features">
              Explore features
            </a>
            <a className="button button-secondary" href="#how-it-works">
              See how it works
            </a>
          </div>
        </div>

        <div className="hero-card" aria-label="Preview of the app experience">
          <p className="card-pill">Coming soon</p>
          <h2>Shape the next story in minutes</h2>
          <ul>
            <li>Pick a theme, mood, and length</li>
            <li>Craft a story with a warm, guided flow</li>
            <li>Save and revisit favorite tales</li>
          </ul>
        </div>
      </section>

      <section id="features" className="section">
        <div className="section-heading">
          <p className="eyebrow">Why families and creators love it</p>
          <h2>Simple tools for imagination</h2>
        </div>

        <div className="feature-grid">
          {features.map((feature) => (
            <article className="feature-card" key={feature.title}>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="section section-alt">
        <div className="section-heading">
          <p className="eyebrow">A calm, guided flow</p>
          <h2>Three easy steps to a beautiful story</h2>
        </div>

        <div className="steps-list">
          {steps.map((step, index) => (
            <div className="step-item" key={step}>
              <span className="step-number">0{index + 1}</span>
              <p>{step}</p>
            </div>
          ))}
        </div>
      </section>
    </PageContainer>
  )
}
