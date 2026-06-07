The signature Orbit list row — entity icon + accent border, title, subtitle, trailing check. Use it for every reminder/item list.

```jsx
<EntityRow type="task" title="Buy birthday gift" subtitle="Due today · linked to Sam"
  checked={done} onToggle={setDone} />

<EntityRow type="habit" title="Morning stretch" subtitle="Daily · 7:00 AM"
  trailing={<StreakBadge count={17} />} />
```

Provide `trailing` to replace the check (e.g. a StreakBadge or chevron). Pass `onClick` to open detail.
