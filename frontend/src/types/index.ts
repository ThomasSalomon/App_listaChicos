/**
 * Types and Interfaces
 * Definiciones de tipos centralizadas para toda la aplicación
 */

// Tipos base para Teams
export interface Team {
  id: number;
  nombre: string;
  descripcion: string;
  color: string;
  activo: number;
  created_at: string;
  updated_at?: string;
}

export interface CreateTeamData {
  nombre: string;
  descripcion?: string;
  color?: string;
}

export interface UpdateTeamData {
  nombre: string;
  descripcion?: string;
  color?: string;
}

// Tipos base para Children
export interface Child {
  id: number;
  nombre: string;
  apellido: string;
  fecha_nacimiento: string;
  edad: number;
  estado_fisico: 'En forma' | 'Lesionado';
  condicion_pago: 'Al dia' | 'En deuda';
  team_id: number;
  created_at: string;
  updated_at?: string;
}

export interface CreateChildData {
  nombre: string;
  apellido: string;
  fecha_nacimiento: string;
  estado_fisico: 'En forma' | 'Lesionado';
  condicion_pago: 'Al dia' | 'En deuda';
  team_id: number;
}

export interface UpdateChildData {
  nombre: string;
  apellido: string;
  fecha_nacimiento: string;
  estado_fisico: 'En forma' | 'Lesionado';
  condicion_pago: 'Al dia' | 'En deuda';
  team_id?: number;
}

export interface MoveChildData {
  new_team_id: number;
}

export interface MoveChildResponse {
  id: number;
  nombre: string;
  apellido: string;
  message: string;
  previous_team_id: number;
  new_team_id: number;
  target_team_name: string;
}

// Estados de la aplicación
export interface AppState {
  currentView: 'teams' | 'children';
  selectedTeam: Team | null;
  teams: Team[];
  children: Child[];
  loading: boolean;
  error: string | null;
}

// Props para componentes
export interface TeamCardProps {
  team: Team;
  onSelect: (team: Team) => void;
  onDelete: (teamId: number) => void;
}

export interface TeamFormProps {
  onSubmit: (teamData: CreateTeamData) => void;
  onCancel: () => void;
  isVisible: boolean;
}

export interface ChildListProps {
  team: Team;
  children: Child[];
  teams: Team[];
  onBack: () => void;
  onAddChild: (childData: CreateChildData) => void;
  onUpdateChild: (id: number, childData: UpdateChildData) => void;
  onDeleteChild: (id: number) => void;
  onMoveChild: (id: number, newTeamId: number) => void;
  onClearAll: () => void;
}

export interface ChildItemProps {
  child: Child;
  onEdit: (child: Child) => void;
  onDelete: (id: number) => void;
  onMove: (child: Child) => void;
  isEditing: boolean;
  onUpdate: (id: number, childData: UpdateChildData) => void;
  onCancelEdit: () => void;
}

export interface ChildFormProps {
  teamId: number;
  onSubmit: (childData: CreateChildData) => void;
  isVisible: boolean;
}

export interface MoveChildModalProps {
  child: Child | null;
  teams: Team[];
  currentTeamId: number;
  isVisible: boolean;
  onMove: (childId: number, newTeamId: number) => void;
  onCancel: () => void;
}

export interface ConfirmDialogProps {
  isVisible: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

// Utilidades
export interface ApiError {
  message: string;
  status?: number;
  data?: any;
}

export interface LoadingState {
  teams: boolean;
  children: boolean;
  creating: boolean;
  updating: boolean;
  deleting: boolean;
  moving: boolean;
}
