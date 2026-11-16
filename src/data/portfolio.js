// Content supplied by Muhammad in November 2026. No resume PDF was supplied.
export const profile = {
  contentYear: 2026,
  name: "Muhammad Yassa",
  email: "muhammad.yassa.dev@gmail.com",
  github: "https://github.com/MuhammadYassa",
  linkedin: "https://www.linkedin.com/in/muhammadyassa/",
  location: "New York City",
  resume: "/resume.pdf",
  about: [
    "I like knowing what happens after you click the button. The API call, the database query, the background job that quietly keeps things moving — that’s usually where my curiosity takes me.",
    "I’m a computer science student at Queens College, building across backend systems, full-stack applications, and data engineering. I enjoy getting a first version working, then figuring out what makes it dependable. Lately, that’s meant thinking more about data correctness and where applied AI can actually be useful.",
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
    subtitle: "A home for your next watch.",
    status: "Live",
    description:
      "A movie and TV tracking platform I independently designed, built, and deployed — from the Spring Boot API to the React interface.",
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
      ["420 → 28 ms", "movie-detail latency with Redis"],
    ],
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
    name: "NYC Housing Intelligence",
    github:
      "https://github.com/MuhammadYassa/NYC-Housing-Intelligence-Platform",
    subtitle: "Good answers start with reliable data.",
    status: "In development",
    description:
      "An autonomous pipeline for publicly available NYC housing data. The first working foundation: discovering, validating, and importing MapPLUTO releases into PostGIS.",
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
    note: "Still ahead: additional datasets, address resolution, and grounded AI functionality. These are planned, not completed features.",
  },
  {
    id: "renter",
    number: "03",
    name: "Renter Dispute Assistant",
    github: "https://github.com/MuhammadYassa/CSCI370S26_Final_Project",
    subtitle: "Making the next step clearer.",
    status: "Academic team project · 3 engineers",
    description:
      "A team-built case-management application for rental disputes, with evidence from both parties and official New York forms prepared for review.",
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
