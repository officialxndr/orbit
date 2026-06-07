iOS-style segmented filter — type filters and small either/or choices.

```jsx
<SegmentedControl value={f} onChange={setF}
  options={[{value:'all',label:'All'},{value:'person',label:'People'},{value:'task',label:'Tasks'}]} />
```

Options may be plain strings or `{ value, label }`.
