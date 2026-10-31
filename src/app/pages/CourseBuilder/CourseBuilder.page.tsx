const demoSteps = [
  { id: 'welcome', type: 'Text', title: 'Welcome to the Inventing Room' },
  { id: 'river', type: 'Image', title: 'The chocolate river' },
  { id: 'safety', type: 'Multiple choice', title: 'Who may taste the river?' },
]

export const CourseBuilderPage = () => {
  return (
    <section aria-labelledby="course-builder-title">
      <header>
        <h2 id="course-builder-title">Course Builder</h2>
        <p>Build a training course one step at a time.</p>
      </header>

      <ol>
        {demoSteps.map((step) => (
          <li key={step.id}>
            <strong>{step.type}</strong> — {step.title}
          </li>
        ))}
      </ol>

      <button type="button">Add step</button>
    </section>
  )
}
