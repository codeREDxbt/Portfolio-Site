export type Project = {
  id: string;
  number: string;
  title: string;
  description: string;
  role: string;
  year: string;
  stack: string[];
  image?: string;
  liveUrl?: string;
  repoUrl?: string;
  featured: boolean;
  caseFile?: {
    challenge: string;
    decision: string;
    outcome: string;
  };
};

export const profile = {
  name: "Vinayak Vashisth",
  handle: "codeRED",
  role: "Full-stack Engineer",
  title: "Full-stack Engineer — Web3 · SaaS · Product",
  location: "India / Remote",
  email: "codeREDx07@proton.me",
  availability: "Available for select work",
  command: "npx coderedxbt",
  resumeUrl: "/documents/resume.pdf",
  siteUrl: "https://coderedxbt.dev",
};

export const socials = [
  { label: "X", href: "https://x.com/codeREDxbt" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/vinayak-vashisth-6b8204331" },
  { label: "GitHub", href: "https://github.com/codeREDxbt" },
];

export const projects: Project[] = [
  {
    id: "veilpay",
    number: "01",
    title: "Veilpay",
    description:
      "A multi-chain wallet with protocol-specific address isolation and integrated fiat on/off-ramp flows.",
    role: "Design + Development",
    year: "2026",
    stack: ["React", "TypeScript", "Tailwind CSS", "Web3"],
    image: "/images/projects/cover-veilpay.png",
    liveUrl: "https://www.veilpayapp.com",
    repoUrl: "https://github.com/codeREDxbt/Veilpay",
    featured: true,
    caseFile: {
      challenge: "Multiple chains, one wallet — without leaking addresses across protocols.",
      decision: "Protocol-specific address isolation with fiat on/off-ramps built in.",
      outcome: "Live in production.",
    },
  },
  {
    id: "paytrack",
    number: "02",
    title: "PayTrack",
    description:
      "Employee attendance, overtime, and payroll management shaped into a clear operational dashboard.",
    role: "Design + Development",
    year: "2025",
    stack: ["React", "Vite", "Firebase", "Tailwind CSS"],
    image: "/images/projects/cover-paytrack.png",
    liveUrl: "https://paytrackx.vercel.app",
    repoUrl: "https://github.com/codeREDxbt/PayTrack",
    featured: true,
    caseFile: {
      challenge: "Attendance, overtime, and payroll data trapped in spreadsheets.",
      decision: "One operational dashboard with clear state and fast reads.",
      outcome: "Live in production.",
    },
  },
  {
    id: "stellarpulse",
    number: "03",
    title: "StellarPulse",
    description:
      "A real-time Stellar network explorer with analytics, search, and data-rich visualizations.",
    role: "Development",
    year: "2025",
    stack: ["React", "TypeScript", "Node.js", "Stellar"],
    image: "/images/projects/cover-stellarpulse.png",
    liveUrl: "https://stellarpulse-xi.vercel.app/",
    repoUrl: "https://github.com/codeREDxbt/StellarPulse",
    featured: true,
    caseFile: {
      challenge: "Stellar network data is raw, fast, and unreadable.",
      decision: "Real-time explorer with analytics, search, and dense visualizations.",
      outcome: "Live in production.",
    },
  },
  {
    id: "blockademia",
    number: "04",
    title: "Blockademia",
    description:
      "A decentralized learning platform for Web3 education, progress, and verifiable certification.",
    role: "Design + Development",
    year: "2025",
    stack: ["Solidity", "React", "Node.js", "Web3.js"],
    image: "/images/projects/cover-blockademia.png",
    liveUrl: "https://blockademia.live",
    repoUrl: "https://github.com/codeREDxbt/blockademia-platform",
    featured: true,
    caseFile: {
      challenge: "Web3 education with no verifiable proof of progress.",
      decision: "On-chain certification with progress tracked end to end.",
      outcome: "Live in production.",
    },
  },
  {
    id: "medichainai",
    number: "05",
    title: "MediChainAI",
    description: "AI-assisted decentralized medical records and diagnostics.",
    role: "Development",
    year: "2025",
    stack: ["Next.js", "TypeScript", "PostgreSQL", "AI"],
    image: "/images/projects/preview-medichain.png",
    repoUrl: "https://github.com/codeREDxbt/MediChainAI",
    featured: false,
  },
  {
    id: "aptos-lms",
    number: "06",
    title: "Aptos LMS",
    description: "No-code course creation with Move smart contracts on Aptos.",
    role: "Development",
    year: "2025",
    stack: ["Move", "Aptos", "React", "TypeScript"],
    image: "/images/projects/preview-aptos.png",
    repoUrl: "https://github.com/codeREDxbt/NoCodeLMSbuilder-withAptosPayments",
    featured: false,
  },
];

export const stackGroups = [
  {
    title: "Product engineering",
    items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Motion"],
  },
  {
    title: "Web3",
    items: ["Solidity", "Move", "Web3.js", "Ethereum", "Aptos", "Stellar"],
  },
  {
    title: "Backend & data",
    items: ["Node.js", "Express", "PostgreSQL", "Firebase", "API design"],
  },
  {
    title: "Workflow",
    items: ["Git", "FigCraft", "Vercel", "Security", "Performance"],
  },
];

export const narrative = [
  {
    number: "01",
    title: "Intro",
    body: "Full-stack engineer with a design eye, focused on products that feel usable from day one — Web3, SaaS, and everything between.",
  },
  {
    number: "02",
    title: "Approach",
    body: "Clarity, security, performance, and interface polish are treated as one system — not separate phases.",
  },
  {
    number: "03",
    title: "Now",
    body: "Currently building Veilpay and exploring practical multi-chain payment experiences.",
  },
];
