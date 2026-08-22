/**
 * ORBIS Parent Learning Insights Component
 * Gentle learning analytics displaying completed stories, calm reading time, explored themes, and family milestones.
 */

import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useI18n } from '../../context/I18nContext'
import { learningProgressService } from '../../services/learningProgressService'
import type { LearningProgressSummary } from '../../types/learning'

export const ParentLearningInsights: React.FC = () => {
  const { user } = useAuth()
  const { t, locale } = useI18n()
  const [summary, setSummary] = useState<LearningProgressSummary | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    async function loadSummary() {
      if (!user?.id) {
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      setError(null)
      const res = await learningProgressService.getLearningProgressSummary(user.id)

      if (isMounted) {
        if (res.error) {
          setError(res.error.message)
        } else {
          setSummary(res.data)
        }
        setIsLoading(false)
      }
    }

    loadSummary()

    return () => {
      isMounted = false
    }
  }, [user?.id])

  if (isLoading) {
    return (
      <div className="card-panel parent-insights-card">
        <div className="insights-header">
          <h3>🌱 {t('parent_insights', locale)}</h3>
        </div>
        <div className="insights-loading" role="status">
          <p>Loading family reading milestones...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card-panel parent-insights-card">
        <div className="insights-header">
          <h3>🌱 {t('parent_insights', locale)}</h3>
        </div>
        <p className="field-error-text">{error}</p>
      </div>
    )
  }

  const hasActivity = summary && summary.totalStoriesCompleted > 0

  return (
    <section className="card-panel parent-insights-card" aria-labelledby="insights-section-title">
      <div className="insights-header">
        <div className="insights-title-group">
          <span className="insights-badge-icon" aria-hidden="true">🌱</span>
          <div>
            <h3 id="insights-section-title" className="insights-heading">
              {t('parent_insights', locale)}
            </h3>
            <p className="insights-subtitle">Gentle reading milestones and values explored with your children.</p>
          </div>
        </div>
      </div>

      {!hasActivity ? (
        <div className="insights-empty-state">
          <span className="empty-icon" aria-hidden="true">📖</span>
          <p>{t('no_reading_yet', locale)}</p>
        </div>
      ) : (
        <div className="insights-content">
          {/* 1. Calm Milestone Cards */}
          <div className="insights-stat-grid">
            <div className="stat-card">
              <span className="stat-icon" aria-hidden="true">📚</span>
              <span className="stat-value">{summary.totalStoriesCompleted}</span>
              <span className="stat-label">{t('stories_completed', locale)}</span>
            </div>

            <div className="stat-card">
              <span className="stat-icon" aria-hidden="true">📄</span>
              <span className="stat-value">{summary.totalPagesRead}</span>
              <span className="stat-label">{t('pages_explored', locale)}</span>
            </div>

            <div className="stat-card">
              <span className="stat-icon" aria-hidden="true">⏱️</span>
              <span className="stat-value">{summary.totalReadingMinutes}m</span>
              <span className="stat-label">{t('calm_reading_time', locale)}</span>
            </div>

            <div className="stat-card">
              <span className="stat-icon" aria-hidden="true">🎙️</span>
              <span className="stat-value">{summary.listeningSessionsCount}</span>
              <span className="stat-label">{t('listening_sessions', locale)}</span>
            </div>
          </div>

          {/* 2. Themes & Values Explored */}
          {summary.themesExplored.length > 0 && (
            <div className="insights-themes-section">
              <h4 className="insights-subheading">{t('themes_values_explored', locale)}</h4>
              <div className="theme-pills-wrap">
                {summary.themesExplored.map((item) => (
                  <span key={item.theme} className="theme-insight-pill">
                    🌟 {item.theme} <small className="theme-count">({item.count})</small>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 3. Recent Reading Activity */}
          {summary.recentCompletedStories.length > 0 && (
            <div className="insights-recent-section">
              <h4 className="insights-subheading">{t('recent_reading_activity', locale)}</h4>
              <ul className="recent-stories-list">
                {summary.recentCompletedStories.map((s) => (
                  <li key={s.storyId} className="recent-story-item">
                    <div className="recent-story-info">
                      <strong className="recent-story-title">{s.title}</strong>
                      <span className="recent-story-meta">
                        {s.childName ? `Hero: ${s.childName}` : 'Family Story'} • {s.readingMinutes} min read
                      </span>
                    </div>
                    <span className="recent-story-badge">Completed ✨</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
