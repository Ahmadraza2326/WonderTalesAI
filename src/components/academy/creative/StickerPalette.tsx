import React from 'react'

export interface StickerItem {
  id: string
  emoji: string
  label: string
  category: 'cosmic' | 'animals' | 'nature' | 'fantasy' | 'tech'
}

export const STICKER_PACKS: StickerItem[] = [
  // Cosmic
  { id: 'stk_rocket', emoji: '🚀', label: 'Rocket', category: 'cosmic' },
  { id: 'stk_star', emoji: '⭐', label: 'Star', category: 'cosmic' },
  { id: 'stk_planet', emoji: '🪐', label: 'Saturn', category: 'cosmic' },
  { id: 'stk_moon', emoji: '🌙', label: 'Moon', category: 'cosmic' },
  { id: 'stk_alien', emoji: '👽', label: 'Alien', category: 'cosmic' },

  // Animals
  { id: 'stk_owl', emoji: '🦉', label: 'Owl', category: 'animals' },
  { id: 'stk_fox', emoji: '🦊', label: 'Fox', category: 'animals' },
  { id: 'stk_otter', emoji: '🦦', label: 'Otter', category: 'animals' },
  { id: 'stk_bear', emoji: '🐻', label: 'Bear', category: 'animals' },
  { id: 'stk_fawn', emoji: '🦌', label: 'Deer', category: 'animals' },

  // Nature
  { id: 'stk_tree', emoji: '🌳', label: 'Tree', category: 'nature' },
  { id: 'stk_flower', emoji: '🌸', label: 'Flower', category: 'nature' },
  { id: 'stk_rainbow', emoji: '🌈', label: 'Rainbow', category: 'nature' },
  { id: 'stk_crystal', emoji: '💎', label: 'Crystal', category: 'nature' },

  // Tech / Fantasy
  { id: 'stk_robot', emoji: '🤖', label: 'Robot', category: 'tech' },
  { id: 'stk_gear', emoji: '⚙️', label: 'Gear', category: 'tech' },
  { id: 'stk_dragon', emoji: '🐲', label: 'Dragon', category: 'fantasy' },
  { id: 'stk_magic', emoji: '✨', label: 'Sparkles', category: 'fantasy' },
]

interface StickerPaletteProps {
  onSelectSticker: (sticker: StickerItem) => void
}

export const StickerPalette: React.FC<StickerPaletteProps> = ({ onSelectSticker }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        padding: '12px',
        backgroundColor: 'rgba(15, 23, 42, 0.8)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        maxWidth: '100%',
      }}
    >
      {STICKER_PACKS.map((sticker) => (
        <button
          key={sticker.id}
          onClick={() => onSelectSticker(sticker)}
          title={sticker.label}
          style={{
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '12px',
            padding: '8px',
            fontSize: '24px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '44px',
            height: '44px',
            transition: 'transform 0.15s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.2)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          {sticker.emoji}
        </button>
      ))}
    </div>
  )
}
