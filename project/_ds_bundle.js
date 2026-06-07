/* @ds-bundle: {"format":3,"namespace":"OrbitDesignSystem_f3fc09","components":[{"name":"Avatar","sourcePath":"components/core/Avatar.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"Icon","sourcePath":"components/core/Icon.jsx"},{"name":"IconButton","sourcePath":"components/core/IconButton.jsx"},{"name":"Tag","sourcePath":"components/core/Tag.jsx"},{"name":"ENTITY_META","sourcePath":"components/data/EntityIcon.jsx"},{"name":"EntityIcon","sourcePath":"components/data/EntityIcon.jsx"},{"name":"EntityRow","sourcePath":"components/data/EntityRow.jsx"},{"name":"Heatmap","sourcePath":"components/data/Heatmap.jsx"},{"name":"ProgressBar","sourcePath":"components/data/ProgressBar.jsx"},{"name":"StreakBadge","sourcePath":"components/data/StreakBadge.jsx"},{"name":"CheckCircle","sourcePath":"components/forms/CheckCircle.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"SearchBar","sourcePath":"components/forms/SearchBar.jsx"},{"name":"SegmentedControl","sourcePath":"components/forms/SegmentedControl.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"Fab","sourcePath":"components/nav/Fab.jsx"},{"name":"ScreenHeader","sourcePath":"components/nav/ScreenHeader.jsx"},{"name":"TabBar","sourcePath":"components/nav/TabBar.jsx"}],"sourceHashes":{"components/core/Avatar.jsx":"490722b7df77","components/core/Badge.jsx":"6a89488633cb","components/core/Button.jsx":"b265236d9a9f","components/core/Card.jsx":"585985502c67","components/core/Icon.jsx":"00fa71da917c","components/core/IconButton.jsx":"d584c899e1b6","components/core/Tag.jsx":"092260548f2d","components/data/EntityIcon.jsx":"9b2dfb450eda","components/data/EntityRow.jsx":"23b9413495c5","components/data/Heatmap.jsx":"a671ef3029ec","components/data/ProgressBar.jsx":"740ab7d61461","components/data/StreakBadge.jsx":"00ec806540e4","components/forms/CheckCircle.jsx":"c30935133af1","components/forms/Input.jsx":"dcbf3e8af4ec","components/forms/SearchBar.jsx":"cc3206ab9b67","components/forms/SegmentedControl.jsx":"919c5f8eee44","components/forms/Switch.jsx":"a5240478d7f2","components/nav/Fab.jsx":"52467d83a74e","components/nav/ScreenHeader.jsx":"ad250f4b96a2","components/nav/TabBar.jsx":"72bbc2335e67","ui_kits/app/OrbitApp.jsx":"fa5bdee69406","ui_kits/app/create.jsx":"dd4767d2902d","ui_kits/app/data.jsx":"e1f72bc7e6eb","ui_kits/app/detail.jsx":"b10dbb919d38","ui_kits/app/ios-frame.jsx":"be3343be4b51","ui_kits/app/screens.jsx":"9669fbb3d8ae"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.OrbitDesignSystem_f3fc09 = window.OrbitDesignSystem_f3fc09 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Avatar.jsx
try { (() => {
const palette = ['var(--person)', 'var(--task)', 'var(--routine)', 'var(--habit)', 'var(--project)', 'var(--orbit-600)'];
const softs = ['var(--person-soft)', 'var(--task-soft)', 'var(--routine-soft)', 'var(--habit-soft)', 'var(--project-soft)', 'var(--orbit-100)'];
const dims = {
  xs: 26,
  sm: 32,
  md: 40,
  lg: 56
};
function hash(str = '') {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = h * 31 + str.charCodeAt(i) >>> 0;
  return h;
}
function initials(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '?';
  return (parts[0][0] + (parts[1] ? parts[1][0] : '')).toUpperCase();
}

/**
 * Avatar — initials disc, color derived from the name (for People).
 */
function Avatar({
  name = '',
  size = 'md',
  color,
  style = {}
}) {
  const d = dims[size] || dims.md;
  const idx = hash(name) % palette.length;
  const fg = color || palette[idx];
  const bg = softs[idx];
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 'none',
      width: d,
      height: d,
      borderRadius: '999px',
      background: bg,
      color: fg,
      fontFamily: 'var(--font-sans)',
      fontWeight: 700,
      fontSize: d * 0.36,
      letterSpacing: '0.01em',
      ...style
    }
  }, initials(name));
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
const tones = {
  neutral: {
    bg: 'var(--fill)',
    fg: 'var(--text-muted)'
  },
  brand: {
    bg: 'var(--orbit-100)',
    fg: 'var(--orbit-700)'
  },
  success: {
    bg: 'var(--success-soft)',
    fg: 'var(--success)'
  },
  warning: {
    bg: 'var(--warning-soft)',
    fg: 'var(--warning)'
  },
  danger: {
    bg: 'var(--danger-soft)',
    fg: 'var(--danger)'
  },
  info: {
    bg: 'var(--info-soft)',
    fg: 'var(--info)'
  }
};

/**
 * Badge — compact status / count label.
 */
function Badge({
  children,
  tone = 'neutral',
  solid = false,
  style = {}
}) {
  const t = tones[tone] || tones.neutral;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      height: 20,
      padding: '0 8px',
      borderRadius: 'var(--radius-xs)',
      fontFamily: 'var(--font-sans)',
      fontSize: 11.5,
      fontWeight: 700,
      letterSpacing: '0.01em',
      lineHeight: 1,
      whiteSpace: 'nowrap',
      background: solid ? t.fg : t.bg,
      color: solid ? '#fff' : t.fg,
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
/**
 * Card — base surface container. `accent` adds the entity-type left border.
 */
function Card({
  children,
  accent,
  padding = 16,
  interactive = false,
  onClick,
  style = {}
}) {
  const [active, setActive] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    onPointerDown: () => interactive && setActive(true),
    onPointerUp: () => setActive(false),
    onPointerLeave: () => setActive(false),
    style: {
      background: 'var(--surface-card)',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border-default)',
      borderLeft: accent ? `var(--border-accent) solid ${accent}` : '1px solid var(--border-default)',
      boxShadow: 'var(--shadow-sm)',
      padding,
      boxSizing: 'border-box',
      cursor: interactive ? 'pointer' : 'default',
      transform: active ? 'scale(0.99)' : 'none',
      transition: 'transform var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast)',
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/Icon.jsx
try { (() => {
// PascalCase lucide name from a kebab or pascal input
function toPascal(name) {
  if (!name) return '';
  if (/^[A-Z]/.test(name) && !name.includes('-')) return name;
  return name.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('');
}

// Build an SVG string from Lucide's runtime icon node data — React-safe
// (injected via dangerouslySetInnerHTML so React never reconciles the SVG).
function buildSvg(name, size, strokeWidth) {
  const L = typeof window !== 'undefined' ? window.lucide : null;
  if (!L) return '';
  const key = toPascal(name);
  const node = L.icons && L.icons[key] || L[key];
  if (!node) return '';
  const children = node.map(([tag, attrs]) => {
    const a = Object.entries(attrs || {}).map(([k, v]) => `${k}="${v}"`).join(' ');
    return `<${tag} ${a}/>`;
  }).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">${children}</svg>`;
}

/**
 * Icon — renders a Lucide glyph. Requires the Lucide UMD script on the page.
 */
function Icon({
  name,
  size = 20,
  strokeWidth = 2,
  color,
  className = '',
  style = {}
}) {
  const [, force] = React.useState(0);
  const html = buildSvg(name, size, strokeWidth);
  // If Lucide hadn't loaded at first paint, re-render once it's available.
  React.useEffect(() => {
    if (!html) {
      const t = setTimeout(() => force(n => n + 1), 60);
      return () => clearTimeout(t);
    }
  }, [html]);
  return /*#__PURE__*/React.createElement("span", {
    className: className,
    "aria-hidden": "true",
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: size,
      height: size,
      color,
      flex: 'none',
      ...style
    },
    dangerouslySetInnerHTML: {
      __html: html
    }
  });
}
Object.assign(__ds_scope, { Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Icon.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const sizes = {
  sm: {
    height: 34,
    padding: '0 14px',
    fontSize: 13,
    gap: 6,
    icon: 16,
    radius: 'var(--radius-sm)'
  },
  md: {
    height: 44,
    padding: '0 18px',
    fontSize: 15,
    gap: 8,
    icon: 18,
    radius: 'var(--radius-md)'
  },
  lg: {
    height: 52,
    padding: '0 24px',
    fontSize: 16,
    gap: 9,
    icon: 20,
    radius: 'var(--radius-md)'
  }
};
const variants = {
  primary: {
    background: 'var(--accent)',
    color: 'var(--text-on-brand)',
    border: '1px solid transparent',
    shadow: 'var(--shadow-sm)'
  },
  secondary: {
    background: 'var(--surface-card)',
    color: 'var(--text-strong)',
    border: '1px solid var(--border-strong)',
    shadow: 'var(--shadow-xs)'
  },
  ghost: {
    background: 'transparent',
    color: 'var(--text-body)',
    border: '1px solid transparent',
    shadow: 'none'
  },
  danger: {
    background: 'var(--danger)',
    color: '#fff',
    border: '1px solid transparent',
    shadow: 'var(--shadow-sm)'
  }
};

/**
 * Button — primary action control.
 */
function Button({
  children,
  variant = 'primary',
  size = 'md',
  iconLeft,
  iconRight,
  fullWidth = false,
  disabled = false,
  onClick,
  style = {},
  ...rest
}) {
  const s = sizes[size] || sizes.md;
  const v = variants[variant] || variants.primary;
  const [active, setActive] = React.useState(false);
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    onClick: disabled ? undefined : onClick,
    onPointerDown: () => setActive(true),
    onPointerUp: () => setActive(false),
    onPointerLeave: () => setActive(false),
    disabled: disabled,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: s.gap,
      height: s.height,
      padding: s.padding,
      fontFamily: 'var(--font-sans)',
      fontSize: s.fontSize,
      fontWeight: 600,
      letterSpacing: 'var(--tracking-snug)',
      borderRadius: s.radius,
      background: v.background,
      color: v.color,
      border: v.border,
      boxShadow: active ? 'none' : v.shadow,
      width: fullWidth ? '100%' : 'auto',
      cursor: disabled ? 'not-allowed' : 'pointer',
      whiteSpace: 'nowrap',
      opacity: disabled ? 0.45 : 1,
      transform: active ? 'scale(0.97)' : 'none',
      transition: 'transform var(--dur-fast) var(--ease-spring), box-shadow var(--dur-fast), background var(--dur-fast)',
      WebkitTapHighlightColor: 'transparent',
      userSelect: 'none',
      ...style
    }
  }, rest), iconLeft && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: iconLeft,
    size: s.icon,
    strokeWidth: 2.2
  }), children, iconRight && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: iconRight,
    size: s.icon,
    strokeWidth: 2.2
  }));
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const sizes = {
  sm: 32,
  md: 40,
  lg: 48
};
const iconSizes = {
  sm: 17,
  md: 20,
  lg: 22
};
const variants = {
  solid: {
    background: 'var(--accent)',
    color: '#fff',
    border: '1px solid transparent'
  },
  soft: {
    background: 'var(--fill)',
    color: 'var(--text-body)',
    border: '1px solid transparent'
  },
  ghost: {
    background: 'transparent',
    color: 'var(--text-muted)',
    border: '1px solid transparent'
  },
  outline: {
    background: 'var(--surface-card)',
    color: 'var(--text-body)',
    border: '1px solid var(--border-strong)'
  }
};

