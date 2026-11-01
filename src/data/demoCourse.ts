import chocolateRiver from '../assets/images/chocolate-river.jpg'
import type { Course } from '../model/course'

export const demoCourse: Course = {
  id: 'chocolate-river-safety',
  title: 'Chocolate River Safety',
  steps: [
    {
      id: 'river-intro',
      type: 'text',
      title: 'River rules',
      body: [
        '<h4>On the riverbank</h4>',
        '<ul>',
        '<li><p><strong>Never</strong> drink straight from the river.</p></li>',
        '<li><p>Keep both feet behind the striped railing.</p></li>',
        '<li><p>Report spills to the nearest Oompa-Loompa.</p></li>',
        '<li><p>Do not lick the walls, the railings or each other.</p></li>',
        '</ul>',
        '<h4>If someone falls in</h4>',
        '<ol>',
        '<li><p><strong>Pull the pipe alarm.</strong></p></li>',
        '<li><p>Throw the marshmallow ring.</p></li>',
        '<li><p>Wait for the glass elevator crew.</p></li>',
        '<li><p>Do not follow them up the pipe, however good the fudge smells.</p></li>',
        '</ol>',
        '<p><em>By entering the Chocolate Room you accept all risks, including but not limited to sudden inflation, shrinking, turning blue and spontaneous singing.</em></p>',
      ].join(''),
    },
    {
      id: 'river-picture',
      type: 'image',
      title: 'The chocolate river',
      url: chocolateRiver,
      alt: 'Chocolate waterfall pouring into a river among lollipops and gumdrops',
    },
    {
      id: 'river-question',
      type: 'multipleChoice',
      question: 'What do you do if someone falls in?',
      options: [
        { id: 'jump', text: 'Jump in after them' },
        { id: 'alarm', text: 'Pull the pipe alarm' },
      ],
      correctOptionIds: ['alarm'],
    },
    {
      id: 'river-bubbles',
      type: 'text',
      title: '',
      body: '<p>If the river starts to <strong>bubble</strong> or turns <em>green</em>, step back from the bank and call your shift lead straight away.</p><p>Fizzy lifting drink spills are extra slippery, so walk, never run.</p>',
    },
    {
      id: 'river-gear',
      type: 'multipleChoice',
      question: 'What must you wear by the chocolate river?',
      options: [
        { id: 'swimsuit', text: 'A swimsuit' },
        { id: 'hairnet', text: 'A hairnet' },
        { id: 'skates', text: 'Roller skates' },
        { id: 'boots', text: 'Non-slip boots' },
        { id: 'top-hat', text: 'A top hat' },
      ],
      correctOptionIds: ['hairnet', 'boots'],
    },
    {
      id: 'river-boat',
      type: 'multipleChoice',
      question:
        'The pink candy boat is drifting towards the dark tunnel and Mr Wonka has started singing. What should you do before it goes in?',
      options: [
        { id: 'stand-up', text: 'Stand up for a better view' },
        { id: 'trail-hand', text: 'Trail a hand in the river for a taste' },
        { id: 'hold-on', text: 'Stay seated and hold on to the rail' },
        { id: 'jump-off', text: 'Jump off and swim back to shore' },
      ],
      correctOptionIds: ['hold-on'],
    },
  ],
  trash: [],
}
