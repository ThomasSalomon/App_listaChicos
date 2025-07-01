/**
 * VirtualizedChildList Component
 * Lista virtualizada para manejar miles de niños eficientemente
 * OPTIMIZACIÓN 7: Virtualización para listas grandes
 */

import React from 'react';
import { useVirtualization } from '../hooks';
import ChildItem from './ChildItem';
import type { Child } from '../types';

interface VirtualizedChildListProps {
  children: Child[];
  onEdit: (child: Child) => void;
  onDelete: (id: number) => void;
  onMove: (child: Child) => void;
  onUpdate: (id: number, data: any) => void;
  onCancelEdit: () => void;
  editingChildId: number | null;
  teamColor?: string;
  containerHeight?: number;
}

const VirtualizedChildList: React.FC<VirtualizedChildListProps> = React.memo(({
  children,
  onEdit,
  onDelete,
  onMove,
  onUpdate,
  onCancelEdit,
  editingChildId,
  teamColor = '#3B82F6',
  containerHeight = 400
}) => {
  const ITEM_HEIGHT = 120; // Altura estimada de cada ChildItem

  const {
    visibleItems,
    containerProps,
    innerProps
  } = useVirtualization(children, {
    itemHeight: ITEM_HEIGHT,
    containerHeight,
    overscan: 3
  });

  // Si hay pocos elementos, renderizar normalmente
  if (children.length < 20) {
    return (
      <div className="space-y-3">
        {children.map(child => (
          <ChildItem
            key={child.id}
            child={child}
            onEdit={onEdit}
            onDelete={onDelete}
            onMove={onMove}
            isEditing={editingChildId === child.id}
            onUpdate={onUpdate}
            onCancelEdit={onCancelEdit}
            teamColor={teamColor}
          />
        ))}
      </div>
    );
  }

  // Para listas grandes, usar virtualización
  return (
    <div {...containerProps} className="border rounded-lg bg-gray-50">
      <div {...innerProps}>
        {visibleItems.map(({ item: child, style }) => (
          <div key={child.id} style={style}>
            <ChildItem
              child={child}
              onEdit={onEdit}
              onDelete={onDelete}
              onMove={onMove}
              isEditing={editingChildId === child.id}
              onUpdate={onUpdate}
              onCancelEdit={onCancelEdit}
              teamColor={teamColor}
            />
          </div>
        ))}
      </div>
      
      {/* Indicador de elementos virtualizados */}
      {children.length > 20 && (
        <div className="p-2 bg-blue-50 text-blue-700 text-sm text-center border-t">
          Mostrando {visibleItems.length} de {children.length} elementos (virtualizado)
        </div>
      )}
    </div>
  );
});

VirtualizedChildList.displayName = 'VirtualizedChildList';

export default VirtualizedChildList;