/**
 * IconButton — square/round icon-only control for toolbars and headers.
 */
function IconButton({
  icon,
  variant = 'ghost',
  size = 'md',
  round = false,
  disabled = false,
  onClick,
  ariaLabel,
  style = {},
  ...rest
}) {
  const dim = sizes[size] || sizes.md;
  const v = variants[variant] || variants.ghost;
  const [active, setActive] = React.useState(false);
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    "aria-label": ariaLabel,
    onClick: disabled ? undefined : onClick,
    onPointerDown: () => setActive(true),
    onPointerUp: () => setActive(false),
    onPointerLeave: () => setActive(false),
    disabled: disabled,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: dim,
      height: dim,
      borderRadius: round ? '999px' : 'var(--radius-sm)',
      background: v.background,
      color: v.color,
      border: v.border,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.4 : 1,
      transform: active ? 'scale(0.9)' : 'none',
      transition: 'transform var(--dur-fast) var(--ease-spring), background var(--dur-fast)',
      WebkitTapHighlightColor: 'transparent',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: iconSizes[size] || 20,
    strokeWidth: 2.1
  }));
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/data/EntityIcon.jsx
try { (() => {
/** Canonical metadata for Orbit's five linkable entity types. */
const ENTITY_META = {
  person: {
    label: 'Person',
    color: 'var(--person)',
    soft: 'var(--person-soft)',
    icon: 'user-round'
  },
  task: {
    label: 'Task',
    color: 'var(--task)',
    soft: 'var(--task-soft)',
    icon: 'circle-check'
  },
  routine: {
    label: 'Routine',
    color: 'var(--routine)',
    soft: 'var(--routine-soft)',
    icon: 'repeat'
  },
  habit: {
    label: 'Habit',
    color: 'var(--habit)',
    soft: 'var(--habit-soft)',
    icon: 'flame'
  },
  project: {
    label: 'Project',
    color: 'var(--project)',
    soft: 'var(--project-soft)',
    icon: 'folder'
  }
};
const dims = {
  sm: 30,
  md: 38,
  lg: 46
};
const icons = {
  sm: 16,
  md: 20,
  lg: 24
};

/**
 * EntityIcon — rounded-square, tinted glyph identifying an entity type.
 */
function EntityIcon({
  type = 'task',
  size = 'md',
  style = {}
}) {
  const meta = ENTITY_META[type] || ENTITY_META.task;
  const d = dims[size] || dims.md;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 'none',
      width: d,
      height: d,
      borderRadius: 'var(--radius-sm)',
      background: meta.soft,
      color: meta.color,
      ...style
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: meta.icon,
    size: icons[size] || 20,
    strokeWidth: 2.1
  }));
}
Object.assign(__ds_scope, { ENTITY_META, EntityIcon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/EntityIcon.jsx", error: String((e && e.message) || e) }); }

// components/core/Tag.jsx
try { (() => {
/**
 * Tag — small pill with a leading dot. Pass `type` to auto-color by entity,
 * or `color`/`children` for a free-form tag.
 */
function Tag({
  type,
  color,
  children,
  dot = true,
  style = {}
}) {
  const meta = type ? __ds_scope.ENTITY_META[type] : null;
  const c = color || (meta ? meta.color : 'var(--text-muted)');
  const label = children || (meta ? meta.label : '');
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      height: 24,
      padding: '0 10px',
      borderRadius: 'var(--radius-pill)',
      background: 'var(--fill)',
      color: 'var(--text-body)',
      fontFamily: 'var(--font-sans)',
      fontSize: 12.5,
      fontWeight: 600,
      letterSpacing: 'var(--tracking-snug)',
      whiteSpace: 'nowrap',
      ...style
    }
  }, dot && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8,
      height: 8,
      borderRadius: 999,
      background: c,
      flex: 'none'
    }
  }), label);
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Tag.jsx", error: String((e && e.message) || e) }); }

// components/data/Heatmap.jsx
try { (() => {
/**
 * Heatmap — consistency grid using the streak heat ramp. `data` is an array of
 * intensities 0–4. Wraps into `columns` columns.
 */
function Heatmap({
  data = [],
  columns = 7,
  cell = 15,
  gap = 4,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: `repeat(${columns}, ${cell}px)`,
      gap,
      ...style
    }
  }, data.map((v, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    title: `${v}`,
    style: {
      width: cell,
      height: cell,
      borderRadius: 4,
      background: `var(--heat-${Math.max(0, Math.min(4, v))})`
    }
  })));
}
Object.assign(__ds_scope, { Heatmap });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/Heatmap.jsx", error: String((e && e.message) || e) }); }

// components/data/ProgressBar.jsx
try { (() => {
/**
 * ProgressBar — thin completion bar (e.g. today's reminders done).
 */
function ProgressBar({
  value = 0,
  max = 100,
  color = 'var(--accent)',
  height = 8,
  style = {}
}) {
  const pct = max > 0 ? Math.max(0, Math.min(100, value / max * 100)) : 0;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      height,
      borderRadius: 999,
      overflow: 'hidden',
      background: 'var(--surface-sunk)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: `${pct}%`,
      height: '100%',
      borderRadius: 999,
      background: color,
      transition: 'width var(--dur-slow) var(--ease-out)'
    }
  }));
}
Object.assign(__ds_scope, { ProgressBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/ProgressBar.jsx", error: String((e && e.message) || e) }); }

// components/data/StreakBadge.jsx
try { (() => {
/**
 * StreakBadge — flame glyph + day count in mono. Greys out when a streak breaks.
 */
function StreakBadge({
  count = 0,
  active = true,
  style = {}
}) {
  const color = active && count > 0 ? 'var(--habit)' : 'var(--text-subtle)';
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      padding: '3px 8px',
      borderRadius: 'var(--radius-pill)',
      background: active && count > 0 ? 'var(--habit-soft)' : 'var(--fill)',
      color,
      ...style
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "flame",
    size: 14,
    strokeWidth: 2.4
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 13,
      fontWeight: 600,
      lineHeight: 1
    }
  }, count));
}
Object.assign(__ds_scope, { StreakBadge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/StreakBadge.jsx", error: String((e && e.message) || e) }); }

// components/forms/CheckCircle.jsx
try { (() => {
const dims = {
  sm: 24,
  md: 28,
  lg: 32
};

/**
 * CheckCircle — circular completion toggle. Fills with `color` (defaults to the
 * entity-type accent) and springs in a checkmark when done.
 */
function CheckCircle({
  checked = false,
  onChange,
  color = 'var(--accent)',
  size = 'md',
  style = {}
}) {
  const d = dims[size] || dims.md;
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    role: "checkbox",
    "aria-checked": checked,
    onClick: () => onChange && onChange(!checked),
    style: {
      width: d,
      height: d,
      flex: 'none',
      borderRadius: 999,
      padding: 0,
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: checked ? color : 'transparent',
      border: checked ? `2px solid ${color}` : '2px solid var(--line-strong)',
      transition: 'background var(--dur-fast) var(--ease-out), border-color var(--dur-fast)',
      WebkitTapHighlightColor: 'transparent'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      color: '#fff',
      transform: checked ? 'scale(1)' : 'scale(0)',
      opacity: checked ? 1 : 0,
      transition: 'transform var(--dur-base) var(--ease-spring), opacity var(--dur-fast)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "check",
    size: d * 0.58,
    strokeWidth: 3
  })));
}
Object.assign(__ds_scope, { CheckCircle });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/CheckCircle.jsx", error: String((e && e.message) || e) }); }

// components/data/EntityRow.jsx
try { (() => {
/**
 * EntityRow — the signature Orbit list row. Entity-typed icon + accent, title,
 * subtitle, and a trailing completion check (or any custom trailing node).
 */
function EntityRow({
  type = 'task',
  title,
  subtitle,
  checked = false,
  onToggle,
  showCheck = true,
  trailing,
  onClick,
  style = {}
}) {
  const meta = __ds_scope.ENTITY_META[type] || __ds_scope.ENTITY_META.task;
  const [active, setActive] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    onPointerDown: () => onClick && setActive(true),
    onPointerUp: () => setActive(false),
    onPointerLeave: () => setActive(false),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '12px 14px',
      background: 'var(--surface-card)',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border-default)',
      borderLeft: `var(--border-accent) solid ${meta.color}`,
      boxShadow: 'var(--shadow-sm)',
      cursor: onClick ? 'pointer' : 'default',
      transform: active ? 'scale(0.99)' : 'none',
      transition: 'transform var(--dur-fast) var(--ease-out)',
      ...style
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.EntityIcon, {
    type: type
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 15.5,
      fontWeight: 600,
      color: 'var(--text-strong)',
      letterSpacing: 'var(--tracking-snug)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      textDecoration: checked ? 'line-through' : 'none',
      opacity: checked ? 0.5 : 1
    }
  }, title), subtitle && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 13,
      color: 'var(--text-muted)',
      marginTop: 2,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, subtitle)), trailing, showCheck && !trailing && /*#__PURE__*/React.createElement(__ds_scope.CheckCircle, {
    checked: checked,
    onChange: onToggle,
    color: meta.color
  }));
}
Object.assign(__ds_scope, { EntityRow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/EntityRow.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Input — labeled single-line text field with optional leading icon.
 */
function Input({
  label,
  value,
  onChange,
  placeholder,
  icon,
  type = 'text',
  error,
  disabled = false,
  style = {},
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const border = error ? 'var(--danger)' : focus ? 'var(--accent)' : 'var(--border-strong)';
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 13,
      fontWeight: 600,
      color: 'var(--text-body)'
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 9,
      height: 46,
      padding: '0 14px',
      background: disabled ? 'var(--fill)' : 'var(--surface-card)',
      borderRadius: 'var(--radius-md)',
      border: `1.5px solid ${border}`,
      boxShadow: focus ? '0 0 0 3px var(--orbit-100)' : 'none',
      transition: 'border-color var(--dur-fast), box-shadow var(--dur-fast)'
    }
  }, icon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 18,
    color: "var(--text-subtle)"
  }), /*#__PURE__*/React.createElement("input", _extends({
    type: type,
    value: value,
    onChange: onChange,
    placeholder: placeholder,
    disabled: disabled,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      flex: 1,
      border: 'none',
      outline: 'none',
      background: 'transparent',
      fontFamily: 'var(--font-sans)',
      fontSize: 15,
      color: 'var(--text-strong)',
      minWidth: 0
    }
  }, rest))), error && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 12,
      color: 'var(--danger)'
    }
  }, error));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/SearchBar.jsx
