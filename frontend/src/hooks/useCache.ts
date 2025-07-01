import { useState, useCallback, useMemo } from 'react';

/**
 * Hook para cache en memoria con TTL (Time To Live)
 * OPTIMIZACIÓN 6: Cache inteligente para evitar llamadas innecesarias a la API
 */
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

interface CacheConfig {
  defaultTTL?: number; // TTL por defecto en milisegundos
  maxSize?: number;    // Tamaño máximo del cache
}

export function useCache<T>(config: CacheConfig = {}) {
  const { defaultTTL = 5 * 60 * 1000, maxSize = 100 } = config; // 5 minutos por defecto
  const [cache, setCache] = useState<Map<string, CacheEntry<T>>>(new Map());

  // Verificar si una entrada del cache es válida
  const isValid = useCallback((entry: CacheEntry<T>): boolean => {
    return Date.now() - entry.timestamp < entry.ttl;
  }, []);

  // Obtener datos del cache
  const get = useCallback((key: string): T | null => {
    const entry = cache.get(key);
    
    if (!entry) {
      return null;
    }

    if (!isValid(entry)) {
      // Entrada expirada, eliminarla
      setCache(prev => {
        const newCache = new Map(prev);
        newCache.delete(key);
        return newCache;
      });
      return null;
    }

    return entry.data;
  }, [cache, isValid]);

  // Almacenar datos en el cache
  const set = useCallback((key: string, data: T, ttl: number = defaultTTL) => {
    setCache(prev => {
      const newCache = new Map(prev);

      // Si el cache está lleno, eliminar la entrada más antigua
      if (newCache.size >= maxSize) {
        const firstEntry = newCache.keys().next();
        if (!firstEntry.done) {
          newCache.delete(firstEntry.value);
        }
      }

      newCache.set(key, {
        data,
        timestamp: Date.now(),
        ttl
      });

      return newCache;
    });
  }, [defaultTTL, maxSize]);

  // Eliminar una entrada específica
  const remove = useCallback((key: string) => {
    setCache(prev => {
      const newCache = new Map(prev);
      newCache.delete(key);
      return newCache;
    });
  }, []);

  // Limpiar todo el cache
  const clear = useCallback(() => {
    setCache(new Map());
  }, []);

  // Limpiar entradas expiradas
  const cleanup = useCallback(() => {
    setCache(prev => {
      const newCache = new Map();
      
      for (const [key, entry] of prev.entries()) {
        if (isValid(entry)) {
          newCache.set(key, entry);
        }
      }
      
      return newCache;
    });
  }, [isValid]);

  // Obtener estadísticas del cache
  const stats = useMemo(() => ({
    size: cache.size,
    maxSize,
    hitRate: 0, // Esto se podría implementar con contadores adicionales
  }), [cache.size, maxSize]);

  // Función para obtener o cargar datos (cache-first)
  const getOrLoad = useCallback(async (
    key: string, 
    loader: () => Promise<T>, 
    ttl: number = defaultTTL
  ): Promise<T> => {
    // Intentar obtener del cache primero
    const cached = get(key);
    if (cached !== null) {
      return cached;
    }

    // Si no está en cache, cargar y almacenar
    const data = await loader();
    set(key, data, ttl);
    return data;
  }, [get, set, defaultTTL]);

  return {
    get,
    set,
    remove,
    clear,
    cleanup,
    stats,
    getOrLoad
  };
}
