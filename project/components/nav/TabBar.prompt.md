Bottom navigation bar (Today / Items / Settings).

```jsx
<TabBar active={tab} onChange={setTab} tabs={[
  {key:'today', label:'Today', icon:'sun'},
  {key:'items', label:'Items', icon:'layers'},
  {key:'settings', label:'Settings', icon:'settings'},
]} />
```

Icons are Lucide names. Pair with a `Fab` for create.