try { (() => {
/**
 * SearchBar — rounded search field used atop lists (Today, Items, link-picker).
 */
function SearchBar({
  value = '',
  onChange,
  placeholder = 'Search',
  onClear,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 9,
      height: 42,
      padding: '0 12px',
      background: 'var(--surface-sunk)',
      borderRadius: 'var(--radius-md)',
      ...style
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "search",
    size: 18,
    color: "var(--text-subtle)"
  }), /*#__PURE__*/React.createElement("input", {
    value: value,
    onChange: onChange,
    placeholder: placeholder,
    style: {
      flex: 1,
      border: 'none',
      outline: 'none',
      background: 'transparent',
      fontFamily: 'var(--font-sans)',
      fontSize: 15,
      color: 'var(--text-strong)',
      minWidth: 0
    }
  }), value && /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onClear,
    "aria-label": "Clear",
    style: {
      display: 'inline-flex',
      border: 'none',
      background: 'var(--ink-300)',
      color: '#fff',
      borderRadius: 999,
      width: 18,
      height: 18,
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      padding: 0
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "x",
    size: 12,
    strokeWidth: 2.6
  })));
}
Object.assign(__ds_scope, { SearchBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/SearchBar.jsx", error: String((e && e.message) || e) }); }

// components/forms/SegmentedControl.jsx
try { (() => {
/**
 * SegmentedControl — iOS-style segmented filter. `options` is an array of
 * { value, label } (or plain strings). Controlled via `value` + `onChange`.
 */
function SegmentedControl({
  options = [],
  value,
  onChange,
  style = {}
}) {
  const opts = options.map(o => typeof o === 'string' ? {
    value: o,
    label: o
  } : o);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 2,
      padding: 3,
      borderRadius: 'var(--radius-md)',
      background: 'var(--surface-sunk)',
      ...style
    }
  }, opts.map(o => {
    const selected = o.value === value;
    return /*#__PURE__*/React.createElement("button", {
      key: o.value,
      type: "button",
      onClick: () => onChange && onChange(o.value),
      style: {
        flex: 1,
        height: 32,
        border: 'none',
        borderRadius: 'var(--radius-sm)',
        cursor: 'pointer',
        background: selected ? 'var(--surface-card)' : 'transparent',
        color: selected ? 'var(--text-strong)' : 'var(--text-muted)',
        fontFamily: 'var(--font-sans)',
        fontSize: 13.5,
        fontWeight: 600,
        letterSpacing: 'var(--tracking-snug)',
        boxShadow: selected ? 'var(--shadow-xs)' : 'none',
        transition: 'background var(--dur-fast), color var(--dur-fast)',
        WebkitTapHighlightColor: 'transparent',
        whiteSpace: 'nowrap',
        padding: '0 10px'
      }
    }, o.label);
  }));
}
Object.assign(__ds_scope, { SegmentedControl });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/SegmentedControl.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
/**
 * Switch — toggle used for "Track as streak", "Use global default", etc.
 */
function Switch({
  checked = false,
  onChange,
  disabled = false,
  color = 'var(--accent)',
  style = {}
}) {
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    role: "switch",
    "aria-checked": checked,
    disabled: disabled,
    onClick: () => !disabled && onChange && onChange(!checked),
    style: {
      position: 'relative',
      width: 46,
      height: 28,
      flex: 'none',
      borderRadius: 999,
      border: 'none',
      background: checked ? color : 'var(--line-strong)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      padding: 0,
      transition: 'background var(--dur-base) var(--ease-out)',
      WebkitTapHighlightColor: 'transparent',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 3,
      left: 3,
      width: 22,
      height: 22,
      borderRadius: 999,
      background: '#fff',
      boxShadow: 'var(--shadow-sm)',
      transform: checked ? 'translateX(18px)' : 'translateX(0)',
      transition: 'transform var(--dur-base) var(--ease-spring)'
    }
  }));
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/nav/Fab.jsx
try { (() => {
/**
 * Fab — floating action button with the brand glow. Defaults to a plus.
 */
function Fab({
  icon = 'plus',
  onClick,
  label,
  style = {}
}) {
  const [active, setActive] = React.useState(false);
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onClick,
    "aria-label": label || 'Add',
    onPointerDown: () => setActive(true),
    onPointerUp: () => setActive(false),
    onPointerLeave: () => setActive(false),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      height: 56,
      width: label ? 'auto' : 56,
      padding: label ? '0 22px 0 18px' : 0,
      borderRadius: 999,
      border: 'none',
      cursor: 'pointer',
      background: 'var(--accent)',
      color: '#fff',
      boxShadow: 'var(--shadow-pop)',
      transform: active ? 'scale(0.93)' : 'none',
      transition: 'transform var(--dur-fast) var(--ease-spring)',
      WebkitTapHighlightColor: 'transparent',
      ...style
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 26,
    strokeWidth: 2.4
  }), label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 16,
      fontWeight: 700
    }
  }, label));
}
Object.assign(__ds_scope, { Fab });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/nav/Fab.jsx", error: String((e && e.message) || e) }); }

// components/nav/ScreenHeader.jsx
try { (() => {
/**
 * ScreenHeader — large screen title with optional eyebrow, subtitle and a
 * trailing action node (e.g. an IconButton).
 */
function ScreenHeader({
  eyebrow,
  title,
  subtitle,
  trailing,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("header", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 12,
      padding: '8px 0 14px',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, eyebrow && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: 'var(--tracking-wider)',
      textTransform: 'uppercase',
      color: 'var(--text-subtle)',
      marginBottom: 4
    }
  }, eyebrow), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-display)',
      fontSize: 28,
      fontWeight: 800,
      letterSpacing: 'var(--tracking-tight)',
      color: 'var(--text-strong)',
      lineHeight: 1.05
    }
  }, title), subtitle && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '6px 0 0',
      fontFamily: 'var(--font-sans)',
      fontSize: 14,
      color: 'var(--text-muted)'
    }
  }, subtitle)), trailing);
}
Object.assign(__ds_scope, { ScreenHeader });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/nav/ScreenHeader.jsx", error: String((e && e.message) || e) }); }

