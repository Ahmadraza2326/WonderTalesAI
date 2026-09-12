import React, { memo } from 'react'
import type { CognitiveDomain } from '../../types/experience'

interface CognitiveSkillBadgeProps {
  domain: CognitiveDomain
  isSecondary?: boolean
  className?: string
}

interface DomainConfig {
  label: string
  emoji: string
  color: string
  bg: string
  border: string
  description: string
}

const DOMAIN_CONFIGS: Record<CognitiveDomain, DomainConfig> = {
  memory: {
    label: 'Memory & Recall',
    emoji: '🧠',
    color: '#7c3aed',
    bg: 'rgba(124, 58, 237, 0.1)',
    border: 'rgba(124, 58, 237, 0.25)',
    description: 'Builds working memory and detail retention.',
  },
  vocabulary: {
    label: 'Vocabulary & Spelling',
    emoji: '🔤',
    color: '#0891b2',
    bg: 'rgba(8, 145, 178, 0.1)',
    border: 'rgba(8, 145, 178, 0.25)',
    description: 'Expands word knowledge and spelling confidence.',
  },
  comprehension: {
    label: 'Comprehension',
    emoji: '💡',
    color: '#ea580c',
    bg: 'rgba(234, 88, 12, 0.1)',
    border: 'rgba(234, 88, 12, 0.25)',
    description: 'Deepens story understanding and moral reflection.',
  },
  logic: {
    label: 'Logic & Sequencing',
    emoji: '🧩',
    color: '#059669',
    bg: 'rgba(5, 150, 105, 0.1)',
    border: 'rgba(5, 150, 105, 0.25)',
    description: 'Exercises chronological ordering and problem-solving.',
  },
  creativity: {
    label: 'Creative Expression',
    emoji: '🎨',
    color: '#db2777',
    bg: 'rgba(219, 39, 119, 0.1)',
    border: 'rgba(219, 39, 119, 0.25)',
    description: 'Inspires imaginative thinking and storytelling.',
  },
  phonics: {
    label: 'Phonics & Sound',
    emoji: '🎵',
    color: '#d97706',
    bg: 'rgba(217, 119, 6, 0.1)',
    border: 'rgba(217, 119, 6, 0.25)',
    description: 'Develops letter sounds and phonemic awareness.',
  },
}

export const CognitiveSkillBadge = memo(function CognitiveSkillBadge({
  domain,
  isSecondary = false,
  className = '',
}: CognitiveSkillBadgeProps) {
  const config = DOMAIN_CONFIGS[domain] || DOMAIN_CONFIGS.comprehension

  return (
    <span
      className={`card-pill ${className}`.trim()}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.35rem',
        padding: isSecondary ? '0.2rem 0.6rem' : '0.28rem 0.75rem',
        fontSize: isSecondary ? '0.78rem' : '0.84rem',
        fontWeight: isSecondary ? 600 : 700,
        color: config.color,
        backgroundColor: config.bg,
        border: `1px solid ${config.border}`,
        borderRadius: '9999px',
        margin: 0,
        userSelect: 'none',
        transition: 'transform 150ms ease',
      }}
      title={`${config.label}: ${config.description}`}
      aria-label={`Cognitive Skill: ${config.label}`}
    >
      <span aria-hidden="true" style={{ fontSize: isSecondary ? '0.9em' : '1em' }}>
        {config.emoji}
      </span>
      <span>{config.label}</span>
    </span>
  )
})
