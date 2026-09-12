import React from 'react'

export type IconKind =
  | 'citadel'
  | 'biome'
  | 'rune'
  | 'scroll'
  | 'book'
  | 'circuit'
  | 'enigma'
  | 'radiance'
  | 'globe'
  | 'map'
  | 'compass'
  | 'planet'
  | 'rocket'
  | 'star'
  | 'sparkle'
  | 'crystal'
  | 'arrow_right'
  | 'arrow_left'
  | 'check'
  | 'lock'
  | 'unlock'
  | 'shield'
  | 'play'
  | 'replay'
  | 'pause'
  | 'volume_on'
  | 'volume_off'
  | 'music'
  | 'sun'
  | 'moon'
  | 'user'
  | 'hint_bulb'
  | 'heart'
  | 'trophy'
  | 'wand'
  | 'grid'
  | 'scale'
  | 'drum'
  | 'palette'
  | 'robot'
  | 'north_star'
  | 'campfire'
  | 'easel'
  | 'balloon'
  | 'slide'
  | 'portal'
  | 'crystals'

export interface AnimatedIconProps {
  kind: IconKind
  size?: number | string
  color?: string
  glowColor?: string
  animate?: 'none' | 'pulse' | 'spin' | 'float' | 'bounce' | 'sparkle'
  className?: string
  style?: React.CSSProperties
  ariaLabel?: string
}