// components/nav/TabBar.jsx
try { (() => {
/**
 * TabBar — bottom navigation. `tabs` is an array of { key, label, icon }.
 */
function TabBar({
  tabs = [],
  active,
  onChange,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      alignItems: 'stretch',
      height: 'var(--tabbar-h)',
      background: 'color-mix(in srgb, var(--surface-card) 88%, transparent)',
      backdropFilter: 'saturate(1.4) blur(12px)',
      WebkitBackdropFilter: 'saturate(1.4) blur(12px)',
      borderTop: '1px solid var(--border-default)',
      ...style
    }
  }, tabs.map(t => {
    const on = t.key === active;
    return /*#__PURE__*/React.createElement("button", {
      key: t.key,
      type: "button",
      onClick: () => onChange && onChange(t.key),
      style: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 3,
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        padding: '6px 0',
        color: on ? 'var(--accent)' : 'var(--text-subtle)',
        WebkitTapHighlightColor: 'transparent',
        transition: 'color var(--dur-fast)'
      }
    }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
      name: t.icon,
      size: 23,
      strokeWidth: on ? 2.4 : 2
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-sans)',
        fontSize: 11,
        fontWeight: on ? 700 : 500,
        letterSpacing: '0.01em'
      }
    }, t.label));
  }));
}
Object.assign(__ds_scope, { TabBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/nav/TabBar.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/OrbitApp.jsx
try { (() => {
// Orbit UI kit — app shell (navigation, state, device frame)
const {
  TabBar,
  Fab,
  Icon,
  Switch,
  Badge
} = window.OrbitDesignSystem_f3fc09;
const {
  IOSDevice
} = window;
function SettingsRow({
  icon,
  color,
  title,
  detail,
  last,
  onClick
}) {
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '13px 14px',
      borderBottom: last ? 'none' : '1px solid var(--border-default)',
      cursor: onClick ? 'pointer' : 'default'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 30,
      height: 30,
      borderRadius: 8,
      background: color,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 17
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      fontSize: 15.5,
      color: 'var(--text-strong)'
    }
  }, title), detail && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      color: 'var(--text-muted)',
      fontFamily: 'var(--font-mono)'
    }
  }, detail), /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-right",
    size: 17,
    color: "var(--text-subtle)"
  }));
}
function SettingsGroup({
  header,
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: 'var(--tracking-wider)',
      textTransform: 'uppercase',
      color: 'var(--text-subtle)',
      margin: '0 2px 8px'
    }
  }, header), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-card)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-sm)',
      overflow: 'hidden'
    }
  }, children));
}
function SettingsScreen() {
  const {
    ScreenHeader
  } = window.OrbitDesignSystem_f3fc09;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 var(--screen-pad) 120px'
    }
  }, /*#__PURE__*/React.createElement(ScreenHeader, {
    title: "Settings"
  }), /*#__PURE__*/React.createElement(SettingsGroup, {
    header: "Default reminders"
  }, /*#__PURE__*/React.createElement(SettingsRow, {
    icon: "users",
    color: "var(--person)",
    title: "Stay-in-touch cadence",
    detail: "21 days"
  }), /*#__PURE__*/React.createElement(SettingsRow, {
    icon: "clock",
    color: "var(--task)",
    title: "Default time of day",
    detail: "09:00"
  }), /*#__PURE__*/React.createElement(SettingsRow, {
    icon: "bell-ring",
    color: "var(--routine)",
    title: "Lead time",
    detail: "1 day",
    last: true
  })), /*#__PURE__*/React.createElement(SettingsGroup, {
    header: "Integrations"
  }, /*#__PURE__*/React.createElement(SettingsRow, {
    icon: "house",
    color: "var(--habit)",
    title: "Home Assistant",
    detail: "Not connected",
    last: true
  })), /*#__PURE__*/React.createElement(SettingsGroup, {
    header: "App"
  }, /*#__PURE__*/React.createElement(SettingsRow, {
    icon: "palette",
    color: "var(--project)",
    title: "Appearance",
    detail: "Light"
  }), /*#__PURE__*/React.createElement(SettingsRow, {
    icon: "database",
    color: "var(--info)",
    title: "Local data",
    detail: "On device"
  }), /*#__PURE__*/React.createElement(SettingsRow, {
    icon: "info",
    color: "var(--ink-500)",
    title: "About Orbit",
    last: true
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      fontSize: 12.5,
      color: 'var(--text-subtle)',
      marginTop: 8
    }
  }, "Local-first \xB7 no account \xB7 everything stays on this device"));
}
function Toast({
  message
}) {
  if (!message) return null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 96,
      left: 0,
      right: 0,
      display: 'flex',
      justifyContent: 'center',
      zIndex: 90,
      pointerEvents: 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      background: 'var(--ink-900)',
      color: '#fff',
      padding: '11px 16px',
      borderRadius: 'var(--radius-pill)',
      boxShadow: 'var(--shadow-lg)',
      fontSize: 14,
      fontWeight: 600,
      animation: 'toastIn var(--dur-base) var(--ease-spring)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check-circle-2",
    size: 17,
    color: "var(--routine)"
  }), message), /*#__PURE__*/React.createElement("style", null, `@keyframes toastIn { from { transform: translateY(10px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`));
}
function OrbitApp() {
  const [items, setItems] = React.useState(window.ORBIT_TODAY.map(i => ({
    ...i
  })));
  const [allItems, setAllItems] = React.useState(window.ORBIT_ITEMS.map(i => ({
    ...i
  })));
  const [people, setPeople] = React.useState(window.ORBIT_PEOPLE.map(p => ({
    ...p
  })));
  const [tab, setTab] = React.useState('today');
  const [view, setView] = React.useState(null); // {name:'person'|'habit', id}
  const [sheet, setSheet] = React.useState(null); // {type:'new'|'reminder', kind}
  const [toast, setToast] = React.useState('');
  const [query, setQuery] = React.useState('');
  const [filter, setFilter] = React.useState('all');
  const flash = m => {
    setToast(m);
    setTimeout(() => setToast(''), 1900);
  };
  const toggle = id => {
    setItems(xs => xs.map(i => i.id === id ? {
      ...i,
      done: !i.done
    } : i));
    setAllItems(xs => xs.map(i => i.id === id ? {
      ...i,
      done: !i.done
    } : i));
  };
  const logContact = id => {
    setPeople(ps => ps.map(p => p.id === id ? {
      ...p,
      lastContactDays: 0
    } : p));
    const p = people.find(x => x.id === id);
    flash(`Logged contact with ${p ? p.name.split(' ')[0] : 'them'}`);
    setView(null);
  };
  const addItem = (type, title) => {
    const sub = {
      person: 'Just added',
      task: 'No due date',
      routine: 'No schedule yet',
      habit: 'Daily · new',
      project: '0 milestones'
    }[type];
    const it = {
      id: 'n' + Date.now(),
      type,
      title,
      subtitle: sub,
      done: false,
      streak: type === 'habit' ? 0 : undefined
    };
    setItems(xs => [it, ...xs]);
    setAllItems(xs => [it, ...xs]);
    setSheet(null);
    flash(`${title} added`);
  };
  const personById = id => people.find(p => p.id === id);
  const habitById = id => allItems.find(i => i.id === id) || items.find(i => i.id === id);
  let screen;
  if (view && view.name === 'person') {
    screen = /*#__PURE__*/React.createElement(window.PersonDetail, {
      person: personById(view.id),
      onBack: () => setView(null),
      onLogContact: logContact,
      onOpenReminder: kind => setSheet({
        type: 'reminder',
        kind
      })
    });
  } else if (view && view.name === 'habit') {
    screen = /*#__PURE__*/React.createElement(window.HabitDetail, {
      habit: habitById(view.id),
      onBack: () => setView(null),
      onToggleStreak: () => {}
    });
  } else if (tab === 'today') {
    screen = /*#__PURE__*/React.createElement(window.TodayScreen, {
      items: items,
      onToggle: toggle,
      onOpenPerson: id => setView({
        name: 'person',
        id
      }),
      onOpenHabit: id => setView({
        name: 'habit',
        id
      }),
      query: query,
      setQuery: setQuery
    });
  } else if (tab === 'items') {
    screen = /*#__PURE__*/React.createElement(window.ItemsScreen, {
      items: allItems,
      onToggle: toggle,
      onOpenPerson: id => setView({
        name: 'person',
        id
      }),
      onOpenHabit: id => setView({
        name: 'habit',
        id
      }),
      query: query,
      setQuery: setQuery,
      filter: filter,
      setFilter: setFilter
    });
  } else {
    screen = /*#__PURE__*/React.createElement(SettingsScreen, null);
  }
  const showFab = !view;
  return /*#__PURE__*/React.createElement(IOSDevice, null, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      height: '100%',
      background: 'var(--surface-page)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      overflowY: 'auto',
      paddingTop: 52
    }
  }, screen), showFab && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      right: 20,
      bottom: 92,
      zIndex: 40
    }
  }, /*#__PURE__*/React.createElement(Fab, {
    icon: "plus",
    onClick: () => setSheet({
      type: 'new'
    })
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      paddingBottom: 20,
      zIndex: 30
    }
  }, /*#__PURE__*/React.createElement(TabBar, {
    active: tab,
    onChange: t => {
      setTab(t);
      setView(null);
    },
    tabs: [{
      key: 'today',
      label: 'Today',
      icon: 'sun'
    }, {
      key: 'items',
      label: 'Items',
      icon: 'layers'
    }, {
      key: 'settings',
      label: 'Settings',
      icon: 'settings'
    }]
  })), sheet && sheet.type === 'new' && /*#__PURE__*/React.createElement(window.NewSheet, {
    onClose: () => setSheet(null),
    onAdd: addItem
  }), sheet && sheet.type === 'reminder' && /*#__PURE__*/React.createElement(window.ReminderSheet, {
    kind: sheet.kind,
    onClose: () => setSheet(null)
  }), /*#__PURE__*/React.createElement(Toast, {
    message: toast
  })));
}
Object.assign(window, {
  OrbitApp
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/OrbitApp.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/create.jsx
try { (() => {
// Orbit UI kit — bottom sheets: create (type picker + form) and reminder config
const {
  Button,
  Input,
  Switch,
  SegmentedControl,
  EntityIcon,
  IconButton,
  Icon,
  ENTITY_META
} = window.OrbitDesignSystem_f3fc09;
function BottomSheet({
  children,
  onClose,
  height
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      zIndex: 80,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'absolute',
      inset: 0,
      background: 'rgba(27,26,23,0.4)',
      backdropFilter: 'blur(2px)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      background: 'var(--surface-page)',
      borderRadius: '24px 24px 0 0',
      boxShadow: 'var(--shadow-xl)',
      padding: '10px 20px calc(20px + 16px)',
      maxHeight: height || '88%',
      overflow: 'auto',
      animation: 'sheetUp var(--dur-base) var(--ease-out)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 38,
      height: 5,
      borderRadius: 999,
      background: 'var(--line-strong)',
      margin: '0 auto 14px'
    }
  }), children), /*#__PURE__*/React.createElement("style", null, `@keyframes sheetUp { from { transform: translateY(100%); } to { transform: translateY(0); } }`));
}
const TYPE_DESC = {
  person: 'Someone to stay close to',
  task: 'A one-off to-do',
  routine: 'Something on a schedule',
  habit: 'Build a streak',
  project: 'A goal with milestones'
};
function NewSheet({
  onClose,
  onAdd
}) {
  const [type, setType] = React.useState(null);
  const [title, setTitle] = React.useState('');
  const [streak, setStreak] = React.useState(true);
  if (!type) {
    return /*#__PURE__*/React.createElement(BottomSheet, {
      onClose: onClose
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-display)',
        fontSize: 22,
        fontWeight: 800,
        letterSpacing: 'var(--tracking-tight)',
        marginBottom: 4
      }
    }, "Add to your orbit"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 14,
        color: 'var(--text-muted)',
        marginBottom: 16
      }
    }, "What are you adding?"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 9
      }
    }, Object.keys(ENTITY_META).map(t => /*#__PURE__*/React.createElement("button", {
      key: t,
      onClick: () => setType(t),
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 13,
        padding: 12,
        borderRadius: 'var(--radius-lg)',
        background: 'var(--surface-card)',
        border: '1px solid var(--border-default)',
        borderLeft: '3px solid ' + ENTITY_META[t].color,
        boxShadow: 'var(--shadow-sm)',
        cursor: 'pointer',
        textAlign: 'left',
        WebkitTapHighlightColor: 'transparent'
      }
    }, /*#__PURE__*/React.createElement(EntityIcon, {
      type: t,
      size: "lg"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-sans)',
        fontSize: 16,
        fontWeight: 700,
        color: 'var(--text-strong)'
      }
    }, ENTITY_META[t].label), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        color: 'var(--text-muted)',
        marginTop: 1
      }
    }, TYPE_DESC[t])), /*#__PURE__*/React.createElement(Icon, {
      name: "chevron-right",
      size: 18,
      color: "var(--text-subtle)"
    })))));
  }
  return /*#__PURE__*/React.createElement(BottomSheet, {
    onClose: onClose
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    icon: "chevron-left",
    variant: "soft",
    ariaLabel: "Back",
    onClick: () => setType(null)
  }), /*#__PURE__*/React.createElement(EntityIcon, {
    type: type
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 20,
      fontWeight: 800,
      letterSpacing: 'var(--tracking-tight)'
    }
  }, "New ", ENTITY_META[type].label)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Title",
    value: title,
    onChange: e => setTitle(e.target.value),
    placeholder: type === 'person' ? 'e.g. Sam Rivera' : 'e.g. ' + (type === 'habit' ? 'Morning stretch' : 'Buy groceries'),
    icon: "pen-line"
  }), (type === 'habit' || type === 'routine') && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      background: 'var(--surface-card)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-md)',
      padding: '12px 14px'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 600,
      color: 'var(--text-strong)'
    }
  }, "Track as streak"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: 'var(--text-muted)',
      marginTop: 2
    }
  }, "Gamify consistency")), /*#__PURE__*/React.createElement(Switch, {
    checked: streak,
    onChange: setStreak,
    color: "var(--habit)"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 7,
      alignItems: 'center',
      fontSize: 13,
      color: 'var(--text-muted)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "bell",
    size: 15,
    color: "var(--text-subtle)"
  }), "Reminder uses your global default \u2014 customize after saving."), /*#__PURE__*/React.createElement(Button, {
    fullWidth: true,
    size: "lg",
    iconLeft: "plus",
    onClick: () => onAdd(type, title || 'New ' + ENTITY_META[type].label)
  }, "Add ", ENTITY_META[type].label)));
}
function Field({
  label,
  children,
  disabled
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '13px 0',
      borderBottom: '1px solid var(--border-default)',
      opacity: disabled ? 0.45 : 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 15,
      color: 'var(--text-body)'
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 14,
      color: 'var(--text-strong)',
      fontWeight: 500
    }
  }, children));
}
function ReminderSheet({
  kind = 'stay_in_touch',
  onClose
}) {
  const [useDefault, setUseDefault] = React.useState(true);
  const isContact = kind === 'stay_in_touch';
  return /*#__PURE__*/React.createElement(BottomSheet, {
    onClose: onClose
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 20,
      fontWeight: 800,
      letterSpacing: 'var(--tracking-tight)',
      marginBottom: 2
    }
  }, isContact ? 'Stay-in-touch reminder' : 'Birthday reminder'), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13.5,
      color: 'var(--text-muted)',
      marginBottom: 16
    }
  }, "Per-item settings \xB7 overrides the global default"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      background: 'var(--accent-tint)',
      borderRadius: 'var(--radius-md)',
      padding: '13px 14px',
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14.5,
      fontWeight: 700,
      color: 'var(--orbit-700)'
    }
  }, "Use global default"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: 'var(--orbit-700)',
      opacity: 0.8,
      marginTop: 2
    }
  }, "Inherit changes you make in Settings")), /*#__PURE__*/React.createElement(Switch, {
    checked: useDefault,
    onChange: setUseDefault
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 2px',
      marginBottom: 18
    }
  }, isContact ? /*#__PURE__*/React.createElement(Field, {
    label: "Nudge me every",
    disabled: useDefault
  }, "21 days") : /*#__PURE__*/React.createElement(Field, {
    label: "Notify before",
    disabled: useDefault
  }, "1 day"), /*#__PURE__*/React.createElement(Field, {
    label: "Time of day",
    disabled: useDefault
  }, "09:00"), /*#__PURE__*/React.createElement(Field, {
    label: "Quiet hours",
    disabled: useDefault
  }, "22:00\u201308:00"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '13px 0',
      opacity: useDefault ? 0.45 : 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 15,
      color: 'var(--text-body)'
    }
  }, "Repeat until done"), /*#__PURE__*/React.createElement(Switch, {
    checked: !isContact,
    onChange: () => {},
    disabled: useDefault
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    fullWidth: true,
    onClick: onClose
  }, "Cancel"), /*#__PURE__*/React.createElement(Button, {
    fullWidth: true,
    onClick: onClose
  }, "Save")));
}
Object.assign(window, {
  BottomSheet,
  NewSheet,
  ReminderSheet
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/create.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/data.jsx
try { (() => {
// Orbit — mock data for the UI kit (fake, in-memory)
const ORBIT_PEOPLE = [{
  id: 'p1',
  type: 'person',
  name: 'Sam Rivera',
  handles: ['sms', 'whatsapp', 'instagram'],
  lastContactDays: 21,
  cadence: 21,
  birthday: 'Jun 16',
  linked: ['Plan birthday party', 'Buy birthday gift']
}, {
  id: 'p2',
  type: 'person',
  name: 'Alex Kim',
  handles: ['sms', 'phone'],
  lastContactDays: 6,
  cadence: 14,
  birthday: null,
  linked: []
}, {
  id: 'p3',
  type: 'person',
  name: 'Priya Nair',
  handles: ['whatsapp', 'instagram', 'linkedin'],
  lastContactDays: 34,
  cadence: 30,
  birthday: 'Sep 02',
  linked: ['Coffee catch-up']
}];
const ORBIT_TODAY = [{
  id: 't1',
  type: 'task',
  title: 'Buy birthday gift',
  subtitle: 'Due today · linked to Sam',
  status: 'overdue',
  done: false
}, {
  id: 'h1',
  type: 'habit',
  title: 'Morning stretch',
  subtitle: 'Daily · 7:00 AM',
  streak: 17,
  done: true
}, {
  id: 'r1',
  type: 'routine',
  title: 'Water the plants',
  subtitle: 'Every Tuesday',
  done: false
}, {
  id: 't2',
  type: 'task',
  title: 'Send Q3 deck to Alex',
  subtitle: 'Today · 5:00 PM',
  done: false
}, {
  id: 'h2',
  type: 'habit',
  title: 'Read 20 minutes',
  subtitle: 'Daily · 9:30 PM',
  streak: 4,
  done: false
}, {
  id: 'pr1',
  type: 'project',
  title: 'Plan birthday party',
  subtitle: '3 of 7 milestones',
  done: false
}];
const ORBIT_ITEMS = [...ORBIT_TODAY, {
  id: 'p1',
  type: 'person',
  title: 'Sam Rivera',
  subtitle: '21 days since contact',
  done: false
}, {
  id: 'p2',
  type: 'person',
  title: 'Alex Kim',
  subtitle: '6 days since contact',
  done: false
}, {
  id: 'p3',
  type: 'person',
  title: 'Priya Nair',
  subtitle: '34 days since contact',
  done: false
}, {
  id: 'h3',
  type: 'habit',
  title: 'No phone after 10pm',
  subtitle: 'Daily',
  streak: 0,
  done: false
}, {
  id: 't3',
  type: 'task',
  title: 'Renew passport',
  subtitle: 'Jul 30',
  done: false
}, {
  id: 'r2',
  type: 'routine',
  title: 'Weekly review',
  subtitle: 'Every Sunday',
  done: false
}, {
  id: 'pr2',
  type: 'project',
  title: 'Kitchen renovation',
  subtitle: '1 of 5 milestones',
  done: false
}];

// 16 weeks of streak intensity for the habit heatmap (0–4)
const ORBIT_HEATMAP = (() => {
  const out = [];
  for (let i = 0; i < 16 * 7; i++) {
    const r = Math.random();
    out.push(r < 0.12 ? 0 : r < 0.25 ? 1 : r < 0.45 ? 2 : r < 0.7 ? 3 : 4);
  }
  return out;
})();
const HANDLE_META = {
  sms: {
    icon: 'message-square',
    label: 'Message',
    color: 'var(--routine)'
  },
  phone: {
    icon: 'phone',
    label: 'Call',
    color: 'var(--task)'
  },
  whatsapp: {
    icon: 'message-circle',
    label: 'WhatsApp',
    color: 'var(--success)'
  },
  instagram: {
    icon: 'instagram',
    label: 'Instagram',
    color: 'var(--person)'
  },
  linkedin: {
    icon: 'linkedin',
    label: 'LinkedIn',
    color: 'var(--info)'
  },
  email: {
    icon: 'mail',
    label: 'Email',
    color: 'var(--habit)'
  }
};
Object.assign(window, {
  ORBIT_PEOPLE,
  ORBIT_TODAY,
  ORBIT_ITEMS,
  ORBIT_HEATMAP,
  HANDLE_META
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/data.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/detail.jsx
try { (() => {
// Orbit UI kit — Person detail, Habit detail, Reminder config sheet
const {
  IconButton,
  Icon,
  Avatar,
  Tag,
  Badge,
  Button,
  Switch,
  StreakBadge,
  Heatmap,
  EntityRow,
  SegmentedControl
} = window.OrbitDesignSystem_f3fc09;
const {
  SectionLabel
} = window; // defined in screens.jsx (loads first)

function BackBar({
  title,
  onBack
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '4px 0 10px'
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    icon: "chevron-left",
    variant: "soft",
    ariaLabel: "Back",
    onClick: onBack
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      fontFamily: 'var(--font-sans)',
      fontSize: 17,
      fontWeight: 700,
      color: 'var(--text-strong)',
      textAlign: 'center',
      letterSpacing: 'var(--tracking-snug)'
    }
  }, title), /*#__PURE__*/React.createElement(IconButton, {
    icon: "ellipsis",
    variant: "soft",
    ariaLabel: "More"
  }));
}
function ContactButton({
  handle,
  onClick
}) {
  const m = window.HANDLE_META[handle];
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    style: {
      flex: '1 0 0',
      minWidth: 72,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 6,
      padding: '12px 6px',
      borderRadius: 'var(--radius-md)',
      background: 'var(--surface-card)',
      border: '1px solid var(--border-default)',
      cursor: 'pointer',
      boxShadow: 'var(--shadow-xs)',
      WebkitTapHighlightColor: 'transparent'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 38,
      height: 38,
      borderRadius: 999,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'color-mix(in srgb, ' + m.color + ' 14%, transparent)',
      color: m.color
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: m.icon,
    size: 20
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 12,
      fontWeight: 600,
      color: 'var(--text-body)'
    }
  }, m.label));
}
function InfoCard({
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-card)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-sm)',
      padding: 16,
      ...style
    }
  }, children);
}
function PersonDetail({
  person,
  onBack,
  onLogContact,
  onOpenReminder
}) {
  const overdue = person.lastContactDays >= person.cadence;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 var(--screen-pad) 120px'
    }
  }, /*#__PURE__*/React.createElement(BackBar, {
    title: "Person",
    onBack: onBack
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 10,
      padding: '8px 0 18px'
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: person.name,
    size: "lg",
    style: {
      width: 76,
      height: 76,
      fontSize: 28
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 26,
      fontWeight: 800,
      letterSpacing: 'var(--tracking-tight)',
      color: 'var(--text-strong)'
    }
  }, person.name), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Tag, {
    type: "person"
  }), person.birthday && /*#__PURE__*/React.createElement(Tag, {
    color: "var(--project)",
    dot: false
  }, "\uD83C\uDF82 ", person.birthday))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      marginBottom: 16
    }
  }, person.handles.map(h => /*#__PURE__*/React.createElement(ContactButton, {
    key: h,
    handle: h,
    onClick: () => onLogContact(person.id)
  }))), /*#__PURE__*/React.createElement(InfoCard, {
    style: {
      marginBottom: 16,
      borderLeft: '3px solid ' + (overdue ? 'var(--person)' : 'var(--routine)')
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 700,
      color: 'var(--text-strong)'
    }
  }, "Stay in touch"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--text-muted)',
      marginTop: 3
    }
  }, "Every ", person.cadence, " days \xB7 last logged ", person.lastContactDays, "d ago")), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: overdue ? 'primary' : 'secondary',
    iconLeft: "check",
    onClick: () => onLogContact(person.id)
  }, "Log"))), /*#__PURE__*/React.createElement(SectionLabel, null, "Reminders"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 9
    }
  }, /*#__PURE__*/React.createElement(EntityRow, {
    type: "person",
    title: "Stay-in-touch nudge",
    subtitle: `Every ${person.cadence} days · inherits default`,
    onClick: () => onOpenReminder('stay_in_touch'),
    trailing: /*#__PURE__*/React.createElement(Icon, {
      name: "chevron-right",
      size: 18,
      color: "var(--text-subtle)"
    })
  }), person.birthday && /*#__PURE__*/React.createElement(EntityRow, {
    type: "person",
    title: "Birthday reminder",
    subtitle: `${person.birthday} · 1 day before, 9:00 AM`,
    onClick: () => onOpenReminder('date'),
    trailing: /*#__PURE__*/React.createElement(Icon, {
      name: "chevron-right",
      size: 18,
      color: "var(--text-subtle)"
    })
  })), person.linked.length > 0 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SectionLabel, null, "Linked items"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 9
    }
  }, person.linked.map((l, idx) => /*#__PURE__*/React.createElement(EntityRow, {
    key: idx,
    type: l.includes('party') ? 'project' : 'task',
    title: l,
    subtitle: l.includes('party') ? '3 of 7 milestones' : 'Linked to ' + person.name,
    trailing: /*#__PURE__*/React.createElement(Icon, {
      name: "link-2",
      size: 16,
      color: "var(--text-subtle)"
    }),
    showCheck: false
  })))));
}
function StatBlock({
  value,
  label,
  color
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 28,
      fontWeight: 600,
      color: color || 'var(--text-strong)',
      lineHeight: 1
    }
  }, value), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: 'var(--text-muted)',
      marginTop: 5,
      textTransform: 'uppercase',
      letterSpacing: 'var(--tracking-wide)'
    }
  }, label));
}
function HabitDetail({
  habit,
  onBack,
  onToggleStreak
}) {
  const streakMode = habit.streak !== undefined;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 var(--screen-pad) 120px'
    }
  }, /*#__PURE__*/React.createElement(BackBar, {
    title: "Habit",
    onBack: onBack
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 12,
      padding: '8px 0 16px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 60,
      height: 60,
      borderRadius: 'var(--radius-lg)',
      background: 'var(--habit-soft)',
      color: 'var(--habit)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "flame",
    size: 30
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 24,
      fontWeight: 800,
      letterSpacing: 'var(--tracking-tight)',
      color: 'var(--text-strong)'
    }
  }, habit.title), /*#__PURE__*/React.createElement(Tag, {
    type: "habit"
  })), /*#__PURE__*/React.createElement(InfoCard, {
    style: {
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement(StatBlock, {
    value: habit.streak,
    label: "Current",
    color: "var(--habit)"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 1,
      background: 'var(--border-default)'
    }
  }), /*#__PURE__*/React.createElement(StatBlock, {
    value: "23",
    label: "Best"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 1,
      background: 'var(--border-default)'
    }
  }), /*#__PURE__*/React.createElement(StatBlock, {
    value: "86%",
    label: "Consistency"
  }))), /*#__PURE__*/React.createElement(InfoCard, {
    style: {
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      color: 'var(--text-strong)',
      marginBottom: 12
    }
  }, "Last 16 weeks"), /*#__PURE__*/React.createElement(Heatmap, {
    data: window.ORBIT_HEATMAP,
    columns: 16,
    cell: 13,
    gap: 4
  })), /*#__PURE__*/React.createElement(InfoCard, {
    style: {
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 700,
      color: 'var(--text-strong)'
    }
  }, "Track as streak"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--text-muted)',
      marginTop: 3
    }
  }, "Gamify with a streak count & heatmap")), /*#__PURE__*/React.createElement(Switch, {
    checked: streakMode,
    onChange: onToggleStreak,
    color: "var(--habit)"
  }))), /*#__PURE__*/React.createElement(Button, {
    fullWidth: true,
    size: "lg",
    iconLeft: "check"
  }, "Mark done today"));
}
Object.assign(window, {
  PersonDetail,
  HabitDetail,
  BackBar,
  InfoCard
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/detail.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/ios-frame.jsx
try { (() => {
// @ds-adherence-ignore -- omelette starter scaffold (raw elements/hex/px by design)

/* BEGIN USAGE */
// iOS.jsx — Simplified iOS 26 (Liquid Glass) device frame
// Based on the iOS 26 UI Kit + Figma status bar spec. No assets, no deps.
// Exports (to window): IOSDevice, IOSStatusBar, IOSNavBar, IOSGlassPill, IOSList, IOSListRow, IOSKeyboard
//
// Usage — wrap your screen content in <IOSDevice> to get the bezel, status bar
// and home indicator (props: title, dark, keyboard):
//
//   <IOSDevice title="Settings">
//     ...your screen content...
//   </IOSDevice>
//   <IOSDevice dark title="Search" keyboard>…</IOSDevice>
/* END USAGE */

// ─────────────────────────────────────────────────────────────
// Status bar
// ─────────────────────────────────────────────────────────────
function IOSStatusBar({
  dark = false,
  time = '9:41'
}) {
  const c = dark ? '#fff' : '#000';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 154,
      alignItems: 'center',
      justifyContent: 'center',
      padding: '21px 24px 19px',
      boxSizing: 'border-box',
      position: 'relative',
      zIndex: 20,
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: 22,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 1.5
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: '-apple-system, "SF Pro", system-ui',
      fontWeight: 590,
      fontSize: 17,
      lineHeight: '22px',
      color: c
    }
  }, time)), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: 22,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 7,
      paddingTop: 1,
      paddingRight: 1
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "19",
    height: "12",
    viewBox: "0 0 19 12"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "0",
    y: "7.5",
    width: "3.2",
    height: "4.5",
    rx: "0.7",
    fill: c
  }), /*#__PURE__*/React.createElement("rect", {
    x: "4.8",
    y: "5",
    width: "3.2",
    height: "7",
    rx: "0.7",
    fill: c
  }), /*#__PURE__*/React.createElement("rect", {
    x: "9.6",
    y: "2.5",
    width: "3.2",
    height: "9.5",
    rx: "0.7",
    fill: c
  }), /*#__PURE__*/React.createElement("rect", {
    x: "14.4",
    y: "0",
    width: "3.2",
    height: "12",
    rx: "0.7",
    fill: c
  })), /*#__PURE__*/React.createElement("svg", {
    width: "17",
    height: "12",
    viewBox: "0 0 17 12"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M8.5 3.2C10.8 3.2 12.9 4.1 14.4 5.6L15.5 4.5C13.7 2.7 11.2 1.5 8.5 1.5C5.8 1.5 3.3 2.7 1.5 4.5L2.6 5.6C4.1 4.1 6.2 3.2 8.5 3.2Z",
    fill: c
  }), /*#__PURE__*/React.createElement("path", {
    d: "M8.5 6.8C9.9 6.8 11.1 7.3 12 8.2L13.1 7.1C11.8 5.9 10.2 5.1 8.5 5.1C6.8 5.1 5.2 5.9 3.9 7.1L5 8.2C5.9 7.3 7.1 6.8 8.5 6.8Z",
    fill: c
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "8.5",
    cy: "10.5",
    r: "1.5",
    fill: c
  })), /*#__PURE__*/React.createElement("svg", {
    width: "27",
    height: "13",
    viewBox: "0 0 27 13"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "0.5",
    y: "0.5",
    width: "23",
    height: "12",
    rx: "3.5",
    stroke: c,
    strokeOpacity: "0.35",
    fill: "none"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "2",
    y: "2",
    width: "20",
    height: "9",
    rx: "2",
    fill: c
  }), /*#__PURE__*/React.createElement("path", {
    d: "M25 4.5V8.5C25.8 8.2 26.5 7.2 26.5 6.5C26.5 5.8 25.8 4.8 25 4.5Z",
    fill: c,
    fillOpacity: "0.4"
  }))));
}

