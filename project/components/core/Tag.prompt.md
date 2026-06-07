Pill with a leading dot — labels an entity or a free-form attribute.

```jsx
<Tag type="person">Sam Rivera</Tag>
<Tag type="habit" />            {/* auto-labels "Habit" */}
<Tag color="var(--info)">Linked</Tag>
```

Pass `type` to auto-color + auto-label by entity; or `color` + children for custom.
