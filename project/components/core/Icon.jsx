import React from 'react';

// PascalCase lucide name from a kebab or pascal input
function toPascal(name) {
  if (!name) return '';
  if (/^[A-Z]/.test(name) && !name.includes('-')) return name;
  return name.split('-').map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join('');
}

// Build an SVG string from Lucide's runtime icon node data — React-safe
// (injected via dangerouslySetInnerHTML so React never reconciles the SVG).
function buildSvg(name, size, strokeWidth) {
  const L = typeof window !== 'undefined' ? window.lucide : null;
  if (!L) return '';
  const key = toPascal(name);
  const node = (L.icons && L.icons[key]) || L[key];
  if (!node) return '';
  const children = node
    .map(([tag, attrs]) => {
      const a = Object.entries(attrs || {})
        .map(([k, v]) => `${k}="${v}"`)
        .join(' ');
      return `<${tag} ${a}/>`;
    })
    .join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">${children}</svg>`;
}

/**
 * Icon — renders a Lucide glyph. Requires the Lucide UMD script on the page.
 */
export function Icon({ name, size = 20, strokeWidth = 2, color, className = '', style = {} }) {
  const [, force] = React.useState(0);
  const html = buildSvg(name, size, strokeWidth);
  // If Lucide hadn't loaded at first paint, re-render once it's available.
  React.useEffect(() => {
    if (!html) {
      const t = setTimeout(() => force((n) => n + 1), 60);
      return () => clearTimeout(t);
    }
  }, [html]);
  return (
    <span
      className={className}
      aria-hidden="true"
      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: size, height: size, color, flex: 'none', ...style }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