// ─────────────────────────────────────────────────────────────
// Liquid glass pill — blur + tint + shine
// ─────────────────────────────────────────────────────────────
function IOSGlassPill({
  children,
  dark = false,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: 44,
      minWidth: 44,
      borderRadius: 9999,
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: dark ? '0 2px 6px rgba(0,0,0,0.35), 0 6px 16px rgba(0,0,0,0.2)' : '0 1px 3px rgba(0,0,0,0.07), 0 3px 10px rgba(0,0,0,0.06)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: 9999,
      backdropFilter: 'blur(12px) saturate(180%)',
      WebkitBackdropFilter: 'blur(12px) saturate(180%)',
      background: dark ? 'rgba(120,120,128,0.28)' : 'rgba(255,255,255,0.5)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: 9999,
      boxShadow: dark ? 'inset 1.5px 1.5px 1px rgba(255,255,255,0.15), inset -1px -1px 1px rgba(255,255,255,0.08)' : 'inset 1.5px 1.5px 1px rgba(255,255,255,0.7), inset -1px -1px 1px rgba(255,255,255,0.4)',
      border: dark ? '0.5px solid rgba(255,255,255,0.15)' : '0.5px solid rgba(0,0,0,0.06)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      zIndex: 1,
      display: 'flex',
      alignItems: 'center',
      padding: '0 4px'
    }
  }, children));
}

