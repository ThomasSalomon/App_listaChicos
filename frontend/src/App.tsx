import { useState, useEffect } from 'react'
import './App.css'

interface Team {
  id: number
  nombre: string
  descripcion?: string
  color: string
  activo: boolean
  created_at: string
  updated_at: string
}

interface Child {
  id: number
  nombre: string
  apellido: string
  edad: number
  team_id: number
  team_nombre?: string
  team_color?: string
  created_at: string
  updated_at: string
}

const API_BASE_URL = 'http://localhost:3001/api'

function App() {
  const [teams, setTeams] = useState<Team[]>([])
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)
  const [children, setChildren] = useState<Child[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentView, setCurrentView] = useState<'menu' | 'team-management'>('menu')
  
  // Estados para el formulario
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [edad, setEdad] = useState('')
  const [showAddChild, setShowAddChild] = useState(false)
  // Estados para modales personalizados
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [alertType, setAlertType] = useState<'info' | 'error' | 'success' | 'warning'>('info')
  const [showConfirm, setShowConfirm] = useState(false)
  const [confirmMessage, setConfirmMessage] = useState('')
  const [confirmCallback, setConfirmCallback] = useState<(() => void) | null>(null)

  // Estados para crear nuevo equipo
  const [showCreateTeam, setShowCreateTeam] = useState(false)
  const [teamName, setTeamName] = useState('')
  const [teamDescription, setTeamDescription] = useState('')
  const [teamColor, setTeamColor] = useState('#3B82F6')

  // Funciones auxiliares para modales
  const showCustomAlert = (message: string, type: 'info' | 'error' | 'success' | 'warning' = 'info') => {
    setAlertMessage(message)
    setAlertType(type)
    setShowAlert(true)
  }

  const showCustomConfirm = (message: string, callback: () => void) => {
    setConfirmMessage(message)
    setConfirmCallback(() => callback)
    setShowConfirm(true)
  }

  const handleConfirmAccept = () => {
    if (confirmCallback) {
      confirmCallback()
    }
    setShowConfirm(false)
    setConfirmCallback(null)
  }

  const handleConfirmCancel = () => {
    setShowConfirm(false)
    setConfirmCallback(null)
  }

  // Cargar equipos al iniciar
  useEffect(() => {
    loadTeams()
  }, [])

  // Cargar niños cuando se selecciona un equipo
  useEffect(() => {
    if (selectedTeam) {
      loadChildren(selectedTeam.id)
    }
  }, [selectedTeam])

  const loadTeams = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/teams`)
      if (!response.ok) {
        throw new Error('Error al cargar equipos')
      }
      const teamsData = await response.json()
      setTeams(teamsData)
      
      // NO seleccionar equipo automáticamente - el usuario debe elegir
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  const loadChildren = async (teamId: number) => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/teams/${teamId}/children`)
      if (!response.ok) {
        throw new Error('Error al cargar niños')
      }
      const childrenData = await response.json()
      setChildren(childrenData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar niños')
    } finally {
      setLoading(false)
    }
  }

  const addChild = async () => {
    if (!selectedTeam) {
      showCustomAlert('Selecciona un equipo primero', 'warning')
      return
    }

    if (nombre.trim() && apellido.trim() && edad.trim()) {
      const edadNum = parseInt(edad)
      if (edadNum > 0 && edadNum <= 18) {
        try {
          const response = await fetch(`${API_BASE_URL}/children`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              nombre: nombre.trim(),
              apellido: apellido.trim(),
              edad: edadNum,
              team_id: selectedTeam.id
            })
          })

          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || 'Error al agregar niño')
          }

          // Recargar la lista de niños
          await loadChildren(selectedTeam.id)
          
          // Limpiar formulario
          setNombre('')
          setApellido('')
          setEdad('')
          setShowAddChild(false)
          showCustomAlert('Niño agregado exitosamente', 'success')
        } catch (err) {
          showCustomAlert(err instanceof Error ? err.message : 'Error al agregar niño', 'error')
        }
      } else {
        showCustomAlert('Por favor ingresa una edad válida (1-18 años)', 'warning')
      }
    } else {
      showCustomAlert('Por favor completa todos los campos', 'warning')
    }
  }

  const removeChild = async (id: number) => {
    showCustomConfirm('¿Estás seguro de que quieres eliminar este niño?', async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/children/${id}`, {
          method: 'DELETE'
        })

        if (!response.ok) {
          throw new Error('Error al eliminar niño')
        }

        // Recargar la lista
        if (selectedTeam) {
          await loadChildren(selectedTeam.id)
        }
        showCustomAlert('Niño eliminado exitosamente', 'success')
      } catch (err) {
        showCustomAlert(err instanceof Error ? err.message : 'Error al eliminar niño', 'error')
      }
    })
  }
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addChild()
    }
  }

  const selectTeamAndNavigate = (team: Team) => {
    setSelectedTeam(team)
    setCurrentView('team-management')
  }

  const backToMenu = () => {
    setCurrentView('menu')
    setSelectedTeam(null)
    setShowAddChild(false)
  }

  const createNewTeam = async () => {
    if (!teamName.trim()) {
      showCustomAlert('El nombre del equipo es obligatorio', 'warning')
      return
    }

    if (teamName.trim().length < 2 || teamName.trim().length > 50) {
      showCustomAlert('El nombre debe tener entre 2 y 50 caracteres', 'warning')
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/teams`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },        body: JSON.stringify({
          nombre: teamName.trim(),
          descripcion: teamDescription.trim(),
          color: teamColor
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Error al crear equipo')
      }

      // Recargar la lista de equipos
      await loadTeams()
      
      // Limpiar el formulario
      setTeamName('')
      setTeamDescription('')
      setTeamColor('#3B82F6')
      setShowCreateTeam(false)
      
      showCustomAlert('Equipo creado exitosamente', 'success')    } catch (err) {
      showCustomAlert(err instanceof Error ? err.message : 'Error al crear equipo', 'error')
    }
  }

  if (loading && teams.length === 0) {
    return (
      <div className="app">
        <div className="loading">
          <h2>Cargando...</h2>
        </div>
      </div>
    )
  }

  if (error && teams.length === 0) {
    return (
      <div className="app">
        <div className="error">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={loadTeams}>Reintentar</button>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <header className="header">
        <h1>🧒 Lista de Chicos</h1>
        <p>Gestión de niños por equipos</p>
      </header>
      
      <main className="main">        {currentView === 'menu' ? (
          // VISTA DE MENÚ - Solo selección de equipos
          <div className="menu-view">
            <div className="team-selector">
              <h2>Seleccionar Equipo:</h2>
              
              {/* Botón flotante para crear nuevo equipo */}
              <div className="create-team-section">
                <button 
                  onClick={() => setShowCreateTeam(true)}
                  className="create-team-btn-floating"
                >
                  <span className="plus-icon">+</span>
                  <span className="btn-text">Crear Nuevo Equipo</span>
                </button>
              </div>
              
              <div className="teams-grid">
                {teams.map((team) => (
                  <button
                    key={team.id}
                    onClick={() => selectTeamAndNavigate(team)}
                    className="team-card"
                    style={{ 
                      // Usamos CSS variable para el color del borde izquierdo
                      // El texto NO toma el color del equipo
                      ['--team-color' as any]: team.color
                    }}
                  >
                    <div className="team-card-content">
                      <div className="team-name">{team.nombre}</div>
                      {team.descripcion && (
                        <div className="team-description">{team.descripcion}</div>
                      )}
                    </div>
                    <div className="team-arrow">→</div>
                  </button>
                ))}
              </div>
              
              {/* Formulario para crear nuevo equipo */}
              {showCreateTeam && (
                <div className="create-team-form">
                  <h3>Crear Nuevo Equipo</h3>
                  <div className="form-grid">
                    <input
                      type="text"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      placeholder="Nombre del equipo"
                      className="input-field"
                      maxLength={50}
                      autoFocus
                    />
                    <input
                      type="text"
                      value={teamDescription}
                      onChange={(e) => setTeamDescription(e.target.value)}
                      placeholder="Descripción (opcional)"
                      className="input-field"
                      maxLength={100}
                    />
                    <div className="color-input-group">
                      <label htmlFor="teamColor">Color:</label>
                      <input
                        id="teamColor"
                        type="color"
                        value={teamColor}
                        onChange={(e) => setTeamColor(e.target.value)}
                        className="color-input"
                      />
                    </div>
                  </div>
                  <div className="form-actions">
                    <button 
                      onClick={createNewTeam}
                      className="create-btn"
                      style={{ backgroundColor: teamColor }}
                    >
                      Crear Equipo
                    </button>
                    <button 
                      onClick={() => {
                        setShowCreateTeam(false)
                        setTeamName('')
                        setTeamDescription('')
                        setTeamColor('#3B82F6')
                      }}
                      className="cancel-btn"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          // VISTA DE GESTIÓN DE EQUIPO - Gestión de niños del equipo seleccionado
          <div className="team-management-view">
            {selectedTeam ? (
              <>
                {/* Header con botón de regreso */}
                <div className="team-management-header">
                  <button 
                    onClick={backToMenu}
                    className="back-btn"
                  >
                    ← Regresar al Menú
                  </button>
                  <div className="selected-team-info">
                    <h2 style={{ color: selectedTeam.color }}>
                      📋 {selectedTeam.nombre}
                    </h2>
                    {selectedTeam.descripcion && (
                      <p className="team-description">{selectedTeam.descripcion}</p>
                    )}
                  </div>
                  <button 
                    onClick={() => setShowAddChild(!showAddChild)}
                    className="add-child-btn"
                    style={{ backgroundColor: selectedTeam.color }}
                  >
                    {showAddChild ? 'Cancelar' : '+ Agregar Niño'}
                  </button>
                </div>

                {/* Formulario para agregar niño */}
                {showAddChild && (
                  <div className="add-section">
                    <div className="input-group">
                      <input
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Nombre"
                        className="input-field"
                        maxLength={50}
                      />
                      <input
                        type="text"
                        value={apellido}
                        onChange={(e) => setApellido(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Apellido"
                        className="input-field"
                        maxLength={50}
                      />
                      <input
                        type="number"
                        value={edad}
                        onChange={(e) => setEdad(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Edad"
                        min="1"
                        max="18"
                        className="input-field input-age"
                      />
                      <button 
                        onClick={addChild} 
                        className="add-btn"
                        style={{ backgroundColor: selectedTeam.color }}
                      >
                        Agregar
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Lista de niños */}
                <div className="list-section">
                  {loading ? (
                    <p className="loading-message">Cargando niños...</p>
                  ) : children.length === 0 ? (
                    <div className="empty-message">
                      <p>No hay niños en este equipo</p>
                      <button 
                        onClick={() => setShowAddChild(true)}
                        className="add-first-btn"
                        style={{ backgroundColor: selectedTeam.color }}
                      >
                        Agregar el primer niño
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="list-header">
                        <h3>Niños en el equipo ({children.length})</h3>
                      </div>
                      <ul className="children-list">
                        {children.map((child) => (
                          <li key={child.id} className="child-item">
                            <div className="child-info">
                              <span className="child-name">
                                {child.nombre} {child.apellido}
                              </span>
                              <span className="child-age">{child.edad} años</span>
                            </div>
                            <button 
                              onClick={() => removeChild(child.id)}
                              className="remove-btn"
                              title="Eliminar"
                            >
                              ❌
                            </button>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </>
            ) : null}
          </div>
        )}

        {error && (
          <div className="error-message">
            <p>Error: {error}</p>
            <button onClick={() => setError(null)}>Cerrar</button>
          </div>
        )}

        {/* Modal de alerta */}
        {showAlert && (
          <div className={`custom-modal alert ${alertType}`}>
            <div className="modal-content">
              <span className="close" onClick={() => setShowAlert(false)}>&times;</span>
              <p>{alertMessage}</p>
            </div>
          </div>
        )}

        {/* Modal de confirmación */}
        {showConfirm && (
          <div className="custom-modal confirm">
            <div className="modal-content">
              <span className="close" onClick={handleConfirmCancel}>&times;</span>
              <p>{confirmMessage}</p>
              <div className="confirm-buttons">
                <button onClick={handleConfirmAccept} className="confirm-accept">Sí</button>
                <button onClick={handleConfirmCancel} className="confirm-cancel">No</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