export const AnimatedIcon: React.FC<AnimatedIconProps> = ({
  kind,
  size = 24,
  color = 'currentColor',
  glowColor,
  animate = 'none',
  className = '',
  style,
  ariaLabel,
}) => {
  const pixelSize = typeof size === 'number' ? `${size}px` : size

  const getAnimationClass = () => {
    switch (animate) {
      case 'pulse':
        return 'orbis-icon-pulse'
      case 'spin':
        return 'orbis-icon-spin'
      case 'float':
        return 'orbis-icon-float'
      case 'bounce':
        return 'orbis-icon-bounce'
      case 'sparkle':
        return 'orbis-icon-sparkle'
      default:
        return ''
    }
  }

  const renderPath = () => {
    switch (kind) {
      case 'citadel':
        return (
          <path
            d="M12 2L2 7v4c0 5.55 3.84 10.74 10 12 6.16-1.26 10-6.45 10-12V7l-10-5zm0 4a3 3 0 110 6 3 3 0 010-6zm-4 13.5c-.83-.75-1.55-1.63-2.12-2.61.94-.96 2.37-1.89 4.12-2.22 1.75.33 3.18 1.26 4.12 2.22-.57.98-1.29 1.86-2.12 2.61L12 19.5z"
            fill={color}
          />
        )
      case 'biome':
      case 'globe':
        return (
          <path
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"
            fill={color}
          />
        )
      case 'map':
      case 'compass':
        return (
          <path
            d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z"
            fill={color}
          />
        )
      case 'rune':
        return (
          <path
            d="M12 2L4 6v6c0 5 3.5 9.7 8 11 4.5-1.3 8-6 8-11V6l-8-4zm1 14h-2v-4H9v-2h2V8h2v2h2v2h-2v4z"
            fill={color}
          />
        )
      case 'scroll':
      case 'book':
        return (
          <path
            d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4zm12 16H6v-2h12v2zm0-4H6v-2h12v2zm0-4h-5V4h5v8z"
            fill={color}
          />
        )
      case 'planet':
        return (
          <path
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-2.32-.28-4.39-1.47-5.74-3.19l1.45-1.45c.42.42.92.76 1.48.98.54.21 1.13.33 1.74.34l.07 2.32c.33.01.67.01 1 0v-2.32c1.88-.04 3.5-1.07 4.36-2.59l1.79 1.79c-1.59 2.47-4.2 4.16-7.23 4.47zM18.8 8.44l-1.8 1.8c-.54-.95-1.41-1.68-2.45-2.06V5.81c3.08.38 5.71 2.16 7.25 4.7l-1.8 1.8c-.37-.73-.85-1.37-1.2-1.87z"
            fill={color}
          />
        )
      case 'rocket':
        return (
          <path
            d="M13.13 2.18c-1.5-.4-3.05-.18-4.38.64C7.43 3.65 6.5 5.08 6.18 6.69l-.77 3.86-2.45 2.45c-.39.39-.39 1.02 0 1.41l3.54 3.54c.39.39 1.02.39 1.41 0l2.45-2.45 3.86-.77c1.61-.32 3.04-1.25 3.87-2.57.82-1.33 1.04-2.88.64-4.38l-5.6-5.6zm-1.41 5.65c-.78 0-1.41-.63-1.41-1.41s.63-1.41 1.41-1.41 1.41.63 1.41 1.41-.63 1.41-1.41 1.41zM4 20l4-1-3-3-1 4z"
            fill={color}
          />
        )
      case 'circuit':
        return (
          <path
            d="M20 9V7c0-1.1-.9-2-2-2h-3c0-1.66-1.34-3-3-3S9 3.34 9 5H6c-1.1 0-2 .9-2 2v2c-1.66 0-3 1.34-3 3s1.34 3 3 3v2c0 1.1.9 2 2 2h3c0 1.66 1.34 3 3 3s3-1.34 3-3h3c1.1 0 2-.9 2-2v-2c1.66 0 3-1.34 3-3s-1.34-3-3-3zm-8-4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm6 11h-3v-2H9v2H6V7h12v9zm-6 4c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"
            fill={color}
          />
        )
      case 'enigma':
        return (
          <path
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 16h-2v-2h2v2zm1.07-7.75l-.9.92C12.45 11.9 12 12.5 12 14h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H7c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.04-.42 1.99-1.07 2.75z"
            fill={color}
          />
        )
      case 'radiance':
      case 'sparkle':
        return (
          <path
            d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5L12 2zm6.5 14.5l-1.5-4 1.5-4 4 1.5-4 1.5 4 1.5-4 1.5z"
            fill={color}
          />
        )
      case 'star':
        return (
          <path
            d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z"
            fill={color}
          />
        )
      case 'crystal':
        return (
          <path
            d="M12 2L4 9l8 13 8-13-8-7zm0 3.2L16.8 9H7.2L12 5.2zM6.5 10.5h11L12 18.8 6.5 10.5z"
            fill={color}
          />
        )
      case 'arrow_right':
        return (
          <path
            d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8-8-8z"
            fill={color}
          />
        )
      case 'arrow_left':
        return (
          <path
            d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"
            fill={color}
          />
        )
      case 'check':
        return (
          <path
            d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
            fill={color}
          />
        )
      case 'lock':
        return (
          <path
            d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"
            fill={color}
          />
        )
      case 'unlock':
        return (
          <path
            d="M12 13c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6-5h-1V6c0-2.76-2.24-5-5-5-2.28 0-4.27 1.54-4.84 3.75-.14.53.18 1.08.72 1.21.53.14 1.08-.18 1.22-.71C10.5 3.82 11.66 3 13 3c1.66 0 3 1.34 3 3v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm0 12H6V10h12v10z"
            fill={color}
          />
        )
      case 'shield':
        return (
          <path
            d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"
            fill={color}
          />
        )
      case 'play':
        return <path d="M8 5v14l11-7z" fill={color} />
      case 'pause':
        return <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" fill={color} />
      case 'replay':
        return (
          <path
            d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"
            fill={color}
          />
        )
      case 'volume_on':
        return (
          <path
            d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"
            fill={color}
          />
        )
      case 'volume_off':
        return (
          <path
            d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"
            fill={color}
          />
        )
      case 'music':
        return (
          <path
            d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"
            fill={color}
          />
        )
      case 'sun':
        return (
          <path
            d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06c.39-.39.39-1.03 0-1.41s-1.02-.39-1.41 0z"
            fill={color}
          />
        )
      case 'moon':
        return (
          <path
            d="M12.3 2a10 10 0 0 0-.19 1.4 10 10 0 0 0 10 10c.48 0 .95-.04 1.4-.11a10 10 0 1 1-11.21-11.29z"
            fill={color}
          />
        )
      case 'user':
        return (
          <path
            d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
            fill={color}
          />
        )
      case 'hint_bulb':
        return (
          <path
            d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-1.3l-.85-.6C8.78 13.1 8 11.88 8 9c0-2.21 1.79-4 4-4s4 1.79 4 4c0 2.88-.78 4.1-1.15 5.1z"
            fill={color}
          />
        )
      case 'heart':
        return (
          <path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            fill={color}
          />
        )
      case 'trophy':
        return (
          <path
            d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z"
            fill={color}
          />
        )
      case 'wand':
        return (
          <path
            d="M7.5 5.6L5.6 7.5l1.4 1.4 1.9-1.9L7.5 5.6zm1.4-1.4L7.5 2.8 5.6 4.7l1.4 1.4 1.9-1.9zm5.7 8.5l-1.9 1.9 1.4 1.4 1.9-1.9-1.4-1.4zm-1.4-1.4l-1.9 1.9 1.4 1.4 1.9-1.9-1.4-1.4zm4.3-4.3l-1.9 1.9 1.4 1.4 1.9-1.9-1.4-1.4zM2.5 18.5l3 3 14.5-14.5-3-3L2.5 18.5z"
            fill={color}
          />
        )
      case 'grid':
        return (
          <path
            d="M20 2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM8 20H4v-4h4v4zm0-6H4v-4h4v4zm0-6H4V4h4v4zm6 12h-4v-4h4v4zm0-6h-4v-4h4v4zm0-6h-4V4h4v4zm6 12h-4v-4h4v4zm0-6h-4v-4h4v4zm0-6h-4V4h4v4z"
            fill={color}
          />
        )
      case 'scale':
        return (
          <path
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"
            fill={color}
          />
        )
      case 'drum':
        return (
          <path
            d="M12 2C6.48 2 2 4.24 2 7v10c0 2.76 4.48 5 10 5s10-2.24 10-5V7c0-2.76-4.48-5-10-5zm0 2c4.41 0 8 1.34 8 3s-3.59 3-8 3-8-1.34-8-3 3.59-3 8-3zm8 13c0 1.66-3.59 3-8 3s-8-1.34-8-3v-2.3c2.09 1.41 5.33 2.3 8 2.3s5.91-.89 8-2.3V17zm0-4c0 1.66-3.59 3-8 3s-8-1.34-8-3v-2.3c2.09 1.41 5.33 2.3 8 2.3s5.91-.89 8-2.3V13z"
            fill={color}
          />
        )
      case 'palette':
        return (
          <path
            d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L4.35 19c-.48.6-.05 1.5.73 1.5H12c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"
            fill={color}
          />
        )
      case 'robot':
        return (
          <path
            d="M19 8h-1.07C17.46 5.16 14.97 3 12 3s-5.46 2.16-5.93 5H5c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h1v1c0 1.66 1.34 3 3 3h6c1.66 0 3-1.34 3-3v-1h1c1.1 0 2-.9 2-2v-6c0-1.1-.9-2-2-2zM9 11c.83 0 1.5.67 1.5 1.5S9.83 14 9 14s-1.5-.67-1.5-1.5S8.17 11 9 11zm6 5H9v-1h6v1zm0-2c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"
            fill={color}
          />
        )
      case 'north_star':
        return (
          <g fill={color}>
            {/* 8-pointed sparkling celestial compass star */}
            <path d="M12 0L14.4 8.6L23 11L14.4 13.4L12 22L9.6 13.4L1 11L9.6 8.6Z" />
            <path d="M12 4.5L13.8 9.8L19.5 11L13.8 12.2L12 17.5L10.2 12.2L4.5 11L10.2 9.8Z" opacity="0.4" />
            <circle cx="12" cy="11" r="2.5" />
          </g>
        )
      case 'campfire':
        return (
          <g fill={color}>
            {/* Cozy campfire logs and stylized flame */}
            <path d="M4 19L20 22M20 19L4 22" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
            <path d="M12 3C12 3 7.5 9 7.5 13.5C7.5 16.5 9.5 18.5 12 18.5C14.5 18.5 16.5 16.5 16.5 13.5C16.5 9 12 3 12 3ZM12 16.5C10.5 16.5 9.5 15.2 9.5 13.5C9.5 11 12 7.5 12 7.5C12 7.5 14.5 11 14.5 13.5C14.5 15.2 13.5 16.5 12 16.5Z" />
          </g>
        )
      case 'easel':
        return (
          <g fill={color}>
            {/* Story artist canvas easel */}
            <path d="M12 2V5M5 22L9 5M19 22L15 5M4 14H20" stroke={color} strokeWidth="2" strokeLinecap="round" />
            <rect x="6" y="5" width="12" height="9" rx="1.5" fill={color} opacity="0.85" />
            <circle cx="10" cy="8.5" r="1.5" fill="#ffffff" />
            <path d="M7 12.5L10 9.5L13 12.5L17 8.5" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" />
          </g>
        )
      case 'balloon':
        return (
          <g fill={color}>
            {/* Playroom pastel balloon bunch */}
            <path d="M12 2C8.7 2 6 4.7 6 8C6 11.5 10 16 11 17L10.5 18H13.5L13 17C14 16 18 11.5 18 8C18 4.7 15.3 2 12 2ZM10 6C9.4 6 9 5.6 9 5C9 4.4 9.4 4 10 4C11.1 4 12 4.9 12 6C12 6.6 11.6 7 11 7C10.4 7 10 6.6 10 6Z" />
            <path d="M12 18V22" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeDasharray="1 2" />
          </g>
        )
      case 'slide':
        return (
          <g fill={color}>
            {/* Playground slide & ladder */}
            <path d="M4 4V20M8 4V20M4 8H8M4 12H8M4 16H8M8 6C12 6 15 10 16 15C16.5 17.5 18 20 21 20" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </g>
        )
      case 'portal':
        return (
          <g fill={color}>
            {/* Academy arcane glowing portal */}
            <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" strokeDasharray="3 3" fill="none" />
            <ellipse cx="12" cy="12" rx="6" ry="3" stroke={color} strokeWidth="1.5" fill="none" />
            <circle cx="12" cy="12" r="3" />
          </g>
        )
      case 'crystals':
        return (
          <g fill={color}>
            {/* Crystalline cluster */}
            <path d="M12 2L15 8L12 18L9 8Z" opacity="0.9" />
            <path d="M6 9L9 13L6 20L4 14Z" opacity="0.7" />
            <path d="M18 9L20 14L18 20L15 13Z" opacity="0.7" />
          </g>
        )
      default:
        return <circle cx="12" cy="12" r="10" fill={color} />
    }
  }

  return (
    <span
      className={`orbis-animated-icon-wrapper ${getAnimationClass()} ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: pixelSize,
        height: pixelSize,
        filter: glowColor ? `drop-shadow(0 0 8px ${glowColor})` : undefined,
        ...style,
      }}
      role={ariaLabel ? 'img' : undefined}
      aria-label={ariaLabel}
      aria-hidden={!ariaLabel}
    >
      <svg viewBox="0 0 24 24" width="100%" height="100%" style={{ display: 'block' }}>
        {renderPath()}
      </svg>
    </span>
  )
}