// ─────────────────────────────────────────────────────────────
// Navigation bar — glass pills + large title
// ─────────────────────────────────────────────────────────────
function IOSNavBar({
  title = 'Title',
  dark = false,
  trailingIcon = true
}) {
  const muted = dark ? 'rgba(255,255,255,0.6)' : '#404040';
  const text = dark ? '#fff' : '#000';
  const pillIcon = content => /*#__PURE__*/React.createElement(IOSGlassPill, {
    dark: dark
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 36,
      height: 36,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, content));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      paddingTop: 62,
      paddingBottom: 10,
      position: 'relative',
      zIndex: 5
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 16px'
    }
  }, pillIcon(/*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "20",
    viewBox: "0 0 12 20",
    fill: "none",
    style: {
      marginLeft: -1
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M10 2L2 10l8 8",
    stroke: muted,
    strokeWidth: "2.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }))), trailingIcon && pillIcon(/*#__PURE__*/React.createElement("svg", {
    width: "22",
    height: "6",
    viewBox: "0 0 22 6"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "3",
    cy: "3",
    r: "2.5",
    fill: muted
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "11",
    cy: "3",
    r: "2.5",
    fill: muted
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "19",
    cy: "3",
    r: "2.5",
    fill: muted
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 16px',
      fontFamily: '-apple-system, system-ui',
      fontSize: 34,
      fontWeight: 700,
      lineHeight: '41px',
      color: text,
      letterSpacing: 0.4
    }
  }, title));
}

