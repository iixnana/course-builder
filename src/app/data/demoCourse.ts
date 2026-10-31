import type { Course } from '../model/course'

export const demoCourse: Course = {
  id: 'chocolate-river-safety',
  title: 'Chocolate River Safety',
  steps: [
    {
      id: 'river-intro',
      type: 'text',
      body: 'Never drink straight from the chocolate river.',
    },
    {
      id: 'river-question',
      type: 'multipleChoice',
      question: 'What do you do if someone falls in?',
      options: [
        { id: 'alarm', text: 'Pull the pipe alarm' },
        { id: 'jump', text: 'Jump in after them' },
      ],
      correctOptionId: 'alarm',
    },
  ],
}
