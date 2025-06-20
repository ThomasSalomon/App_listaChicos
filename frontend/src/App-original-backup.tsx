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
  fecha_nacimiento: string
  edad?: number // Calculada dinámicamente
  estado_fisico: 'En forma' | 'Lesionado'
  condicion_pago: 'Al dia' | 'En deuda'
  team_id: number
  team_nombre?: string
  team_color?: string
  created_at: string
  updated_at: string
}

const API_BASE_URL = 'http://localhost:3001/api'

// Función helper para formatear fechas sin problemas de zona horaria
const formatBirthDateForDisplay = (birthDate: string): string => {
  if (!birthDate) return 'Fecha no disponible';
  
  // Si la fecha viene en formato YYYY-MM-DD, la parseamos de forma segura
  if (typeof birthDate === 'string' && birthDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
    const [year, month, day] = birthDate.split('-');
    // Crear fecha local específicamente (no UTC)
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return date.toLocaleDateString('es-ES');
  }
  
  // Para otros formatos, usar conversión normal
  const date = new Date(birthDate);
  return date.toLocaleDateString('es-ES');
};

// Función helper para formatear fechas para inputs de tipo date
const formatBirthDateForInput = (birthDate: string): string => {
  if (!birthDate) return '';
  
  // Si la fecha viene en formato YYYY-MM-DD, devolverla tal como está
  if (typeof birthDate === 'string' && birthDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return birthDate;
  }
  
  // Para otros formatos, convertir a YYYY-MM-DD
  const date = new Date(birthDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

function App() {
  const [teams, setTeams] = useState<Team[]>([])
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)
  const [children, setChildren] = useState<Child[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentView, setCurrentView] = useState<'menu' | 'team-management'>('menu')    // Estados para el formulario
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [fechaNacimiento, setFechaNacimiento] = useState('')
  const [estadoFisico, setEstadoFisico] = useState<'En forma' | 'Lesionado'>('En forma')
  const [condicionPago, setCondicionPago] = useState<'Al dia' | 'En deuda'>('Al dia')
  const [showAddChild, setShowAddChild] = useState(false)
  // Estados para edición de niños
  const [editingChild, setEditingChild] = useState<Child | null>(null)
  const [editNombre, setEditNombre] = useState('')
  const [editApellido, setEditApellido] = useState('')
  const [editFechaNacimiento, setEditFechaNacimiento] = useState('')
  const [editEstadoFisico, setEditEstadoFisico] = useState<'En forma' | 'Lesionado'>('En forma')
  const [editCondicionPago, setEditCondicionPago] = useState<'Al dia' | 'En deuda'>('Al dia')
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

  // Estados para mover niños entre equipos
  const [showMoveChild, setShowMoveChild] = useState(false)
  const [childToMove, setChildToMove] = useState<Child | null>(null)
  const [targetTeamId, setTargetTeamId] = useState<number | ''>('')

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
      setChildren(childrenData)    } catch (err) {
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

    // Debug: verificar valores
    console.log('Valores del formulario:', { nombre, apellido, fechaNacimiento })
    console.log('Valores después de trim:', { 
      nombre: nombre.trim(), 
      apellido: apellido.trim(), 
      fechaNacimiento: fechaNacimiento.trim() 
    })

    if (nombre.trim() && apellido.trim() && fechaNacimiento.trim()) {
      // Validar que la fecha de nacimiento sea válida
      const birthDate = new Date(fechaNacimiento)
      const today = new Date()
      
      if (isNaN(birthDate.getTime())) {
        showCustomAlert('Por favor ingresa una fecha de nacimiento válida', 'warning')
        return
      }
      
      if (birthDate > today) {
        showCustomAlert('La fecha de nacimiento no puede ser futura', 'warning')
        return
      }
      
      // Calcular edad para validación
      const age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()
      const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()) ? age - 1 : age
      
      if (actualAge < 0 || actualAge > 25) {
        showCustomAlert('La edad calculada debe estar entre 0 y 25 años', 'warning')
        return
      }
      
      try {
        const response = await fetch(`${API_BASE_URL}/children`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },          body: JSON.stringify({
            nombre: nombre.trim(),
            apellido: apellido.trim(),
            fecha_nacimiento: fechaNacimiento,
            estado_fisico: estadoFisico,
            condicion_pago: condicionPago,
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
        setFechaNacimiento('')
        setEstadoFisico('En forma')
        setCondicionPago('Al dia')
        setShowAddChild(false)
        showCustomAlert('Niño agregado exitosamente', 'success')
      } catch (err) {
        showCustomAlert(err instanceof Error ? err.message : 'Error al agregar niño', 'error')
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
  }  // Función para iniciar la edición de un niño
  const startEditChild = (child: Child) => {
    // Cerrar formulario de agregar si está abierto
    setShowAddChild(false)
    
    setEditingChild(child)
    setEditNombre(child.nombre)
    setEditApellido(child.apellido)
    setEditFechaNacimiento(formatBirthDateForInput(child.fecha_nacimiento))
    setEditEstadoFisico(child.estado_fisico)
    setEditCondicionPago(child.condicion_pago)
  }

  // Función para cancelar la edición
  const cancelEdit = () => {
    setEditingChild(null)
    setEditNombre('')
    setEditApellido('')
    setEditFechaNacimiento('')
    setEditEstadoFisico('En forma')
    setEditCondicionPago('Al dia')
  }

  // Función para guardar los cambios de edición
  const saveEditChild = async () => {
    if (!editingChild) return

    // Validar campos obligatorios
    if (!editNombre.trim() || !editApellido.trim() || !editFechaNacimiento.trim()) {
      showCustomAlert('Por favor completa todos los campos obligatorios', 'warning')
      return
    }

    // Validar fecha de nacimiento
    const birthDate = new Date(editFechaNacimiento)
    const today = new Date()
    
    if (isNaN(birthDate.getTime())) {
      showCustomAlert('Por favor ingresa una fecha de nacimiento válida', 'warning')
      return
    }
    
    if (birthDate > today) {
      showCustomAlert('La fecha de nacimiento no puede ser futura', 'warning')
      return
    }
    
    // Calcular edad para validación
    const age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()) ? age - 1 : age
    
    if (actualAge < 0 || actualAge > 25) {
      showCustomAlert('La edad calculada debe estar entre 0 y 25 años', 'warning')
      return
    }    try {
      const response = await fetch(`${API_BASE_URL}/children/${editingChild.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: editNombre.trim(),
          apellido: editApellido.trim(),
          fecha_nacimiento: editFechaNacimiento,
          estado_fisico: editEstadoFisico,
          condicion_pago: editCondicionPago,
          team_id: selectedTeam?.id || editingChild.team_id
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Error al actualizar niño')
      }

      // Recargar la lista de niños
      if (selectedTeam) {
        await loadChildren(selectedTeam.id)
      }
      
      // Limpiar estado de edición
      cancelEdit()
      showCustomAlert('Niño actualizado exitosamente', 'success')    } catch (err) {
      showCustomAlert(err instanceof Error ? err.message : 'Error al actualizar niño', 'error')
    }
  }
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addChild()
    }
  }

  const handleEditKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      saveEditChild()
    } else if (e.key === 'Escape') {
      cancelEdit()
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
  // Función para manejar salida de la aplicación
  const handleExitApp = () => {
    showCustomConfirm('¿Estás seguro de que quieres salir de la aplicación?', () => {
      if ((window as any).electronAPI) {
        (window as any).electronAPI.closeApp()
      } else {
        window.close()
      }
    })
  }

  // Función para crear un nuevo equipo
  const createNewTeam = async () => {
    if (!teamName.trim()) {
      showCustomAlert('Por favor ingresa un nombre para el equipo', 'warning')
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/teams`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },        body: JSON.stringify({
          nombre: teamName.trim(),
          descripcion: teamDescription.trim() || '',
          color: teamColor
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Error al crear equipo')
      }

      // Recargar la lista de equipos
      await loadTeams()
      
      // Limpiar formulario
      setTeamName('')
      setTeamDescription('')
      setTeamColor('#3B82F6')
      setShowCreateTeam(false)
      
      showCustomAlert('Equipo creado exitosamente', 'success')
    } catch (err) {
      showCustomAlert(err instanceof Error ? err.message : 'Error al crear equipo', 'error')
    }
  }

  // Función para eliminar un equipo
  const deleteTeam = async (teamId: number, teamName: string) => {
    showCustomConfirm(
      `¿Estás seguro de que quieres eliminar el equipo "${teamName}"?\n\nEsta acción no se puede deshacer.`, 
      async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/teams/${teamId}`, {
            method: 'DELETE'
          })

          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || 'Error al eliminar equipo')
          }

          // Recargar la lista de equipos
          await loadTeams()
          
          // Si el equipo eliminado era el seleccionado, volver al menú
          if (selectedTeam && selectedTeam.id === teamId) {
            setSelectedTeam(null)
            setCurrentView('menu')
          }
          
          showCustomAlert('Equipo eliminado exitosamente', 'success')
        } catch (err) {
          showCustomAlert(err instanceof Error ? err.message : 'Error al eliminar equipo', 'error')
        }
      }
    )
  }
  // Función para mover un niño a otro equipo
  const moveChildToTeam = async () => {
    if (!childToMove || targetTeamId === '') return

    try {
      const response = await fetch(`${API_BASE_URL}/children/${childToMove.id}/move`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          new_team_id: targetTeamId
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Error al mover niño')
      }

      const result = await response.json()

      // Recargar la lista de niños del equipo actual
      if (selectedTeam) {
        await loadChildren(selectedTeam.id)
      }
      
      showCustomAlert(result.message || 'Niño movido exitosamente', 'success')
    } catch (err) {
      showCustomAlert(err instanceof Error ? err.message : 'Error al mover niño', 'error')
    } finally {
      setShowMoveChild(false)
      setChildToMove(null)
      setTargetTeamId('')
    }
  }

  // Función para iniciar el proceso de mover un niño
  const startMoveChild = (child: Child) => {
    setChildToMove(child)
    setTargetTeamId('')
    setShowMoveChild(true)
    // Cerrar otros formularios
    setShowAddChild(false)
    if (editingChild) {
      cancelEdit()
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
                  <div key={team.id} className="team-card-container">
                    <button
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
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteTeam(team.id, team.nombre)
                      }}
                      className="team-delete-btn"
                      title={`Eliminar equipo ${team.nombre}`}
                    >
                      🗑️
                    </button>
                  </div>
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
                </div>              )}
            </div>
            
            {/* Botón de salir en la parte inferior */}
            <div className="exit-section">
              <button 
                onClick={handleExitApp}
                className="exit-btn"
              >
                🚪 Salir de la Aplicación
              </button>
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
                  </div>                  <button 
                    onClick={() => {
                      setShowAddChild(!showAddChild)
                      // Cancelar edición si está activa
                      if (editingChild) {
                        cancelEdit()
                      }
                    }}
                    className="add-child-btn"
                    style={{ backgroundColor: selectedTeam.color }}
                  >
                    {showAddChild ? 'Cancelar' : '+ Agregar Niño'}
                  </button>
                </div>                {/* Formulario para agregar niño */}
                {showAddChild && (
                  <div className="add-section">
                    <div className="input-group">
                      <div className="input-container">
                        <label className="input-label">Nombre</label>
                        <input
                          type="text"
                          value={nombre}
                          onChange={(e) => setNombre(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Ingresa el nombre"
                          className="input-field"
                          maxLength={50}
                        />
                      </div>
                      <div className="input-container">
                        <label className="input-label">Apellido</label>
                        <input
                          type="text"
                          value={apellido}
                          onChange={(e) => setApellido(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Ingresa el apellido"
                          className="input-field"
                          maxLength={50}
                        />
                      </div>
                      <div className="input-container">
                        <label className="input-label">Fecha de Nacimiento</label>
                        <input
                          type="date"
                          value={fechaNacimiento}
                          onChange={(e) => setFechaNacimiento(e.target.value)}
                          onKeyPress={handleKeyPress}
                          className="input-field input-date"
                          max={new Date().toISOString().split('T')[0]} // No permitir fechas futuras
                        />
                      </div>
                      <div className="input-container">
                        <label className="input-label">Estado Físico</label>
                        <select
                          value={estadoFisico}
                          onChange={(e) => setEstadoFisico(e.target.value as 'En forma' | 'Lesionado')}
                          className="input-field select-field"
                        >
                          <option value="En forma">💪 En forma</option>
                          <option value="Lesionado">🤕 Lesionado</option>
                        </select>
                      </div>
                      <div className="input-container">
                        <label className="input-label">Condición de Pago</label>
                        <select
                          value={condicionPago}
                          onChange={(e) => setCondicionPago(e.target.value as 'Al dia' | 'En deuda')}
                          className="input-field select-field"
                        >
                          <option value="Al dia">✅ Al día</option>
                          <option value="En deuda">⚠️ En deuda</option>
                        </select>
                      </div>                      <div className="input-container">
                        <label className="input-label">&nbsp;</label>
                        <button 
                          onClick={addChild} 
                          className="add-btn"
                          style={{ backgroundColor: selectedTeam.color }}
                        >
                          Agregar
                        </button>
                      </div>
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
                      </div>                      <ul className="children-list">
                        {children.map((child) => (
                          <li key={child.id} className="child-item">
                            {editingChild && editingChild.id === child.id ? (
                              // Formulario de edición en línea
                              <div className="edit-child-form">
                                <div className="edit-input-group">
                                  <div className="edit-input-container">
                                    <label className="edit-input-label">Nombre</label>                                    <input
                                      type="text"
                                      value={editNombre}
                                      onChange={(e) => setEditNombre(e.target.value)}
                                      onKeyDown={handleEditKeyPress}
                                      className="edit-input-field"
                                      placeholder="Nombre"
                                      maxLength={50}
                                    />
                                  </div>
                                  <div className="edit-input-container">
                                    <label className="edit-input-label">Apellido</label>
                                    <input
                                      type="text"
                                      value={editApellido}
                                      onChange={(e) => setEditApellido(e.target.value)}
                                      className="edit-input-field"
                                      placeholder="Apellido"
                                      maxLength={50}
                                    />
                                  </div>
                                  <div className="edit-input-container">
                                    <label className="edit-input-label">Fecha Nacimiento</label>
                                    <input
                                      type="date"
                                      value={editFechaNacimiento}
                                      onChange={(e) => setEditFechaNacimiento(e.target.value)}
                                      className="edit-input-field edit-input-date"
                                      max={new Date().toISOString().split('T')[0]}
                                    />
                                  </div>
                                  <div className="edit-input-container">
                                    <label className="edit-input-label">Estado Físico</label>
                                    <select
                                      value={editEstadoFisico}
                                      onChange={(e) => setEditEstadoFisico(e.target.value as 'En forma' | 'Lesionado')}
                                      className="edit-input-field edit-select-field"
                                    >
                                      <option value="En forma">💪 En forma</option>
                                      <option value="Lesionado">🤕 Lesionado</option>
                                    </select>
                                  </div>
                                  <div className="edit-input-container">
                                    <label className="edit-input-label">Condición Pago</label>
                                    <select
                                      value={editCondicionPago}
                                      onChange={(e) => setEditCondicionPago(e.target.value as 'Al dia' | 'En deuda')}
                                      className="edit-input-field edit-select-field"
                                    >
                                      <option value="Al dia">✅ Al día</option>
                                      <option value="En deuda">⚠️ En deuda</option>
                                    </select>
                                  </div>
                                </div>
                                <div className="edit-actions">
                                  <button 
                                    onClick={saveEditChild}
                                    className="save-btn"
                                    style={{ backgroundColor: selectedTeam.color }}
                                  >
                                    💾 Guardar
                                  </button>
                                  <button 
                                    onClick={cancelEdit}
                                    className="cancel-edit-btn"
                                  >
                                    ❌ Cancelar
                                  </button>
                                </div>
                              </div>
                            ) : (
                              // Vista normal del niño
                              <>
                                <div className="child-info">
                                  <span className="child-name">
                                    {child.nombre} {child.apellido}
                                  </span>
                                  <span className="child-age">
                                    {child.edad !== undefined ? `${child.edad} años` : 'Edad no disponible'}
                                  </span>                                  <span className="child-birth-date">
                                    Nació: {formatBirthDateForDisplay(child.fecha_nacimiento)}
                                  </span>
                                  <div className="child-status">
                                    <span className={`status-badge status-fisico ${child.estado_fisico?.toLowerCase().replace(' ', '-')}`}>
                                      {child.estado_fisico === 'En forma' ? '💪' : '🤕'} {child.estado_fisico || 'En forma'}
                                    </span>
                                    <span className={`status-badge status-pago ${child.condicion_pago?.toLowerCase().replace(' ', '-')}`}>
                                      {child.condicion_pago === 'Al dia' ? '✅' : '⚠️'} {child.condicion_pago || 'Al día'}
                                    </span>
                                  </div>
                                </div>
                                <div className="child-actions">
                                  <button 
                                    onClick={() => startEditChild(child)}
                                    className="edit-btn"
                                    title="Editar"
                                  >
                                    ✏️
                                  </button>
                                  <button 
                                    onClick={() => removeChild(child.id)}
                                    className="remove-btn"
                                    title="Eliminar"
                                  >
                                    ❌
                                  </button>                                  <button 
                                    onClick={() => startMoveChild(child)}
                                    className="move-btn"
                                    title="Mover a otro equipo"
                                  >
                                    ↔️
                                  </button>
                                </div>
                              </>
                            )}
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

        {/* Modal para mover niño entre equipos */}
        {showMoveChild && childToMove && (
          <div className="custom-modal move-child">
            <div className="modal-content">
              <span className="close" onClick={() => setShowMoveChild(false)}>&times;</span>
              <h3>Mover Niño a Otro Equipo</h3>
              <p>
                Estás moviendo a <strong>{childToMove.nombre} {childToMove.apellido}</strong>.
                Selecciona el equipo destino:
              </p>
              
              <div className="move-child-teams">
                {teams.filter(team => team.id !== selectedTeam?.id).map(team => (
                  <div key={team.id} className="team-option">
                    <input
                      type="radio"
                      id={`team-${team.id}`}
                      name="targetTeam"
                      value={team.id}
                      checked={targetTeamId === team.id}
                      onChange={(e) => setTargetTeamId(Number(e.target.value))}
                      className="team-radio"
                    />
                    <label htmlFor={`team-${team.id}`} className="team-label">
                      <span className="team-color-box" style={{ backgroundColor: team.color }}></span>
                      {team.nombre}
                    </label>
                  </div>
                ))}
              </div>
              
              <div className="move-child-actions">
                <button 
                  onClick={moveChildToTeam}
                  className="move-btn-confirm"
                  disabled={!targetTeamId}
                  style={{ backgroundColor: targetTeamId ? teams.find(team => team.id === targetTeamId)?.color : '#ccc' }}
                >
                  ✅ Mover Niño
                </button>
                <button 
                  onClick={() => setShowMoveChild(false)}
                  className="move-btn-cancel"
                >
                  ❌ Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