// ─────────────────────────────────────────────────────────────
// Grouped list (inset card, r:26) + row (52px)
// ─────────────────────────────────────────────────────────────
function IOSListRow({
  title,
  detail,
  icon,
  chevron = true,
  isLast = false,
  dark = false
}) {
  const text = dark ? '#fff' : '#000';
  const sec = dark ? 'rgba(235,235,245,0.6)' : 'rgba(60,60,67,0.6)';
  const ter = dark ? 'rgba(235,235,245,0.3)' : 'rgba(60,60,67,0.3)';
  const sep = dark ? 'rgba(84,84,88,0.65)' : 'rgba(60,60,67,0.12)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      minHeight: 52,
      padding: '0 16px',
      position: 'relative',
      fontFamily: '-apple-system, system-ui',
      fontSize: 17,
      letterSpacing: -0.43
    }
  }, icon && /*#__PURE__*/React.createElement("div", {
    style: {
      width: 30,
      height: 30,
      borderRadius: 7,
      background: icon,
      marginRight: 12,
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      color: text
    }
  }, title), detail && /*#__PURE__*/React.createElement("span", {
    style: {
      color: sec,
      marginRight: 6
    }
  }, detail), chevron && /*#__PURE__*/React.createElement("svg", {
    width: "8",
    height: "14",
    viewBox: "0 0 8 14",
    style: {
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M1 1l6 6-6 6",
    stroke: ter,
    strokeWidth: "2",
    fill: "none",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  })), !isLast && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      left: icon ? 58 : 16,
      height: 0.5,
      background: sep
    }
  }));
}
function IOSList({
  header,
  children,
  dark = false
}) {
  const hc = dark ? 'rgba(235,235,245,0.6)' : 'rgba(60,60,67,0.6)';
  const bg = dark ? '#1C1C1E' : '#fff';
  return /*#__PURE__*/React.createElement("div", null, header && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: '-apple-system, system-ui',
      fontSize: 13,
      color: hc,
      textTransform: 'uppercase',
      padding: '8px 36px 6px',
      letterSpacing: -0.08
    }
  }, header), /*#__PURE__*/React.createElement("div", {
    style: {
      background: bg,
      borderRadius: 26,
      margin: '0 16px',
      overflow: 'hidden'
    }
  }, children));
}

// ─────────────────────────────────────────────────────────────
// Device frame
// ─────────────────────────────────────────────────────────────
function IOSDevice({
  children,
  width = 402,
  height = 874,
  dark = false,
  title,
  keyboard = false
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width,
      height,
      borderRadius: 48,
      overflow: 'hidden',
      position: 'relative',
      background: dark ? '#000' : '#F2F2F7',
      boxShadow: '0 40px 80px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.12)',
      fontFamily: '-apple-system, system-ui, sans-serif',
      WebkitFontSmoothing: 'antialiased'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 11,
      left: '50%',
      transform: 'translateX(-50%)',
      width: 126,
      height: 37,
      borderRadius: 24,
      background: '#000',
      zIndex: 50
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 10
    }
  }, /*#__PURE__*/React.createElement(IOSStatusBar, {
    dark: dark
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }
  }, title !== undefined && /*#__PURE__*/React.createElement(IOSNavBar, {
    title: title,
    dark: dark
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflow: 'auto'
    }
  }, children), keyboard && /*#__PURE__*/React.createElement(IOSKeyboard, {
    dark: dark
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 60,
      height: 34,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-end',
      paddingBottom: 8,
      pointerEvents: 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 139,
      height: 5,
      borderRadius: 100,
      background: dark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.25)'
    }
  })));
}

