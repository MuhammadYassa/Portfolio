// Content supplied by Muhammad in November 2026. Resume: public/resume.pdf.
export const profile = {
  contentYear: 2026,
  name: "Muhammad Yassa",
  email: "muhammad.yassa.dev@gmail.com",
  github: "https://github.com/MuhammadYassa",
  linkedin: "https://www.linkedin.com/in/muhammadyassa/",
  location: "New York City",
  role: "Software Engineer & Computer Science Student",
  introduction:
    "I'm a computer science student at Queens College, graduating in May 2027. I build full-stack applications, backend systems, and data pipelines, with a particular interest in how software works behind the scenes.",
  resume: "/resume.pdf",
  about: [
    "I'm finishing my computer science degree at Queens College in May 2027. Most of my projects focus on backend and full-stack development. I like understanding how the APIs, databases, and background jobs fit together, and which decisions make an application reliable.",
    "Recently, I've been working on WatchMate and an NYC housing data platform. They've given me a lot to learn about caching, background processing, and keeping data correct as a project grows.",
    "Outside of programming, I enjoy anime, especially One Piece.",
  ],
  education: {
    school: "Queens College, City University of New York",
    degree: "Bachelor of Arts in Computer Science",
    graduation: "May 2027",
    gpa: "3.87/4.00",
    honors: "Provost Scholar · 3 awards / Dean’s List · 7 semesters",
  },
};

export const projects = [
  {
    id: "watchmate",
    number: "01",
    name: "WatchMate",
    status: "Live",
    description:
      "A full-stack movie and TV tracking application I independently designed, built, and deployed with Spring Boot, React, MySQL, and Redis.",
    github: "https://github.com/MuhammadYassa/WatchMate",
    live: "https://mywatchmate.us",
    technologies: [
      "Java 21",
      "Spring Boot",
      "Spring Security",
      "MySQL",
      "Redis",
      "React 19",
      "TypeScript",
      "Docker",
      "GitHub Actions",
    ],
    metrics: [
      ["100", "users in two months"],
      ["4,298", "episodes tracked"],
    ],
    benchmark: { uncachedMs: 420, cachedMs: 28 },
    highlights: [
      "Hashed, atomically rotated refresh tokens, JWT authentication, and Bucket4j rate limiting.",
      "Large multi-season imports run in the background, with HTTP 202 responses and polling to keep the interface responsive.",
      "About 90% line coverage with JUnit and Testcontainers; testing and OCI deployment automated with GitHub Actions and Docker Compose.",
    ],
    note: "In a 10,000-request benchmark: 80% cache hits and 75% fewer TMDB requests.",
  },
  {
    id: "housing",
    number: "02",
    name: "NYC Housing Intelligence Platform",
    github:
      "https://github.com/MuhammadYassa/NYC-Housing-Intelligence-Platform",
    status: "In development",
    description:
      "An automated data ingestion platform for collecting, validating, and processing public NYC housing data. The MapPLUTO pipeline is implemented; the broader platform is still in development.",
    technologies: [
      "Python",
      "PostgreSQL",
      "PostGIS",
      "GDAL",
      "SQLAlchemy",
      "Alembic",
      "Docker",
    ],
    metrics: [
      ["856,614", "tax-lot records imported"],
      ["230", "passing tests, including 85 integration"],
      ["0", "duplicates on repeat imports"],
    ],
    highlights: [
      "Discovers releases and downloads official ZIPs autonomously, verifying integrity, schemas, and geometries before ingestion.",
      "Transactional staging-to-silver merges are idempotent: repeat runs create no duplicates or unnecessary updates.",
      "Advisory locks, retries, rollback, and recovery protect failed or overlapping imports.",
    ],
  },
  {
    id: "renter",
    number: "03",
    name: "Renter Dispute Assistant",
    github: "https://github.com/MuhammadYassa/CSCI370S26_Final_Project",
    status: "Academic team project · 3 engineers",
    description:
      "A team-built web application for organizing rental disputes, managing evidence from both parties, and preparing official New York filing forms for review.",
    technologies: ["Node.js", "Express", "MySQL", "React", "Gemini API"],
    highlights: [
      "Contributed authenticated case workflows, case-level access controls, evidence-image uploads, and landlord responses.",
      "Built filing-path selection and prefilled official New York PDF forms for review and download.",
      "Integrated structured, nonbinding Gemini assessments with timeouts, image limits, and evidence from both parties.",
    ],
  },
];

export const experience = {
  role: "Software Engineering Intern",
  company: "DNR Events LLC",
  dates: "March 2025 – May 2025",
  context:
    "Worked in a four-engineer Agile team on DNRcast, a podcast and live-audio application with approximately 900 daily active users across iOS and Android.",
  highlights: [
    "Developed a daily Sudoku feature in C#/.NET MAUI with XAML and MVVM, including notes, conflict detection, undo/redo, and completion validation.",
    "Built an authenticated ASP.NET Core puzzle API, using Quartz.NET scheduling and randomized backtracking to generate daily boards.",
    "Added 24-hour IMemoryCache caching and SemaphoreSlim synchronization to prevent duplicate loads. Cached puzzle retrieval fell from 34 ms to 0.2 ms in benchmarks.",
  ],
};

export const skills = {
  Languages: ["Python", "Java", "SQL", "JavaScript", "TypeScript", "C#"],
  Backend: [
    "Spring Boot",
    "Spring Security",
    "ASP.NET Core",
    "Node.js",
    "Express",
  ],
  Frontend: ["React", "Tailwind CSS", "TypeScript"],
  "Databases & data": ["PostgreSQL", "PostGIS", "MySQL", "Redis", "SQLAlchemy"],
  "AI integration": ["Gemini API"],
  "Testing & tools": [
    "pytest",
    "JUnit",
    "Testcontainers",
    "GitHub Actions",
    "Docker",
    "Git",
    "Linux",
    "OCI",
  ],
};
