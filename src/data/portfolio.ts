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
  award?: string;
  caseFile?: {
    challenge: string;
    decision: string;
    outcome: string;
  };
  caseStudy?: {
    lede: string;
    challenge: string[];
    decision: string[];
    outcome: string[];
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
    award: "Special mention — Stellar Build Station",
    caseFile: {
      challenge: "Multiple chains, one wallet — without leaking addresses across protocols.",
      decision: "Protocol-specific address isolation with fiat on/off-ramps built in.",
      outcome: "Live in production.",
    },
    caseStudy: {
      lede: "Veilpay is a multi-chain payments wallet built on one premise: privacy is the default, not a mode. Transparent chains — Ethereum, Solana, Base — sit next to privacy rails like Stellar, Monero, Zcash, and Midnight behind a single interface, shipped as an Expo mobile app backed by a merchant-ready API.",
      challenge: [
        "Public ledgers make every payment a broadcast: sender, receiver, and amount are visible to anyone who looks, and reusing one address across protocols lets observers stitch a person's whole financial graph together.",
        "The hard part is spanning chains that agree on nothing — different signature schemes, different privacy primitives, different finality — while keeping signing keys on the device and the experience consumer-grade.",
      ],
      decision: [
        "Protocol-specific address isolation: every chain gets its own lane, and EIP-5564 dual-key stealth addresses issue one-time destinations per payment, so transactions can't be linked back to a single identity. Zero-knowledge circuits (Circom/snarkjs, with pinned and hash-verified prover assets) prove a payment is valid without revealing its contents.",
        "Private XLM shielding runs natively on Stellar mainnet, and all signing material stays on-device in secure storage. Around the wallet sits a merchant stack — Express, Prisma, PostgreSQL, Redis queues — serving invoices, HMAC-signed webhooks, and an RPC proxy, with a background indexer reconciling on-chain state.",
      ],
      outcome: [
        "Live at veilpayapp.com — stealth payments across 7+ chains, with private XLM generally available on Stellar mainnet and Monero, Zcash, and Midnight staged as experimental integrations.",
        "Picked up a special mention at Stellar Build Station. The public monorepo carries the full stack — mobile app, merchant API, indexer, circuits — and states the external audit as pending rather than claimed. Private by default; honest by design.",
      ],
    },
  },
  {
    id: "freelancepay",
    number: "02",
    title: "FreelancePay",
    description:
      "Trustless milestone escrow on Stellar — ship code, get paid, no trust required.",
    role: "Design + Development",
    year: "2025",
    stack: ["Next.js", "React", "Tailwind CSS", "Soroban", "Stellar"],
    image: "/images/projects/cover-freelancepay.png",
    liveUrl: "https://freelancepayxbt.vercel.app",
    repoUrl: "https://github.com/codeREDxbt",
    featured: true,
    award: "$250 USD — Stellar Journey to Mastery",
    caseFile: {
      challenge: "Freelance payments run on trust — or platforms with heavy fees.",
      decision: "Milestone escrows as deterministic Soroban contracts on Stellar.",
      outcome: "Won $250 USD in Stellar's Journey to Mastery.",
    },
    caseStudy: {
      lede: "FreelancePay is trustless milestone escrow for freelance work: the client locks USDC into a Soroban contract on Stellar, the freelancer ships, and the contract pays out. No platform in the middle, no cut taken.",
      challenge: [
        "Freelance payment runs on trust. The client can ghost after delivery; the freelancer can vanish after the deposit. Platforms solve it by sitting in the middle — and charging heavily for the privilege.",
        "The goal was escrow as infrastructure: deterministic, non-custodial, and cheap enough that a small milestone makes as much sense as a large one.",
      ],
      decision: [
        "Milestones as deterministic Soroban contracts on Stellar. The protocol reads like the work itself — connect a wallet (require_auth), fund the escrow in USDC (escrow.deposit), ship the work with a merged pull request as the signal, and the contract releases funds to the freelancer (escrow.transfer).",
        "Zero platform fees by construction: the contract holds the money, so there is no house to skim — you pay gas, nothing else. The front end is Next.js, React 19, and Tailwind 4, with escrow state and receipts rendered as first-class interface.",
      ],
      outcome: [
        "Live at freelancepayxbt.vercel.app — open source and non-custodial end to end.",
        "Won $250 USD in Stellar's Journey to Mastery.",
      ],
    },
  },
  {
    id: "avisky",
    number: "03",
    title: "Avisky",
    description:
      "AviQ — an AI-powered aviation learning platform with mock-test series and analytics.",
    role: "Design + Development",
    year: "2026",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "AI"],
    image: "/images/projects/cover-avisky.png",
    liveUrl: "https://avisky.in",
    featured: true,
    award: "Client project",
    caseFile: {
      challenge: "An aviation academy needed a premium digital training portal.",
      decision: "Cinematic platform — test series, telemetry analytics, AI assistant.",
      outcome: "Client project, live in production.",
    },
    caseStudy: {
      lede: "AviQ is an AI-powered aviation training portal for aspiring pilots — a cinematic learning platform built around DGCA exam preparation, with mock test series, performance analytics, and an always-on AI assistant.",
      challenge: [
        "An aviation academy needed a digital training portal that felt as premium as the career it feeds — not a PDF dump, but a place cadets actually train in.",
        "Exam prep is a grind across subjects — Radio Aids, Aircraft Instrumentation, Aviation Meteorology, Air Regulations — and students had no signal on where they stood until the real exam.",
      ],
      decision: [
        "A full test-series engine: full-length professional mock exams per subject — Air Regulations alone carries 20 full-length tests and 1,000 practice MCQs — with books, cart, and enrolment built into the same flow.",
        "Analytics as the differentiator: predictive analytics surface performance gaps, and dynamic progression evolves the curriculum in real time. The AviQ AI assistant handles the operational questions — enrolment, payments, DGCA exam dates — around the clock.",
      ],
      outcome: [
        "Client project, live in production at avisky.in — designed and developed end to end: interface, test engine, and AI assistant.",
      ],
    },
  },
  {
    id: "vaultpass",
    number: "04",
    title: "VaultPass",
    description:
      "Privacy-first access control — prove membership without revealing the credential, on Midnight.",
    role: "Design + Development",
    year: "2025",
    stack: ["Next.js", "TypeScript", "Midnight", "ZK proofs"],
    image: "/images/projects/cover-vaultpass.png",
    liveUrl: "https://vaultpassxbt.vercel.app",
    repoUrl: "https://github.com/codeREDxbt",
    featured: true,
    award: "$30 USD",
    caseFile: {
      challenge: "Gates need proof of membership without exposing identity.",
      decision: "Zero-knowledge eligibility proofs on Midnight's preview network.",
      outcome: "Won $30 USD.",
    },
    caseStudy: {
      lede: "VaultPass is privacy-first access control on the Midnight network — a gate where members prove they're on the list without ever revealing who they are.",
      challenge: [
        "Membership gates have a surveillance problem: proving you belong usually means showing a credential that identifies you, and every check becomes a log of who showed up and when.",
        "The interesting question is selective disclosure — can a gate learn only \"eligible\" and nothing else?",
      ],
      decision: [
        "Zero-knowledge eligibility proofs on Midnight's preview network. Operators generate a private credential, enroll only its hash on-chain, and share the secret privately; members connect a Midnight wallet (Lace or 1AM), paste the credential, and generate a proof.",
        "The gate's public output is one bit — valid_proof: true. A per-gate nullifier stops confirmed proofs from being replayed, and an operator console deploys gates and enrolls hashes. The interface is deliberately honest: opening the vault is session UX after a confirmed proof — the on-chain truth is the proof transaction itself.",
      ],
      outcome: [
        "Live on Midnight's preview network at vaultpassxbt.vercel.app, with a scripted seven-step demo flow for judges — and a $30 USD award for the build.",
      ],
    },
  },
  {
    id: "paytrack",
    number: "05",
    title: "PayTrack",
    description:
      "Employee attendance, overtime, and payroll management shaped into a clear operational dashboard.",
    role: "Design + Development",
    year: "2025",
    stack: ["React", "Vite", "Firebase", "Tailwind CSS"],
    liveUrl: "https://paytrackx.vercel.app",
    repoUrl: "https://github.com/codeREDxbt/PayTrack",
    featured: false,
  },
  {
    id: "stellarpulse",
    number: "06",
    title: "StellarPulse",
    description:
      "A real-time Stellar network explorer with analytics, search, and data-rich visualizations.",
    role: "Development",
    year: "2025",
    stack: ["React", "TypeScript", "Node.js", "Stellar"],
    liveUrl: "https://stellarpulse-xi.vercel.app/",
    repoUrl: "https://github.com/codeREDxbt/StellarPulse",
    featured: false,
    award: "$30 USD",
  },
  {
    id: "medichainai",
    number: "07",
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
    number: "08",
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