// ─────────────────────────────────────────────────────────────
// Keyboard — iOS 26 liquid glass
// ─────────────────────────────────────────────────────────────
function IOSKeyboard({
  dark = false
}) {
  const glyph = dark ? 'rgba(255,255,255,0.7)' : '#595959';
  const sugg = dark ? 'rgba(255,255,255,0.6)' : '#333';
  const keyBg = dark ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.85)';

  // special-key icons
  const icons = {
    shift: /*#__PURE__*/React.createElement("svg", {
      width: "19",
      height: "17",
      viewBox: "0 0 19 17"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M9.5 1L1 9.5h4.5V16h8V9.5H18L9.5 1z",
      fill: glyph
    })),
    del: /*#__PURE__*/React.createElement("svg", {
      width: "23",
      height: "17",
      viewBox: "0 0 23 17"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M7 1h13a2 2 0 012 2v11a2 2 0 01-2 2H7l-6-7.5L7 1z",
      fill: "none",
      stroke: glyph,
      strokeWidth: "1.6",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M10 5l7 7M17 5l-7 7",
      stroke: glyph,
      strokeWidth: "1.6",
      strokeLinecap: "round"
    })),
    ret: /*#__PURE__*/React.createElement("svg", {
      width: "20",
      height: "14",
      viewBox: "0 0 20 14"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M18 1v6H4m0 0l4-4M4 7l4 4",
      fill: "none",
      stroke: "#fff",
      strokeWidth: "1.8",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }))
  };
  const key = (content, {
    w,
    flex,
    ret,
    fs = 25,
    k
  } = {}) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      height: 42,
      borderRadius: 8.5,
      flex: flex ? 1 : undefined,
      width: w,
      minWidth: 0,
      background: ret ? '#08f' : keyBg,
      boxShadow: '0 1px 0 rgba(0,0,0,0.075)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '-apple-system, "SF Compact", system-ui',
      fontSize: fs,
      fontWeight: 458,
      color: ret ? '#fff' : glyph
    }
  }, content);
  const row = (keys, pad = 0) => /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6.5,
      justifyContent: 'center',
      padding: `0 ${pad}px`
    }
  }, keys.map(l => key(l, {
    flex: true,
    k: l
  })));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      zIndex: 15,
      borderRadius: 27,
      overflow: 'hidden',
      padding: '11px 0 2px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      boxShadow: dark ? '0 -2px 20px rgba(0,0,0,0.09)' : '0 -1px 6px rgba(0,0,0,0.018), 0 -3px 20px rgba(0,0,0,0.012)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: 27,
      backdropFilter: 'blur(12px) saturate(180%)',
      WebkitBackdropFilter: 'blur(12px) saturate(180%)',
      background: dark ? 'rgba(120,120,128,0.14)' : 'rgba(255,255,255,0.25)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: 27,
      boxShadow: dark ? 'inset 1.5px 1.5px 1px rgba(255,255,255,0.15)' : 'inset 1.5px 1.5px 1px rgba(255,255,255,0.7), inset -1px -1px 1px rgba(255,255,255,0.4)',
      border: dark ? '0.5px solid rgba(255,255,255,0.15)' : '0.5px solid rgba(0,0,0,0.06)',
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 20,
      alignItems: 'center',
      padding: '8px 22px 13px',
      width: '100%',
      boxSizing: 'border-box',
      position: 'relative'
    }
  }, ['"The"', 'the', 'to'].map((w, i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: i
  }, i > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      width: 1,
      height: 25,
      background: '#ccc',
      opacity: 0.3
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      textAlign: 'center',
      fontFamily: '-apple-system, system-ui',
      fontSize: 17,
      color: sugg,
      letterSpacing: -0.43,
      lineHeight: '22px'
    }
  }, w)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 13,
      padding: '0 6.5px',
      width: '100%',
      boxSizing: 'border-box',
      position: 'relative'
    }
  }, row(['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p']), row(['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'], 20), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 14.25,
      alignItems: 'center'
    }
  }, key(icons.shift, {
    w: 45,
    k: 'shift'
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6.5,
      flex: 1
    }
  }, ['z', 'x', 'c', 'v', 'b', 'n', 'm'].map(l => key(l, {
    flex: true,
    k: l
  }))), key(icons.del, {
    w: 45,
    k: 'del'
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      alignItems: 'center'
    }
  }, key('ABC', {
    w: 92.25,
    fs: 18,
    k: 'abc'
  }), key('', {
    flex: true,
    k: 'space'
  }), key(icons.ret, {
    w: 92.25,
    ret: true,
    k: 'ret'
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 56,
      width: '100%',
      position: 'relative'
    }
  }));
}
Object.assign(window, {
  IOSDevice,
  IOSStatusBar,
  IOSNavBar,
  IOSGlassPill,
  IOSList,
  IOSListRow,
  IOSKeyboard
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/ios-frame.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/screens.jsx
try { (() => {
// Orbit UI kit — Today & Items screens
const {
  ScreenHeader,
  SearchBar,
  SegmentedControl,
  EntityRow,
  ProgressBar,
  IconButton,
  StreakBadge,
  Icon,
  Avatar,
  Badge
} = window.OrbitDesignSystem_f3fc09;
function SectionLabel({
  children,
  color
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      margin: '18px 2px 9px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: 'var(--tracking-wider)',
      textTransform: 'uppercase',
      color: color || 'var(--text-subtle)'
    }
  }, children), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      height: 1,
      background: 'var(--border-default)'
    }
  }));
}
function PersonNudgeRow({
  person,
  onOpen
}) {
  const overdue = person.lastContactDays >= person.cadence;
  return /*#__PURE__*/React.createElement("div", {
    onClick: onOpen,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '12px 14px',
      background: 'var(--surface-card)',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border-default)',
      borderLeft: '3px solid var(--person)',
      boxShadow: 'var(--shadow-sm)',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: person.name
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 15.5,
      fontWeight: 600,
      color: 'var(--text-strong)'
    }
  }, person.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: overdue ? 'var(--person)' : 'var(--text-muted)',
      marginTop: 2
    }
  }, overdue ? `Haven't logged contact in ~${person.lastContactDays} days` : `${person.lastContactDays} days since contact`)), /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-right",
    size: 18,
    color: "var(--text-subtle)"
  }));
}
function TodayScreen({
  items,
  onToggle,
  onOpenPerson,
  onOpenHabit,
  query,
  setQuery
}) {
  const done = items.filter(i => i.done).length;
  const overdue = items.filter(i => i.status === 'overdue');
  const rest = items.filter(i => i.status !== 'overdue');
  const people = window.ORBIT_PEOPLE.filter(p => p.lastContactDays >= p.cadence);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 var(--screen-pad) 120px'
    }
  }, /*#__PURE__*/React.createElement(ScreenHeader, {
    eyebrow: "Friday \xB7 Jun 12",
    title: "Today",
    trailing: /*#__PURE__*/React.createElement(IconButton, {
      icon: "sliders-horizontal",
      variant: "soft",
      ariaLabel: "Filters"
    })
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-card)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-sm)',
      padding: 16,
      marginBottom: 4
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      fontWeight: 600,
      color: 'var(--text-body)'
    }
  }, "Today's progress"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 13,
      color: 'var(--text-muted)'
    }
  }, done, " / ", items.length)), /*#__PURE__*/React.createElement(ProgressBar, {
    value: done,
    max: items.length
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16
    }
  }, /*#__PURE__*/React.createElement(SearchBar, {
    value: query,
    onChange: e => setQuery(e.target.value),
    onClear: () => setQuery(''),
    placeholder: "Search people & items"
  })), overdue.length > 0 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SectionLabel, {
    color: "var(--danger)"
  }, "Overdue"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 9
    }
  }, overdue.map(i => /*#__PURE__*/React.createElement(EntityRow, {
    key: i.id,
    type: i.type,
    title: i.title,
    subtitle: i.subtitle,
    checked: i.done,
    onToggle: () => onToggle(i.id)
  })))), /*#__PURE__*/React.createElement(SectionLabel, null, "On your plate"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 9
    }
  }, rest.map(i => /*#__PURE__*/React.createElement(EntityRow, {
    key: i.id,
    type: i.type,
    title: i.title,
    subtitle: i.subtitle,
    checked: i.done,
    onToggle: () => onToggle(i.id),
    onClick: i.type === 'habit' ? () => onOpenHabit(i.id) : undefined,
    trailing: i.type === 'habit' ? /*#__PURE__*/React.createElement(StreakBadge, {
      count: i.streak,
      active: i.streak > 0
    }) : undefined,
    showCheck: i.type !== 'habit'
  }))), /*#__PURE__*/React.createElement(SectionLabel, {
    color: "var(--person)"
  }, "People to reach out to"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 9
    }
  }, people.map(p => /*#__PURE__*/React.createElement(PersonNudgeRow, {
    key: p.id,
    person: p,
    onOpen: () => onOpenPerson(p.id)
  }))));
}
function ItemsScreen({
  items,
  onToggle,
  onOpenPerson,
  onOpenHabit,
  query,
  setQuery,
  filter,
  setFilter
}) {
  const opts = [{
    value: 'all',
    label: 'All'
  }, {
    value: 'person',
    label: 'People'
  }, {
    value: 'task',
    label: 'Tasks'
  }, {
    value: 'habit',
    label: 'Habits'
  }, {
    value: 'project',
    label: 'Projects'
  }];
  const filtered = items.filter(i => (filter === 'all' || i.type === filter) && (!query || i.title.toLowerCase().includes(query.toLowerCase())));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 var(--screen-pad) 120px'
    }
  }, /*#__PURE__*/React.createElement(ScreenHeader, {
    title: "Items",
    subtitle: `${items.length} things in your orbit`
  }), /*#__PURE__*/React.createElement(SearchBar, {
    value: query,
    onChange: e => setQuery(e.target.value),
    onClear: () => setQuery(''),
    placeholder: "Search everything"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12,
      marginBottom: 4
    }
  }, /*#__PURE__*/React.createElement(SegmentedControl, {
    options: opts,
    value: filter,
    onChange: setFilter
  })), /*#__PURE__*/React.createElement(SectionLabel, null, filter === 'all' ? 'All items' : opts.find(o => o.value === filter).label), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 9
    }
  }, filtered.map(i => /*#__PURE__*/React.createElement(EntityRow, {
    key: i.id,
    type: i.type,
    title: i.title,
    subtitle: i.subtitle,
    checked: i.done,
    onToggle: () => onToggle(i.id),
    onClick: i.type === 'person' ? () => onOpenPerson(i.id) : i.type === 'habit' ? () => onOpenHabit(i.id) : undefined,
    trailing: i.type === 'habit' ? /*#__PURE__*/React.createElement(StreakBadge, {
      count: i.streak,
      active: i.streak > 0
    }) : i.type === 'person' || i.type === 'project' ? /*#__PURE__*/React.createElement(Icon, {
      name: "chevron-right",
      size: 18,
      color: "var(--text-subtle)"
    }) : undefined,
    showCheck: i.type === 'task' || i.type === 'routine'
  })), filtered.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      color: 'var(--text-subtle)',
      padding: '40px 0',
      fontSize: 14
    }
  }, "Nothing here yet.")));
}
Object.assign(window, {
  TodayScreen,
  ItemsScreen,
  SectionLabel
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/screens.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.ENTITY_META = __ds_scope.ENTITY_META;

__ds_ns.EntityIcon = __ds_scope.EntityIcon;

__ds_ns.EntityRow = __ds_scope.EntityRow;

__ds_ns.Heatmap = __ds_scope.Heatmap;

__ds_ns.ProgressBar = __ds_scope.ProgressBar;

__ds_ns.StreakBadge = __ds_scope.StreakBadge;

__ds_ns.CheckCircle = __ds_scope.CheckCircle;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.SearchBar = __ds_scope.SearchBar;

__ds_ns.SegmentedControl = __ds_scope.SegmentedControl;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.Fab = __ds_scope.Fab;

__ds_ns.ScreenHeader = __ds_scope.ScreenHeader;

__ds_ns.TabBar = __ds_scope.TabBar;

})();
