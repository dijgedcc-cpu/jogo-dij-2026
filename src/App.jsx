import { useState, useCallback, useEffect } from 'react'
import './App.css'
import { gameData } from './data'
import { sounds } from './audio'

function App() {
  const [gameState, setGameState] = useState('start')
  const [currentCaseIndex, setCurrentCaseIndex] = useState(0)
  const [actionResult, setActionResult] = useState(null)
  const [scores, setScores] = useState({ best: 0, good: 0, poor: 0 })
  const [history, setHistory] = useState([])

  const [showAlmanac, setShowAlmanac] = useState(false)
  const [selectedHero, setSelectedHero] = useState(null)
  const [zoomedImage, setZoomedImage] = useState(null)

  const [energy, setEnergy] = useState(100)
  const [fatiguedHeroes, setFatiguedHeroes] = useState([])
  const [gameCases, setGameCases] = useState([])

  const [playerName, setPlayerName] = useState('')
  const [hasSavedScore, setHasSavedScore] = useState(false)
  const [leaderboard, setLeaderboard] = useState([])

  useEffect(() => {
    fetch('/api/leaderboard')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setLeaderboard(data);
      })
      .catch(err => {
        console.warn('API indisponível, usando placar offline.', err);
        const saved = localStorage.getItem('dij_leaderboard')
        if (saved) setLeaderboard(JSON.parse(saved));
      });
  }, [])

  const startGame = useCallback(() => {
    sounds.playClick();
    const shuffled = [...gameData.cases].sort(() => 0.5 - Math.random())
    setGameCases(shuffled.slice(0, 5))
    setGameState('intro')
    setCurrentCaseIndex(0)
    setScores({ best: 0, good: 0, poor: 0 })
    setHistory([])
    setEnergy(100)
    setFatiguedHeroes([])
    setHasSavedScore(false)
    setPlayerName('')
  }, [])

  const beginCases = useCallback(() => {
    sounds.playClick();
    setGameState('playing')
  }, [])

  const saveToLeaderboard = useCallback(async () => {
    if (!playerName.trim()) return
    const finalScore = scores.best * 1000 + scores.good * 500 + energy * 10
    
    const newEntry = {
      name: playerName.trim().substring(0, 10).toUpperCase(),
      score: finalScore,
      date: new Date().toLocaleDateString()
    }
    
    try {
      const res = await fetch('/api/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEntry)
      })
      
      if (!res.ok) throw new Error('Falha na API da Vercel')
      
      const updatedBoard = await res.json()
      if (Array.isArray(updatedBoard)) setLeaderboard(updatedBoard)
    } catch (err) {
      console.warn('Salvando pontuação localmente (offline):', err)
      const updatedBoard = [...leaderboard, newEntry].sort((a, b) => b.score - a.score).slice(0, 10)
      setLeaderboard(updatedBoard)
      localStorage.setItem('dij_leaderboard', JSON.stringify(updatedBoard))
    }
    
    setHasSavedScore(true)
  }, [playerName, scores, energy, leaderboard])

  const getCharacterById = useCallback((id) => {
    return gameData.characters.find(c => c.id === id)
  }, [])

  const handleActionSelect = useCallback((action) => {
    const character = getCharacterById(action.characterId)
    if (fatiguedHeroes.includes(character.id)) return
    
    const quality = action.quality
    if (quality === 'best') sounds.playSuccess();
    else if (quality === 'good') sounds.playGood();
    else if (quality === 'poor') sounds.playError();

    let energyChange = 0
    if (quality === 'best') energyChange = 10
    if (quality === 'good') energyChange = -5
    if (quality === 'poor') energyChange = -30

    setEnergy(prev => Math.min(100, Math.max(0, prev + energyChange)))

    setScores(prev => ({
      ...prev,
      [quality]: prev[quality] + 1
    }))

    setHistory(prev => [...prev, {
      caseId: gameCases[currentCaseIndex].id,
      caseTitle: gameCases[currentCaseIndex].title,
      character: character.name,
      characterEmoji: character.emoji,
      quality,
      resultText: action.resultText
    }])

    setActionResult({
      quality,
      character,
      action,
      energyChange
    })
    setGameState('result')
  }, [currentCaseIndex, getCharacterById, fatiguedHeroes, gameCases])

  const nextCase = useCallback(() => {
    sounds.playClick();
    if (energy <= 0) {
      setGameState('gameover')
      return
    }

    let nextFatigued = []
    if (actionResult?.quality === 'poor') {
      nextFatigued = [actionResult.character.id]
    }

    if (currentCaseIndex < gameCases.length - 1) {
      setCurrentCaseIndex(prev => prev + 1)
      setGameState('playing')
      setActionResult(null)
      setFatiguedHeroes(nextFatigued)
    } else {
      setGameState('end')
    }
  }, [currentCaseIndex, gameCases.length, energy, actionResult])

  const currentCase = gameCases[currentCaseIndex]
  const progress = gameCases.length ? ((currentCaseIndex + (gameState === 'result' || gameState === 'end' ? 1 : 0)) / gameCases.length) * 100 : 0

  const getQualityInfo = (quality) => {
    switch (quality) {
      case 'best': return { icon: '🌟', label: 'Escolha Excelente', badge: 'Amor Pleno' }
      case 'good': return { icon: '✅', label: 'Boa Escolha', badge: 'Caminho Válido' }
      case 'poor': return { icon: '⚠️', label: 'Escolha Difícil', badge: 'Fadiga Espiritual Ativada' }
      default: return { icon: '❓', label: 'Resultado', badge: '' }
    }
  }

  const getFinalRating = () => {
    const total = scores.best + scores.good + scores.poor
    if (total === 0) return { title: '—', message: '' }
    const ratio = (scores.best * 3 + scores.good * 2 + scores.poor * 0) / (total * 3)
    if (ratio >= 0.8) return {
      title: 'Mestre do Amor Divino',
      message: 'Suas escolhas demonstraram profunda sabedoria, empatia e sensibilidade. Você é um verdadeiro agente de transformação! A Liga do Amor Divino orgulha-se da sua jornada.'
    }
    if (ratio >= 0.5) return {
      title: 'Guerreiro em Evolução',
      message: 'Você mostrou boas intenções e acertou em muitos momentos! Com mais prática e reflexão, pode se tornar um verdadeiro Mestre do Amor. Continue aprendendo com cada caso.'
    }
    return {
      title: 'Aprendiz da Luz',
      message: 'A jornada foi desafiadora e nem todas as escolhas foram as mais adequadas. Mas o mais importante na espiritualidade é o aprendizado! Refaça a jornada e tente novos caminhos.'
    }
  }

  return (
    <div className="game-container">
      {/* ===== HEADER NAVIGATION ===== */}
      <div className="game-header-bar">
        <span className="game-brand" onClick={() => setGameState('start')}>🌟 Jogo DIJ 2026</span>
        <button className="btn-almanac-trigger" onClick={() => setShowAlmanac(true)}>
          📖 Almanac da Liga ({gameData.characters.length})
        </button>
      </div>

      {/* ===== START SCREEN ===== */}
      {gameState === 'start' && (
        <div className="start-screen">
          <div className="game-logo">🌟</div>
          <h1>DIJ 2026</h1>
          <p className="subtitle">A Arte de Conviver com as Diferenças</p>
          <p className="start-description">
            Assuma o controle da <strong style={{ color: 'var(--primary)' }}>Liga do Amor Divino</strong> e 
            use a sabedoria dos seus heróis para resolver 5 conflitos reais do dia a dia. 
            Cada escolha importa. Cada ação gera consequências vibracionais.
          </p>
          <div className="start-features">
            <div className="feature-badge">📖 5 Casos Práticos</div>
            <div className="feature-badge">🦸 9 Heróis com Habilidades</div>
            <div className="feature-badge">⚡ Sistema de Fadiga Espiritual</div>
          </div>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button className="btn" onClick={startGame}>
              Começar Jornada ➜
            </button>
            <button className="btn-secondary" onClick={() => setGameState('leaderboardView')}>
              🏆 Ver Placar
            </button>
            <button className="btn-secondary" onClick={() => setShowAlmanac(true)}>
              📖 Conhecer os Heróis
            </button>
          </div>
        </div>
      )}

      {/* ===== LEADERBOARD VIEW ===== */}
      {gameState === 'leaderboardView' && (
        <div className="end-screen">
          <div className="end-trophy">🏆</div>
          <h1>Placar dos Campeões</h1>
          
          <div className="leaderboard-section" style={{ marginTop: '2rem' }}>
            {leaderboard.length > 0 ? (
              <table className="leaderboard-table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Jogador</th>
                    <th>Pontos</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry, idx) => (
                    <tr key={idx}>
                      <td>#{idx + 1}</td>
                      <td>{entry.name}</td>
                      <td style={{ color: 'var(--accent)', fontWeight: 'bold' }}>{entry.score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>Nenhuma pontuação registrada ainda. Seja o primeiro!</p>
            )}
          </div>

          <button className="btn" style={{ marginTop: '2rem' }} onClick={() => setGameState('start')}>
            Voltar ao Início
          </button>
        </div>
      )}

      {/* ===== INTRO SCREEN ===== */}
      {gameState === 'intro' && (
        <div className="intro-screen">
          <h1>Sua Equipe</h1>
          <p className="subtitle">A Liga do Amor Divino</p>
          <p className="intro-text">
            Você lidera a <strong>Fraternidade do Amor e da Luz</strong>. 
            Para cada desafio que encontrar, precisará escolher a melhor abordagem 
            usando as habilidades únicas de seus heróis. Escolhas sábias geram 
            <strong style={{ color: 'var(--accent)' }}> Amor Pleno</strong>. 
            Escolhas precipitadas ativam a 
            <strong style={{ color: 'var(--error)' }}> Fadiga Espiritual</strong>.
          </p>
          <div className="team-grid">
            {gameData.characters.map((char, i) => (
              <div 
                key={char.id} 
                className="team-chip"
                style={{ animationDelay: `${i * 0.08}s`, cursor: 'pointer', borderLeftColor: char.color }}
                onClick={() => {
                  setSelectedHero(char)
                  setShowAlmanac(true)
                }}
              >
                <img src={char.avatar} alt={char.name} className="team-chip-avatar" />
                <div className="team-chip-info">
                  <span style={{ color: char.color, fontWeight: 700 }}>{char.name}</span>
                  <span className="team-chip-emoji">{char.emoji}</span>
                </div>
              </div>
            ))}
          </div>
          <button className="btn" onClick={beginCases}>
            Iniciar o Primeiro Caso ➜
          </button>
        </div>
      )}

      {/* ===== PLAYING SCREEN ===== */}
      {gameState === 'playing' && currentCase && (
        <div>
          {/* Progress and Energy */}
          <div className="progress-bar-container">
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <span className="progress-label">
              Caso {currentCaseIndex + 1} de {gameCases.length}
            </span>
          </div>
          
          <div className="energy-bar-container">
            <div className="energy-label">Luz da Liga: {energy}%</div>
            <div className="energy-track">
              <div className="energy-fill" style={{ width: `${energy}%`, background: energy > 50 ? 'var(--accent)' : energy > 20 ? 'var(--warning)' : 'var(--error)' }} />
            </div>
          </div>

          {/* Case Card */}
          <div className="case-card">
            <div className="case-header">
              <div className="case-icon">{currentCase.icon}</div>
              <div className="case-title-group">
                <div className="case-label">Caso {currentCase.id}</div>
                <div className="case-title">{currentCase.title}</div>
              </div>
            </div>
            <p className="case-desc">{currentCase.description}</p>
          </div>

          {/* Actions */}
          <div className="actions-section">
            <h3>⚡ Como a equipe deve agir?</h3>
            <div className="options-grid">
              {currentCase.actions.map((action, idx) => {
                const char = getCharacterById(action.characterId)
                const isFatigued = fatiguedHeroes.includes(char.id)
                return (
                  <div
                    key={idx}
                    className={`option-card ${isFatigued ? 'disabled' : ''}`}
                    style={{ borderLeftColor: isFatigued ? 'var(--text-dim)' : char.color }}
                    onClick={() => handleActionSelect(action)}
                  >
                    <div className="option-avatar-wrapper">
                      <img src={char.avatar} alt={char.name} className="option-avatar" style={{ filter: isFatigued ? 'grayscale(100%)' : 'none' }} />
                      <span className="option-badge-emoji">{char.emoji}</span>
                    </div>
                    <div className="option-content">
                      <div className="option-char-name" style={{ color: isFatigued ? 'var(--text-dim)' : char.color }}>
                        {char.name} {isFatigued && <span className="fatigue-tag">💤 Em Recuperação</span>}
                      </div>
                      <div className="option-action-name" style={{ color: isFatigued ? 'var(--text-dim)' : 'var(--text)' }}>
                        {action.label}
                      </div>
                      <div className="option-desc" style={{ opacity: isFatigued ? 0.5 : 1 }}>
                        {isFatigued ? "Este herói sofreu fadiga no caso anterior e precisa descansar." : action.description}
                      </div>
                    </div>
                    {!isFatigued && <div className="option-arrow">→</div>}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* ===== RESULT SCREEN ===== */}
      {gameState === 'result' && actionResult && (() => {
        const info = getQualityInfo(actionResult.quality)
        return (
          <div className="result-screen">
            <div className="result-hero-avatar-container">
              <img src={actionResult.character.avatar} alt={actionResult.character.name} className="result-hero-avatar" style={{ borderColor: actionResult.character.color }} />
              <div className="result-icon">{info.icon}</div>
            </div>
            <div className={`result-badge ${actionResult.quality}`}>
              {info.badge}
            </div>
            <h2 className="result-title">{info.label}</h2>
            <div className="result-character">
              <span style={{ fontSize: '1.4rem' }}>{actionResult.character.emoji}</span>
              <span style={{ color: actionResult.character.color, fontWeight: 700 }}>
                {actionResult.character.name}
              </span>
              <span style={{ color: 'var(--text-dim)' }}>usou</span>
              <span style={{ fontWeight: 600 }}>{actionResult.action.label}</span>
            </div>
            <p className="result-text">
              {actionResult.action.resultText}
            </p>

            {/* FADIGA ESPIRITUAL WARNING IF POOR */}
            {actionResult.quality === 'poor' && (
              <div className="fatigue-warning-box">
                <div className="fatigue-title">⚡ Efeito de Fadiga Espiritual Ativado:</div>
                <div className="fatigue-desc">
                  <strong>{actionResult.character.name}</strong> sofreu com <span>"{actionResult.character.fatigue}"</span>. O herói ficará indisponível no próximo caso.
                </div>
              </div>
            )}
            
            <div className="energy-change-box">
               Efeito na Luz da Liga: <strong style={{ color: actionResult.energyChange > 0 ? 'var(--accent)' : 'var(--error)'}}>{actionResult.energyChange > 0 ? `+${actionResult.energyChange}%` : `${actionResult.energyChange}%`}</strong>
            </div>

            <div className="result-buttons" style={{ marginTop: '1.5rem' }}>
              <button className="btn" onClick={nextCase}>
                {currentCaseIndex < gameCases.length - 1 ? 'Próximo Caso ➜' : 'Ver Resultado Final ➜'}
              </button>
            </div>
          </div>
        )
      })()}

      {/* ===== GAME OVER SCREEN ===== */}
      {gameState === 'gameover' && (
        <div className="end-screen">
          <div className="end-trophy" style={{ filter: 'grayscale(100%)' }}>🥀</div>
          <h1 style={{ color: 'var(--error)' }}>Luz Esgotada!</h1>
          <p className="subtitle">A Liga sucumbiu à exaustão espiritual.</p>
          <p className="end-message">
            As decisões precipitadas e o excesso de fadiga consumiram toda a Luz da equipe antes de concluírem a jornada. 
            Lembre-se de balancear as abordagens e não ignorar as dores reais.
          </p>
          <button className="btn" onClick={startGame}>
             🔄 Tentar Novamente
          </button>
        </div>
      )}

      {/* ===== END SCREEN ===== */}
      {gameState === 'end' && (() => {
        const rating = getFinalRating()
        const finalScore = scores.best * 1000 + scores.good * 500 + energy * 10
        return (
          <div className="end-screen">
            <div className="end-trophy">🏆</div>
            <h1>Jornada Concluída!</h1>
            <p className="subtitle">{rating.title}</p>

            <div className="score-display">
              <div className="score-item">
                <div className="score-value" style={{ color: 'var(--accent)' }}>{scores.best}</div>
                <div className="score-label">Excelentes</div>
              </div>
              <div className="score-item">
                <div className="score-value" style={{ color: 'var(--secondary)' }}>{scores.good}</div>
                <div className="score-label">Boas</div>
              </div>
              <div className="score-item">
                <div className="score-value" style={{ color: 'var(--error)' }}>{scores.poor}</div>
                <div className="score-label">Com Fadiga</div>
              </div>
            </div>
            
            {!hasSavedScore ? (
              <div className="save-score-section">
                <h3>Sua Pontuação Final: <span className="score-highlight">{finalScore}</span></h3>
                <p>Insira suas iniciais para o Placar dos Campeões:</p>
                <div className="save-score-form">
                  <input 
                    type="text" 
                    maxLength={10}
                    placeholder="SEU NOME" 
                    value={playerName} 
                    onChange={e => setPlayerName(e.target.value)}
                    className="score-input"
                  />
                  <button className="btn btn-success" onClick={saveToLeaderboard}>Salvar 💾</button>
                </div>
              </div>
            ) : (
              <div className="leaderboard-section">
                <h3>🏆 Placar dos Campeões 🏆</h3>
                <table className="leaderboard-table">
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Jogador</th>
                      <th>Pontos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.map((entry, idx) => (
                      <tr key={idx} className={entry.name === playerName.trim().substring(0,10).toUpperCase() && entry.score === finalScore ? 'highlight-row' : ''}>
                        <td>#{idx + 1}</td>
                        <td>{entry.name}</td>
                        <td style={{ color: 'var(--accent)', fontWeight: 'bold' }}>{entry.score}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <p className="end-message" style={{ marginTop: '2rem' }}>{rating.message}</p>

            {/* HISTÓRICO DAS DECISÕES */}
            {history.length > 0 && (
              <div className="history-section">
                <h3>📜 Resumo das Decisões do Grupo:</h3>
                <div className="history-list">
                  {history.map((item, idx) => (
                    <div key={idx} className={`history-card ${item.quality}`}>
                      <div className="history-header">
                        <span className="history-case">{item.caseTitle}</span>
                        <span className={`history-badge ${item.quality}`}>
                          {item.quality === 'best' ? '🌟 Amor Pleno' : item.quality === 'good' ? '✅ Bom' : '⚠️ Fadiga'}
                        </span>
                      </div>
                      <div className="history-hero">
                        {item.characterEmoji} <strong>{item.character}</strong>
                      </div>
                      <p className="history-text">{item.resultText}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="result-buttons" style={{ marginTop: '2rem' }}>
              <button className="btn" onClick={startGame}>
                🔄 Jogar Novamente
              </button>
            </div>
          </div>
        )
      })()}

      {/* ===== MODAL ALMANAC ===== */}
      {showAlmanac && (
        <div className="modal-backdrop" onClick={() => setShowAlmanac(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>📖 Almanaque da Liga do Amor Divino</h2>
              <button className="modal-close" onClick={() => setShowAlmanac(false)}>✕</button>
            </div>
            
            <div className="almanac-layout">
              {/* LIST OF HEROS */}
              <div className="hero-selector">
                {gameData.characters.map(char => (
                  <button 
                    key={char.id}
                    className={`hero-select-btn ${selectedHero?.id === char.id ? 'active' : ''}`}
                    onClick={() => setSelectedHero(char)}
                    style={{ borderLeftColor: char.color }}
                  >
                    <img src={char.avatar} alt={char.name} className="hero-select-avatar" />
                    <span style={{ fontWeight: 600 }}>{char.name}</span>
                  </button>
                ))}
              </div>

              {/* HERO DETAILS */}
              <div className="hero-details">
                {selectedHero ? (
                  <div>
                    <div className="hero-details-header">
                      <img src={selectedHero.avatar} alt={selectedHero.name} className="hero-detail-avatar" style={{ borderColor: selectedHero.color }} />
                      <div>
                        <h3 style={{ color: selectedHero.color, fontSize: '1.6rem', marginBottom: '0.2rem' }}>
                          {selectedHero.name} {selectedHero.emoji}
                        </h3>
                        <div className="hero-archetype">{selectedHero.archetype}</div>
                      </div>
                    </div>

                    {selectedHero.cardImage && (
                      <div className="hero-card-image-preview">
                        <img 
                          src={selectedHero.cardImage} 
                          alt={`Carta de ${selectedHero.name}`} 
                          className="hero-full-card-img" 
                          onClick={() => setZoomedImage(selectedHero.cardImage)}
                          style={{ cursor: 'zoom-in' }}
                        />
                      </div>
                    )}

                    <div className="hero-section-box">
                      <strong>📌 Função / Papel:</strong>
                      <p>{selectedHero.role}</p>
                    </div>

                    <div className="hero-section-box">
                      <strong>⚡ Habilidades Únicas:</strong>
                      <ul className="hero-skills-list">
                        {selectedHero.skills.map((skill, sIdx) => (
                          <li key={sIdx}>
                            <strong>{skill.name}:</strong> {skill.description}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="hero-section-box fatigue">
                      <strong>⚠️ Estado de Fadiga Espiritual:</strong>
                      <p>{selectedHero.fatigue}</p>
                    </div>
                  </div>
                ) : (
                  <div className="hero-select-prompt">
                    <span>👈 Selecione um herói para visualizar a ficha de poderes e arquétipos.</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== ZOOMED IMAGE LIGHTBOX ===== */}
      {zoomedImage && (
        <div className="lightbox-overlay" onClick={() => setZoomedImage(null)}>
          <div className="lightbox-content" onClick={e => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setZoomedImage(null)}>✕</button>
            <img src={zoomedImage} alt="Carta Ampliada" className="lightbox-img" />
          </div>
        </div>
      )}
    </div>
  )
}

export default App
