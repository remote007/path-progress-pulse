
export const roadmaps = [
  {
    id: '1',
    title: 'Frontend Developer',
    description: 'Learn to build modern web interfaces with HTML, CSS, and JavaScript',
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c',
    steps: [
      {
        id: '101',
        title: 'Week 1 - HTML Basics',
        description: 'Learn the fundamentals of HTML',
        resources: [
          {
            id: '1001',
            title: 'Introduction to HTML',
            type: 'video',
            url: 'https://www.youtube.com/watch?v=UB1O30fR-EE',
            description: 'Learn the basics of HTML in this comprehensive guide for beginners.'
          },
          {
            id: '1002',
            title: 'HTML Elements Reference',
            type: 'blog',
            url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element',
            description: 'Complete reference for HTML elements and their usage.'
          }
        ]
      },
      {
        id: '102',
        title: 'Week 2 - CSS Fundamentals',
        description: 'Style your websites with CSS',
        resources: [
          {
            id: '1003',
            title: 'CSS Crash Course',
            type: 'video',
            url: 'https://www.youtube.com/watch?v=yfoY53QXEnI',
            description: 'Quick introduction to CSS styling for beginners.'
          },
          {
            id: '1004',
            title: 'CSS Selectors',
            type: 'blog',
            url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors',
            description: 'Learn how to select HTML elements for styling.'
          }
        ]
      }
    ]
  },
  {
    id: '2',
    title: 'Backend Developer',
    description: 'Master server-side programming, databases, and API development',
    imageUrl: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb',
    steps: [
      {
        id: '201',
        title: 'Week 1 - Introduction to Backend',
        description: 'Understand server-side concepts',
        resources: [
          {
            id: '2001',
            title: 'What is Backend Development?',
            type: 'video',
            url: 'https://www.youtube.com/watch?v=XBu54nfzxAQ',
            description: 'Overview of backend development concepts and responsibilities.'
          },
          {
            id: '2002',
            title: 'Backend vs Frontend',
            type: 'blog',
            url: 'https://www.geeksforgeeks.org/frontend-vs-backend/',
            description: 'Understanding the differences between frontend and backend development.'
          }
        ]
      },
      {
        id: '202',
        title: 'Week 2 - Node.js Basics',
        description: 'Learn server-side JavaScript with Node.js',
        resources: [
          {
            id: '2003',
            title: 'Node.js Crash Course',
            type: 'video',
            url: 'https://www.youtube.com/watch?v=fBNz5xF-Kx4',
            description: 'Introduction to Node.js for beginners.'
          },
          {
            id: '2004',
            title: 'Express.js Guide',
            type: 'blog',
            url: 'https://expressjs.com/en/guide/routing.html',
            description: 'Learn how to use Express.js for building web applications.'
          }
        ]
      }
    ]
  }
];

export const users = [
  {
    id: 'admin1',
    name: 'Admin User',
    email: 'admin@pathpulse.com',
    password: 'admin123', // In a real app, passwords would be hashed
    role: 'admin'
  },
  {
    id: 'user1',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123', // In a real app, passwords would be hashed
    role: 'learner',
    interests: ['Web Development', 'Frontend'],
    weeklyTime: 10,
    progress: {
      '1': { // roadmapId
        completedSteps: ['101'],
        inProgressSteps: ['102']
      }
    },
    xp: 250,
    badges: ['html_master']
  }
];
