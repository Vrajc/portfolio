export interface Project {
  slug: string
  num: string
  name: string
  tags: string
  year: string
  category: string
  duration: string
  subtitle: string
  description: string[]
  tech: string[]
  features: string[]
  links?: { label: string; href: string }[]
  image: string
  bgKeywords: string
}

export const PROJECTS: Project[] = [
  {
    slug: 'ecoclassify',
    num: '01',
    name: 'ECOCLASSIFY',
    tags: 'AI/ML · MERN STACK',
    year: '2025',
    category: 'AI / WEB APP',
    duration: '3 MONTHS',
    subtitle: 'AI-powered waste classification system',
    description: [
      'EcoClassify is an intelligent waste management platform that uses deep learning to classify waste materials in real-time through image recognition.',
      'Built with a MERN stack backend and a TensorFlow-powered ML pipeline, the system achieves high accuracy in identifying recyclable, organic, and hazardous waste categories.',
    ],
    tech: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'TensorFlow', 'Python', 'Tailwind CSS'],
    features: [
      'Real-time waste classification via camera/upload',
      'Deep learning model trained on 25K+ images',
      'Interactive dashboard with analytics',
      'RESTful API for third-party integration',
      'Responsive design with dark/light themes',
    ],
    links: [
      { label: 'GITHUB', href: 'https://github.com/vrajchauhan' },
    ],
    image: '/generated-1773827505168.png',
    bgKeywords: 'ai neural network abstract dark technology',
  },
  {
    slug: 'hymnonics',
    num: '02',
    name: 'HYMNONICS',
    tags: 'MUSIC STREAMING',
    year: '2024–25',
    category: 'FULL STACK',
    duration: '4 MONTHS',
    subtitle: 'Next-gen music streaming experience',
    description: [
      'Hymnonics is a full-featured music streaming platform designed for audiophiles who demand a premium listening experience.',
      'The platform features real-time audio visualization, curated playlists, and a sleek interface inspired by modern design principles.',
    ],
    tech: ['React.js', 'Node.js', 'MongoDB', 'Firebase', 'Web Audio API', 'Tailwind CSS'],
    features: [
      'Real-time audio waveform visualization',
      'Personalized playlist recommendations',
      'Social sharing and collaborative playlists',
      'Offline listening with service workers',
      'Cross-device sync via Firebase',
    ],
    links: [
      { label: 'GITHUB', href: 'https://github.com/vrajchauhan' },
    ],
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1920&q=80',
    bgKeywords: 'music sound waves dark neon audio',
  },
  {
    slug: 'joblink',
    num: '03',
    name: 'JOBLINK',
    tags: 'JOB PORTAL · MERN',
    year: '2024',
    category: 'WEB PLATFORM',
    duration: '2 MONTHS',
    subtitle: 'Connecting talent with opportunity',
    description: [
      'JobLink is a modern job portal that streamlines the hiring process for both recruiters and candidates.',
      'With intelligent matching algorithms and a clean interface, the platform makes job discovery and application management effortless.',
    ],
    tech: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'JWT', 'Tailwind CSS'],
    features: [
      'Smart job matching based on skills and preferences',
      'Real-time application status tracking',
      'Recruiter dashboard with analytics',
      'Resume parser and profile builder',
      'Secure authentication with JWT tokens',
    ],
    links: [
      { label: 'GITHUB', href: 'https://github.com/vrajchauhan' },
    ],
    image: '/joblink.png',
    bgKeywords: 'corporate office dark minimal business',
  },
  {
    slug: 'farmcare',
    num: '04',
    name: 'FARMCARE',
    tags: 'AI · ANDROID',
    year: '2024',
    category: 'MOBILE / AI',
    duration: '3 MONTHS',
    subtitle: 'AI-driven crop disease detection',
    description: [
      'FarmCare is an Android application that leverages AI to detect crop diseases from leaf images, helping farmers take preventive action early.',
      'The app provides instant diagnosis, treatment recommendations, and connects farmers with agricultural experts.',
    ],
    tech: ['Python', 'TensorFlow', 'Android', 'Firebase', 'Google Cloud'],
    features: [
      'Leaf disease detection with 95%+ accuracy',
      'Offline model inference on-device',
      'Treatment recommendations database',
      'Expert consultation booking system',
      'Multi-language support for rural users',
    ],
    links: [
      { label: 'GITHUB', href: 'https://github.com/vrajchauhan' },
    ],
    image: '/farm.png',
    bgKeywords: 'agriculture nature dark green technology',
  },
  {
    slug: 'voice-assistant',
    num: '05',
    name: 'VOICE ASSISTANT',
    tags: 'PYTHON · NLP',
    year: '2023',
    category: 'AI / NLP',
    duration: '2 MONTHS',
    subtitle: 'Intelligent voice-controlled assistant',
    description: [
      'A Python-based voice assistant that uses natural language processing to understand and execute user commands.',
      'From web searches to system automation, the assistant handles a wide range of tasks through conversational interaction.',
    ],
    tech: ['Python', 'NLP', 'Speech Recognition', 'PyTorch', 'APIs'],
    features: [
      'Natural language understanding with NLP',
      'Voice-to-text and text-to-speech conversion',
      'Web search and information retrieval',
      'System automation and file management',
      'Customizable command extensions',
    ],
    links: [
      { label: 'GITHUB', href: 'https://github.com/vrajchauhan' },
    ],
    image: '/soundwaves.png',
    bgKeywords: 'ai voice assistant dark futuristic',
  },
]
