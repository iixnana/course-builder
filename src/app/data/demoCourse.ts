import type { Course } from '../model/course'

export const demoCourse: Course = {
  id: 'demo-course',
  title: 'Course Builder',
  description: 'Build a training course one step at a time.',
  steps: [
    {
      id: 'welcome',
      type: 'text',
      body: 'Welcome to the Inventing Room',
    },
    {
      id: 'river',
      type: 'image',
      url: '',
      alt: 'The chocolate river',
    },
    {
      id: 'safety',
      type: 'multipleChoice',
      question: 'Who may taste the river?',
      options: [
        { id: 'everyone', text: 'Everyone' },
        { id: 'nobody', text: 'Nobody' },
      ],
      correctOptionId: 'nobody',
    },
  ],
}
