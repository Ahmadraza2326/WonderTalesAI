import React from 'react'
import type { VisualDemoModel } from '../../../../types/cinematicLesson'
import { InteractiveWaterTankSimulator } from '../../science/InteractiveWaterTankSimulator'

interface VisualDemoRendererProps {
  model: VisualDemoModel
}

export const VisualDemoRenderer: React.FC<VisualDemoRendererProps> = ({ model }) => {
  const { kind, title, subtitle, data } = model

  const renderDemoContent = () => {
    switch (kind) {
      case 'fraction_partition': {
        const totalParts = Number(data.totalParts || 2)
        const activeParts = Number(data.activeParts || 1)
        const shapeType = String(data.shapeType || 'pizza') // 'pizza' | 'bar'

        if (shapeType === 'bar') {
          return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', width: '100%' }}>
              <div
                style={{
                  display: 'flex',
                  width: '100%',
                  maxWidth: '440px',
                  height: '64px',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  border: '3px solid #38bdf8',
                  boxShadow: '0 0 24px rgba(56, 189, 248, 0.4)',
                }}
              >
                {Array.from({ length: totalParts }).map((_, i) => {
                  const isFilled = i < activeParts
                  return (
                    <div
                      key={i}
                      style={{
                        flex: 1,
                        backgroundColor: isFilled ? 'rgba(56, 189, 248, 0.7)' : 'rgba(30, 41, 59, 0.6)',
                        borderRight: i < totalParts - 1 ? '2px dashed rgba(255, 255, 255, 0.4)' : 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '18px',
                        fontWeight: 800,
                        color: isFilled ? '#ffffff' : '#94a3b8',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      1/{totalParts}
                    </div>
                  )
                })}
              </div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#38bdf8' }}>
                {activeParts}/{totalParts} of the Whole Bar
              </div>
            </div>
          )
        }

        // Pizza Circle Partition
        return (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '180px',
                height: '180px',
                borderRadius: '50%',
                background: 'conic-gradient(#f59e0b 0% 50%, #78350f 50% 100%)',
                border: '4px solid #fde047',
                boxShadow: '0 0 30px rgba(245, 158, 11, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              <span style={{ fontSize: '48px' }}>🍕</span>
            </div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#fde047' }}>
              Splitting into {totalParts} Equal Slices (Each Slice = 1/{totalParts})
            </div>
          </div>
        )
      }

      case 'ten_frame_counting': {
        const count = Number(data.count || 5)
        const max = Number(data.max || 10)
        const isArray12 = max === 12 && count === 12

        if (isArray12) {
          // Dedicated 3x4 Starforge Array Demonstration
          return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', width: '100%' }}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  padding: '16px 24px',
                  borderRadius: '20px',
                  background: 'rgba(2, 6, 23, 0.85)',
                  border: '2px solid #38bdf8',
                  boxShadow: '0 0 32px rgba(56, 189, 248, 0.35)',
                }}
              >
                {[0, 1, 2].map((rowIndex) => (
                  <div key={rowIndex} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 800, color: '#38bdf8', minWidth: '55px' }}>
                      Row {rowIndex + 1}:
                    </span>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {[0, 1, 2, 3].map((colIndex) => (
                        <div
                          key={colIndex}
                          style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '10px',
                            backgroundColor: 'rgba(56, 189, 248, 0.25)',
                            border: '1.5px solid #38bdf8',
                            boxShadow: '0 0 12px rgba(56, 189, 248, 0.5)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <polygon
                              points="12,2 15,8.5 22,9.5 17,14.5 18.5,21.5 12,18 5.5,21.5 7,14.5 2,9.5 9,8.5"
                              fill="#fde047"
                              stroke="#f59e0b"
                              strokeWidth="1.2"
                            />
                          </svg>
                        </div>
                      ))}
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: 800, color: '#fde047', minWidth: '45px' }}>
                      4 Stars
                    </span>
                  </div>
                ))}
              </div>

              {/* Repeated Addition & Multiplication Emergence */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '8px 18px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(56, 189, 248, 0.1)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                }}
              >
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#94a3b8' }}>
                  Repeated Addition: <span style={{ color: '#ffffff', fontWeight: 800 }}>4 + 4 + 4 = 12</span>
                </div>
                <div style={{ fontSize: '20px', fontWeight: 900, color: '#38bdf8' }}>
                  3 Rows × 4 Columns = 12 Total Stars
                </div>
              </div>
            </div>
          )
        }

        return (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gap: '10px',
                padding: '16px',
                borderRadius: '18px',
                background: 'rgba(30, 41, 59, 0.8)',
                border: '2px solid rgba(56, 189, 248, 0.5)',
              }}
            >
              {Array.from({ length: max }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    backgroundColor: i < count ? 'rgba(56, 189, 248, 0.3)' : 'rgba(15, 23, 42, 0.6)',
                    border: '1.5px dashed rgba(255, 255, 255, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {i < count ? (
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                      <polygon
                        points="12,2 15,8.5 22,9.5 17,14.5 18.5,21.5 12,18 5.5,21.5 7,14.5 2,9.5 9,8.5"
                        fill="#fde047"
                        stroke="#f59e0b"
                        strokeWidth="1.2"
                      />
                    </svg>
                  ) : (
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#38bdf8' }}>
              {count} / {max} Star Gems Counted
            </div>
          </div>
        )
      }

      case 'number_line_jump': {
        const start = Number(data.start || 0)
        const target = Number(data.target || 5)
        return (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', width: '100%' }}>
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', padding: '12px 4px', maxWidth: '100%' }}>
              {Array.from({ length: 11 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    minWidth: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    backgroundColor: i === start ? '#3b82f6' : i === target ? '#10b981' : 'rgba(30, 41, 59, 0.7)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                    fontWeight: 800,
                    color: '#ffffff',
                  }}
                >
                  {i}
                </div>
              ))}
            </div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: '#38bdf8' }}>
              Hopping from Stone {start} ➔ Stone {target}
            </div>
          </div>
        )
      }

      case 'phoneme_sound_wave': {
        const cards = Array.isArray(data.cards) ? (data.cards as Array<{ icon: string; label: string; sound: string }>) : [
          { icon: '🐱', label: 'Cat', sound: '"Meow"' },
          { icon: '🐶', label: 'Dog', sound: '"Woof"' },
          { icon: '🐸', label: 'Frog', sound: '"Ribbit"' },
        ]
        return (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', justifyContent: 'center' }}>
            {cards.map((c, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '14px 18px',
                  borderRadius: '16px',
                  background: 'rgba(30, 41, 59, 0.75)',
                  border: '1.5px solid rgba(168, 85, 247, 0.4)',
                }}
              >
                <span style={{ fontSize: '36px' }}>{c.icon}</span>
                <span style={{ fontSize: '14px', fontWeight: 800, color: '#f8fafc' }}>{c.label}</span>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#c084fc' }}>{c.sound}</span>
              </div>
            ))}
          </div>
        )
      }

      case 'science_phenomenon': {
        if (data.phenomenon === 'plant_anatomy') {
          return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
                <div style={{ padding: '10px 14px', borderRadius: '12px', background: 'rgba(236, 72, 153, 0.2)', border: '1px solid #ec4899', textAlign: 'center' }}>
                  <span style={{ fontSize: '28px' }}>🌸</span>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: '#f472b6' }}>Flower</div>
                </div>
                <div style={{ padding: '10px 14px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10b981', textAlign: 'center' }}>
                  <span style={{ fontSize: '28px' }}>🍃</span>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: '#34d399' }}>Leaves</div>
                </div>
                <div style={{ padding: '10px 14px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.2)', border: '1px solid #f59e0b', textAlign: 'center' }}>
                  <span style={{ fontSize: '28px' }}>🎋</span>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: '#fbbf24' }}>Stem</div>
                </div>
                <div style={{ padding: '10px 14px', borderRadius: '12px', background: 'rgba(139, 92, 246, 0.2)', border: '1px solid #8b5cf6', textAlign: 'center' }}>
                  <span style={{ fontSize: '28px' }}>🌱</span>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: '#a78bfa' }}>Roots</div>
                </div>
              </div>
            </div>
          )
        }
        return <InteractiveWaterTankSimulator />
      }

      case 'calm_breathing': {
        return (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '140px',
                height: '140px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, #38bdf8 0%, #a855f7 70%, #4338ca 100%)',
                boxShadow: '0 0 35px rgba(56, 189, 248, 0.7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'pulse 4s infinite ease-in-out',
              }}
            >
              <span style={{ fontSize: '48px' }}>🌊</span>
            </div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: '#a5f3fc' }}>
              Breathe In Slowly... And Breathe Out Gently...
            </div>
          </div>
        )
      }

      case 'color_mixing': {
        return (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#3b82f6', boxShadow: '0 0 16px #3b82f6' }} />
            <span style={{ fontSize: '24px', fontWeight: 800 }}>+</span>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#eab308', boxShadow: '0 0 16px #eab308' }} />
            <span style={{ fontSize: '24px', fontWeight: 800 }}>=</span>
            <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 24px #10b981' }} />
          </div>
        )
      }

      case 'rhythm_cadence': {
        const dynamic = String(data.dynamic || 'crescendo')
        const tempo = Number(data.tempo || 80)
        return (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', width: '100%' }}>
              {/* Piano Card */}
              <div
                style={{
                  flex: 1,
                  minWidth: '140px',
                  padding: '16px',
                  borderRadius: '16px',
                  background: 'rgba(56, 189, 248, 0.15)',
                  border: '2px solid #38bdf8',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '24px', fontWeight: 900, color: '#38bdf8' }}>p (Piano)</div>
                <div style={{ fontSize: '12px', color: '#cbd5e1', marginTop: '4px' }}>Soft & Gentle Wave</div>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: '4px', height: '36px', marginTop: '8px' }}>
                  <div style={{ width: '6px', height: '12px', background: '#38bdf8', borderRadius: '3px' }} />
                  <div style={{ width: '6px', height: '18px', background: '#38bdf8', borderRadius: '3px' }} />
                  <div style={{ width: '6px', height: '14px', background: '#38bdf8', borderRadius: '3px' }} />
                  <div style={{ width: '6px', height: '10px', background: '#38bdf8', borderRadius: '3px' }} />
                </div>
              </div>

              {/* Dynamic Transition Icon */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontSize: '24px', color: '#f59e0b' }}>&lt;</span>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#fbbf24', textTransform: 'uppercase' }}>
                  {dynamic}
                </span>
              </div>

              {/* Forte Card */}
              <div
                style={{
                  flex: 1,
                  minWidth: '140px',
                  padding: '16px',
                  borderRadius: '16px',
                  background: 'rgba(244, 63, 94, 0.15)',
                  border: '2px solid #f43f5e',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '24px', fontWeight: 900, color: '#f43f5e' }}>f (Forte)</div>
                <div style={{ fontSize: '12px', color: '#cbd5e1', marginTop: '4px' }}>Strong & Booming Wave</div>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: '4px', height: '36px', marginTop: '8px' }}>
                  <div style={{ width: '6px', height: '24px', background: '#f43f5e', borderRadius: '3px' }} />
                  <div style={{ width: '6px', height: '36px', background: '#f43f5e', borderRadius: '3px' }} />
                  <div style={{ width: '6px', height: '30px', background: '#f43f5e', borderRadius: '3px' }} />
                  <div style={{ width: '6px', height: '28px', background: '#f43f5e', borderRadius: '3px' }} />
                </div>
              </div>
            </div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#94a3b8' }}>
              Metronome Tempo: <span style={{ color: '#f8fafc' }}>{tempo} BPM</span>
            </div>
          </div>
        )
      }

      case 'code_robot_trace': {
        const path = Array.isArray(data.path) ? (data.path as string[]) : []
        const bugIndex = typeof data.bugIndex === 'number' ? data.bugIndex : -1
        const condition = data.condition ? String(data.condition) : undefined
        const branchTaken = data.branchTaken ? String(data.branchTaken) : undefined
        const iterations = data.iterations ? Number(data.iterations) : undefined
        const efficiency = data.efficiency ? String(data.efficiency) : undefined

        return (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', width: '100%' }}>
            {/* Command Flow Tokens */}
            {path.length > 0 && (
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                {path.map((step, idx) => {
                  const isBug = idx === bugIndex
                  return (
                    <div
                      key={idx}
                      style={{
                        padding: '8px 14px',
                        borderRadius: '12px',
                        backgroundColor: isBug ? 'rgba(239, 68, 68, 0.3)' : 'rgba(56, 189, 248, 0.2)',
                        border: isBug ? '2px solid #ef4444' : '1px solid #38bdf8',
                        color: isBug ? '#fca5a5' : '#7dd3fc',
                        fontWeight: 800,
                        fontSize: '13px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <span>{step === 'F' ? 'FORWARD' : step === 'L' ? 'TURN_LEFT' : step === 'R' ? 'TURN_RIGHT' : step}</span>
                      {isBug && <span style={{ fontSize: '14px' }}>❌</span>}
                    </div>
                  )
                })}
              </div>
            )}

            {/* Condition / Sensor Branching Callout */}
            {condition && (
              <div
                style={{
                  padding: '12px 18px',
                  borderRadius: '14px',
                  backgroundColor: 'rgba(168, 85, 247, 0.2)',
                  border: '1.5px solid #a855f7',
                  width: '100%',
                  boxSizing: 'border-box',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#c084fc' }}>
                  ⚡ Sensor Condition: <code>IF ({condition})</code>
                </div>
                {branchTaken && (
                  <div style={{ fontSize: '12px', color: '#e9d5ff', marginTop: '4px' }}>
                    ➔ Branch Activated: <strong style={{ color: '#38bdf8' }}>{branchTaken}</strong>
                  </div>
                )}
              </div>
            )}

            {/* Iteration / Matrix Efficiency Callout */}
            {iterations !== undefined && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-around',
                  width: '100%',
                  padding: '12px',
                  borderRadius: '14px',
                  backgroundColor: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700 }}>Total Executions</div>
                  <div style={{ fontSize: '18px', fontWeight: 900, color: '#38bdf8' }}>{iterations} ops</div>
                </div>
                {efficiency && (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700 }}>Complexity</div>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: '#34d399' }}>{efficiency}</div>
                  </div>
                )}
              </div>
            )}

            <div style={{ fontSize: '12px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>🤖</span>
              <span>BEEP-0 Execution Bus • Verified Safe</span>
            </div>
          </div>
        )
      }

      case 'balance_scale_mass': {
        const leftMass = Number(data.leftMass || 15)
        const rightMass = Number(data.rightMass || 15)
        const unknownVal = Number(data.unknownValue || 8)
        const isBalanced = leftMass === rightMass

        return (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', width: '100%' }}>
            {/* Visual Balance Scale */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                maxWidth: '460px',
                padding: '16px',
                borderRadius: '18px',
                backgroundColor: 'rgba(15, 23, 42, 0.8)',
                border: '2px solid rgba(245, 158, 11, 0.4)',
              }}
            >
              {/* Left Pan */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '12px 18px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(56, 189, 248, 0.2)',
                  border: '1.5px solid #38bdf8',
                }}
              >
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#38bdf8' }}>LEFT PAN</span>
                <span style={{ fontSize: '16px', fontWeight: 900, color: '#f8fafc', marginTop: '2px' }}>
                  x + 7g ({leftMass}g)
                </span>
              </div>

              {/* Equilibrium Fulcrum */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontSize: '28px' }}>⚖️</span>
                <span style={{ fontSize: '11px', fontWeight: 800, color: isBalanced ? '#10b981' : '#f59e0b' }}>
                  {isBalanced ? '✓ IN BALANCE' : 'UNBALANCED'}
                </span>
              </div>

              {/* Right Pan */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '12px 18px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(245, 158, 11, 0.2)',
                  border: '1.5px solid #f59e0b',
                }}
              >
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#f59e0b' }}>RIGHT PAN</span>
                <span style={{ fontSize: '16px', fontWeight: 900, color: '#f8fafc', marginTop: '2px' }}>
                  {rightMass}g
                </span>
              </div>
            </div>

            {/* Algebraic Solution Callout */}
            <div
              style={{
                padding: '10px 16px',
                borderRadius: '12px',
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid #10b981',
                color: '#6ee7b7',
                fontSize: '13px',
                fontWeight: 800,
              }}
            >
              x + 7 = {rightMass} ➔ x = {rightMass} - 7 = <strong style={{ color: '#ffffff' }}>{unknownVal}</strong>
            </div>
          </div>
        )
      }

      default:
        return (
          <div style={{ fontSize: '44px', textAlign: 'center', padding: '16px' }}>
            ✨ 🪄 🌟
          </div>
        )
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
        padding: '24px',
        borderRadius: '24px',
        background: 'rgba(15, 23, 42, 0.75)',
        border: '1.5px solid rgba(255, 255, 255, 0.15)',
        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.4)',
        maxWidth: '680px',
        width: '100%',
        margin: '0 auto',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <h3 style={{ margin: '0 0 4px', fontSize: '20px', fontWeight: 800, color: '#f8fafc' }}>
          {title}
        </h3>
        {subtitle && (
          <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8' }}>
            {subtitle}
          </p>
        )}
      </div>

      <div style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '10px 0' }}>
        {renderDemoContent()}
      </div>
    </div>
  )
}
