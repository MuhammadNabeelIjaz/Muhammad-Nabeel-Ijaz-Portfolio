// Timeline graph data used by the Journey feature's left-to-right branching tree.
// Added 'image' to each branch to show visuals representing that era
export const journeyGraph = {
  center: { id: 'root', label: 'Muhammad Nabeel Ijaz' },
  branches: [
    {
      id: '2004-2010',
      label: '2004 - The Beginning',
      direction: 'down',
      image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', // Childhood
      subs: [
        { id: 'born', label: 'Born in 2004' },
        { id: 'childhood', label: 'Early Childhood' },
        { id: 'primary', label: 'Primary School' },
        { id: 'curiosity', label: 'Endless Curiosity' },
      ],
    },
    {
      id: '2011-2016',
      label: '2011 - Growing Up',
      direction: 'up',
      image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', // Gaming / Keyboard
      subs: [
        { id: 'middle-school', label: 'Middle School' },
        { id: 'hobbies', label: 'Discovering Hobbies' },
        { id: 'first-pc', label: 'First Computer' },
        { id: 'gaming', label: 'Video Games Era' },
      ],
    },
    {
      id: '2017-2020',
      label: '2017 - Tech Awakening',
      direction: 'down',
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', // Coding / Tech
      subs: [
        { id: 'high-school', label: 'High School' },
        { id: 'coding', label: 'Learning to Code' },
        { id: 'hello-world', label: 'First "Hello World"' },
        { id: 'passion', label: 'Tech Passion Ignited' },
      ],
    },
    {
      id: '2021-2023',
      label: '2021 - Deep Dive',
      direction: 'up',
      image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', // Desk / Web Dev
      subs: [
        { id: 'university', label: 'University Life' },
        { id: 'web-dev', label: 'Web Development' },
        { id: 'freelance', label: 'First Freelance Client' },
        { id: 'late-nights', label: 'Late Night Coding' },
      ],
    },
    {
      id: '2024-2025',
      label: '2024 - Professional Path',
      direction: 'down',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', // Dev Team / Professional
      subs: [
        { id: 'software-eng', label: 'Software Engineering' },
        { id: 'react', label: 'React & Modern Tech' },
        { id: 'portfolio', label: 'Building Portfolio' },
        { id: 'networking', label: 'Industry Networking' },
      ],
    },
    {
      id: '2026',
      label: '2026 - The Present',
      direction: 'up',
      image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', // AI / Future
      subs: [
        { id: 'present', label: 'Full-Stack Developer' },
        { id: 'ai', label: 'AI & Innovations' },
        { id: 'goals', label: 'Future Goals' },
      ],
    },
    {
      id: 'ongoing',
      label: 'Still Learning...',
      direction: 'down',
      image: 'https://images.unsplash.com/photo-1456406644174-8ddd4cd52a06?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', // Books / continuous learning
      subs: [
        { id: 'forever-student', label: 'Forever a Student' },
        { id: 'curiosity-driven', label: 'Curiosity Driven' },
        { id: 'next-big-thing', label: 'Seeking the Next Big Thing' },
      ],
    },
  ],
};
