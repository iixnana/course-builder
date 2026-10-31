import { Button } from '../../components/Button/Button'
import { Card } from '../../components/Card/Card'
import './CourseBuilder.css'

const demoSteps = [
  { id: 'welcome', type: 'Text', title: 'Welcome to the Inventing Room' },
  { id: 'river', type: 'Image', title: 'The chocolate river' },
  { id: 'safety', type: 'Multiple choice', title: 'Who may taste the river?' },
]

export const CourseBuilderPage = () => {
  return (
    <article className="course-builder" aria-labelledby="course-builder-title">
      <Card as="header">
        <h2 id="course-builder-title">Course Builder</h2>
        <p>Build a training course one step at a time.</p>
      </Card>

      <ol className="step-list" role="list" aria-label="Course steps">
        {demoSteps.map((step) => (
          <Card as="li" key={step.id}>
            <p className="step-type">{step.type}</p>
            <h3>{step.title}</h3>
          </Card>
        ))}
      </ol>

      <Button>Add step</Button>
    </article>
  )
}
