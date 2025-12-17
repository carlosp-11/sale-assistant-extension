// utils/keyword-matcher.js
// Motor de detección de palabras clave con caché y optimizaciones

class KeywordMatcher {
  constructor(keywords) {
    this.keywords = keywords;
    this.cache = new Map();
    this.maxCacheSize = 100;
  }

  match(text) {
    const cacheKey = this.hashText(text);
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const matches = [];
    const lowerText = text.toLowerCase();

    this.keywords.forEach(keyword => {
      const pattern = this.createPattern(keyword.text);
      const regex = new RegExp(pattern, 'gi');
      const found = lowerText.match(regex);

      if (found) {
        matches.push({
          keyword: keyword.text,
          count: found.length,
          actions: keyword.actions,
          priority: keyword.priority,
          positions: this.findPositions(lowerText, keyword.text)
        });
      }
    });

    // Ordenar por prioridad
    matches.sort((a, b) => {
      const priorities = { high: 3, medium: 2, low: 1 };
      return priorities[b.priority] - priorities[a.priority];
    });

    // Guardar en caché
    if (this.cache.size >= this.maxCacheSize) {
      // Eliminar el primer elemento si el caché está lleno
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(cacheKey, matches);

    return matches;
  }

  createPattern(keyword) {
    // Escapar caracteres especiales de regex
    let escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // Permitir variaciones con acentos (ej: "cotizacion" también encuentra "cotización")
    escaped = escaped
      .replace(/a/gi, '[aá]')
      .replace(/e/gi, '[eé]')
      .replace(/i/gi, '[ií]')
      .replace(/o/gi, '[oó]')
      .replace(/u/gi, '[uú]')
      .replace(/n/gi, '[nñ]');
    
    // Buscar palabra completa
    return `\\b${escaped}\\b`;
  }

  findPositions(text, keyword) {
    const positions = [];
    const lowerKeyword = keyword.toLowerCase();
    let index = 0;

    while ((index = text.indexOf(lowerKeyword, index)) !== -1) {
      positions.push(index);
      index += lowerKeyword.length;
    }

    return positions;
  }

  hashText(text) {
    // Simple hash para cache
    let hash = 0;
    for (let i = 0; i < Math.min(text.length, 1000); i++) {
      const char = text.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString();
  }

  clearCache() {
    this.cache.clear();
  }

  updateKeywords(keywords) {
    this.keywords = keywords;
    this.clearCache();
  }
}

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = KeywordMatcher;
}

