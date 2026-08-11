/**
 * SINGLE SOURCE OF TRUTH.
 *
 * Every page and every JSON-LD block reads from this file. Nothing about Hirad is
 * hard-coded into a template. If a fact changes, it changes here exactly once and
 * the whole site — visible copy, CV, and structured data — follows.
 *
 * This exists because the old site kept the same facts in two places (index.html and
 * readme.md) and they drifted apart: different city, different phone, different
 * certification expiry. Structured data that disagrees with visible copy also costs
 * search trust, so the two must come from one place by construction.
 *
 * Where the old sources disagreed, index.html is authoritative (owner's call).
 */

export const SITE = {
  url: 'https://hiradfazeli.github.io',
  title: 'Hirad Fazeli',
  /** Used as the default OG/Twitter image and by the Person schema. */
  ogImage: '/og-default.png',
  locale: 'en',
  /** Stable @id for the one canonical Person node referenced site-wide. */
  personId: 'https://hiradfazeli.github.io/about/#hirad',
  orgId: 'https://zeeberton.com/#organization',
} as const;

export const PERSON = {
  name: 'Hirad Fazeli',
  /**
   * Leads with what he does now; the certification is the credibility layer.
   * "Cloud Engineer" rather than a bare "Engineer" on purpose — his engineering
   * is infrastructure and networking, and the unqualified word alongside
   * ZEEberton would imply he writes the app himself.
   */
  headline: 'Founder & Cloud Engineer',
  jobTitle: 'Founder, ZEEberton',
  tagline: 'I run ZEEberton — a live map for pet owners.',
  summary:
    'Founder of ZEEberton, a map-first social network for pet owners that I run end to end on my own — product direction, releases, launch and partnerships. Before that, six years in network operations and infrastructure across Iran and Georgia, and a Microsoft Certified Azure Administrator (AZ-104).',
  /** Short form for meta descriptions and OG cards. Keep under ~155 characters. */
  metaSummary:
    'Founder of ZEEberton, a live map for pet owners. Microsoft Certified Azure Administrator (AZ-104) with 6+ years in network operations.',
  email: 'hiradfazeli@zeeberton.com',
  location: {
    city: 'Yerevan',
    country: 'Armenia',
    countryCode: 'AM',
    display: 'Yerevan, Armenia',
  },
  birth: {
    date: '1994-10-31',
    display: '31 October 1994',
    place: 'Tehran, Iran',
  },
  photo: {
    alt: 'Portrait of Hirad Fazeli',
  },
  /**
   * `sameAs` is the strongest identity-resolution signal available to search
   * engines — it is the evidence that these scattered profiles are one person.
   */
  links: [
    { label: 'LinkedIn', url: 'https://linkedin.com/in/hiradfazeli', handle: 'in/hiradfazeli' },
    { label: 'GitHub', url: 'https://github.com/hiradfazeli', handle: '@hiradfazeli' },
    { label: 'ZEEberton', url: 'https://zeeberton.com', handle: 'zeeberton.com' },
    {
      label: 'Microsoft Learn',
      url: 'https://learn.microsoft.com/en-us/users/hiradfazeli/transcript/735m6h854zgmx6e',
      handle: 'Verified transcript',
    },
  ],
  /*
    Must mirror the visible skills on /cv/. Structured data that claims expertise
    the page does not show costs search trust — and would misrepresent him.
  */
  knowsAbout: [
    'Startup leadership',
    'Product strategy',
    'Go-to-market strategy',
    'Brand management',
    'Business analytics',
    'Agile delivery',
    'Microsoft Azure',
    'Cloud infrastructure',
    'Network operations',
  ],
} as const;

/* ------------------------------------------------------------------ experience */

export type Role = {
  title: string;
  org?: string;
  location?: string;
  start: string;
  end: string;
  /** Machine-readable, for the CV's <time> elements. */
  startISO: string;
  endISO?: string;
  current?: boolean;
  points: string[];
};

export const EXPERIENCE: Role[] = [
  {
    title: 'Founder',
    org: 'ZEEberton',
    location: 'Yerevan, Armenia',
    start: 'May 2026',
    end: 'Present',
    startISO: '2026-05',
    current: true,
    points: [
      'Founded and run a map-first social network for pet owners — a live map that helps neighbours meet for walks and playdates, form packs, and raise lost-pet alerts.',
      'Own the product end to end as a single-person team — roadmap, design direction, release schedule, support and day-to-day operations.',
      'Launched on Google Play and localised into multiple languages for an international audience.',
      'Run go-to-market directly — positioning, store presence, pricing, and partnerships with vets, groomers and pet businesses.',
    ],
  },
  {
    title: 'Game Presenter',
    org: 'Evolution Gaming',
    location: 'Tbilisi, Georgia',
    start: 'February 2023',
    end: 'July 2025',
    startISO: '2023-02',
    endISO: '2025-07',
    points: [
      'Led live game sessions in English for a global audience, keeping every round error-free and every player looked after, on camera and in real time.',
      'Worked to strict operational procedure in a heavily monitored, zero-tolerance-for-error environment.',
    ],
  },
  {
    title: 'Relocation & Independent Work',
    location: 'Tehran, Iran → Tbilisi, Georgia',
    start: 'September 2021',
    end: 'February 2023',
    startISO: '2021-09',
    endISO: '2023-02',
    points: [
      'Relocated from Iran to Georgia and rebuilt professionally from scratch in a new country.',
      'Delivered the CIC Mission rebranding project (2022–2023) alongside translation and content work.',
      'Retrained toward software — completed the Codecademy Front-End Engineer (React + Redux) path, which became the foundation for building ZEEberton.',
    ],
  },
  {
    title: 'NOC-Fixed Engineer',
    org: 'Parsonline',
    location: 'Tehran, Iran',
    start: 'October 2019',
    end: 'July 2021',
    startISO: '2019-10',
    endISO: '2021-07',
    points: [
      'Configured, monitored, maintained and troubleshot large-scale fixed network infrastructure across multiple cities.',
      'Resolved disconnections and service disorders, performed change management, and kept availability high on infrastructure serving thousands of subscribers.',
    ],
  },
  {
    title: 'NOC Engineer',
    org: 'AfraRasa',
    location: 'Tehran, Iran',
    start: 'March 2018',
    end: 'June 2019',
    startISO: '2018-03',
    endISO: '2019-06',
    points: [
      'Provided real-time network monitoring, LAN administration and technical support.',
      'Managed the AAA server (IBSng) and CRM systems for uninterrupted service delivery.',
    ],
  },
  {
    title: 'Trainer — Wireshark / WCNA',
    org: 'adminportal.ir',
    location: 'Tehran, Iran',
    start: 'February 2018',
    end: 'April 2018',
    startISO: '2018-02',
    endISO: '2018-04',
    points: [
      'Created and delivered 350 minutes of professional Wireshark video training for working network engineers.',
      'Designed and structured the full curriculum and all supporting material.',
    ],
  },
  {
    title: 'Call Center Specialist',
    org: 'Rasane Network',
    location: 'Tehran, Iran',
    start: 'October 2017',
    end: 'January 2018',
    startISO: '2017-10',
    endISO: '2018-01',
    points: ['Delivered phone-based technical support and performed live network monitoring.'],
  },
  {
    title: 'ADSL Installation Technician',
    org: 'Kavosh Group of Companies',
    location: 'Tehran, Iran',
    start: 'June 2015',
    end: 'January 2016',
    startISO: '2015-06',
    endISO: '2016-01',
    points: ['Installed and configured ADSL services at customer premises.'],
  },
];

/* -------------------------------------------------------------------- projects */

export type Project = {
  slug: string;
  /**
   * No `index` field on purpose. The displayed 01/02/03 is derived from array
   * position at render time, so adding or reordering a project can never leave
   * the numbering wrong.
   */
  name: string;
  period: string;
  role: string;
  blurb: string;
  /**
   * Short descriptors shown as chips. Deliberately NOT a technology list for
   * ZEEberton — the product is introduced commercially, not by its stack.
   */
  tags: string[];
  href?: string;
  /** Internal case-study route, when one exists. */
  caseStudy?: string;
  featured?: boolean;
};

export const PROJECTS: Project[] = [
  {
    slug: 'zeeberton',
    name: 'ZEEberton',
    period: '2026 — Present',
    role: 'Founder',
    blurb:
      'A map-first social network that puts dog and cat owners on a live map so they can plan walks, form packs and catch lost-pet alerts in their neighbourhood. Founded and run solo.',
    tags: ['Consumer product', 'Mobile app', 'Community', 'Partnerships', 'Multilingual'],
    href: 'https://zeeberton.com',
    caseStudy: '/work/zeeberton/',
    featured: true,
  },
  {
    slug: 'rancho-gardabani',
    name: 'Rancho Gardabani',
    period: '2026',
    role: 'Web design',
    blurb:
      'Website design for a working farm outside Tbilisi — layout, typography and a full-bleed landscape treatment, across a trilingual site running in Georgian, English and Russian.',
    tags: ['Web design', 'UI design', 'Responsive', 'Trilingual'],
    href: 'https://ranch.ge/',
  },
  {
    slug: 'cic-mission',
    name: 'CIC Mission Rebranding',
    period: '2022 — 2023',
    role: 'Brand & project lead',
    blurb:
      'A full rebranding programme delivered across a relocation between two countries — positioning, identity and rollout.',
    tags: ['Brand strategy', 'Project management'],
  },
  {
    slug: 'wireshark-course',
    name: 'Wireshark / WCNA Video Course',
    period: '2018',
    role: 'Author & instructor',
    blurb:
      '350 minutes of hands-on packet-analysis training for working network engineers — curriculum, capture labs and delivery, produced end to end.',
    tags: ['Wireshark', 'Packet analysis', 'Curriculum design'],
    href: 'https://www.youtube.com/playlist?list=PLlE8KNhwt4f72Zz8p61MjAAy9a7q4wXAv',
  },
  {
    slug: 'ccna-course',
    name: 'CCNA 200-125 Hands-On Course',
    period: '2018',
    role: 'Author & instructor',
    blurb:
      'A practical, lab-driven CCNA course built around real configuration work rather than exam memorisation. Published free as a public playlist.',
    tags: ['Cisco IOS', 'Routing & switching', 'Lab design'],
    href: 'https://www.youtube.com/playlist?list=PLlE8KNhwt4f4IfeGEfHMzhZngRRxQe974',
  },
];

/* ---------------------------------------------------------------------- skills */

export const SKILLS = [
  {
    group: 'Business & Leadership',
    items: [
      'Founding & running a startup',
      'Product strategy & roadmapping',
      'Go-to-market & launch planning',
      'Brand management & positioning',
      'Business analytics & KPIs',
      'Agile delivery (Scrum, Jira)',
      'Pricing & monetisation',
      'B2B partnerships & sales',
      'Stakeholder communication',
      'Training & knowledge transfer',
    ],
  },
  {
    group: 'Azure Cloud',
    items: [
      'Entra ID — identity & governance',
      'App Service & Virtual Machines',
      'Containers',
      'Storage (Blobs, Files, Queues, Tables)',
      'Virtual Networking (NSGs, DNS, Load Balancers)',
      'Azure Monitor & Log Analytics',
      'Key Vault & Azure Backup',
      'Remote Desktop Services',
    ],
  },
  {
    group: 'Infrastructure & Networking',
    items: [
      'Windows Server administration',
      'Active Directory, DNS, DHCP',
      'Cisco routing & switching',
      'TCP/IP & subnetting',
      'Cacti, PRTG, SolarWinds',
      'LAN / WAN support',
      'AAA servers, change management',
    ],
  },
] as const;

/* -------------------------------------------------------------- certifications */

export type Certification = {
  name: string;
  issuer: string;
  earned: string;
  earnedISO: string;
  expires?: string;
  expiresISO?: string;
  identifier?: string;
  url?: string;
  featured?: boolean;
};

export const CERTIFICATIONS: Certification[] = [
  {
    name: 'Microsoft Certified: Azure Administrator Associate',
    issuer: 'Microsoft — Pearson VUE',
    earned: '20 May 2024',
    earnedISO: '2024-05-20',
    expires: '20 May 2027',
    expiresISO: '2027-05-20',
    identifier: 'AZ-104',
    url: 'https://learn.microsoft.com/en-us/users/hiradfazeli/transcript/735m6h854zgmx6e',
    featured: true,
  },
  {
    name: 'Business Analytics Specialization',
    issuer: 'University of Illinois Urbana-Champaign',
    earned: 'August 2023',
    earnedISO: '2023-08',
  },
  {
    name: 'IT Support Professional Certificate',
    issuer: 'IBM',
    earned: 'July 2023',
    earnedISO: '2023-07',
  },
  {
    name: 'Agile with Atlassian Jira',
    issuer: 'Atlassian',
    earned: 'June 2023',
    earnedISO: '2023-06',
  },
  {
    name: 'Brand Management',
    issuer: 'University of London',
    earned: 'February 2023',
    earnedISO: '2023-02',
  },
  {
    name: 'Front-End Engineer (React + Redux)',
    issuer: 'Codecademy',
    earned: 'July 2022',
    earnedISO: '2022-07',
  },
  {
    name: 'C# Programming Language',
    issuer: 'Laitec IT Learning Lab',
    earned: 'September 2019',
    earnedISO: '2019-09',
  },
  {
    name: 'CCNP Route (300-101)',
    issuer: 'CanDo IT Academy',
    earned: 'April 2017',
    earnedISO: '2017-04',
  },
  {
    name: 'Microsoft Certified Solutions Expert (MCSE 2012 R2)',
    issuer: 'CanDo IT Academy',
    earned: 'September 2016',
    earnedISO: '2016-09',
  },
  {
    name: 'Kerio Control v9.0',
    issuer: 'CanDo IT Academy',
    earned: 'March 2016',
    earnedISO: '2016-03',
  },
  {
    name: 'CCNA Routing & Switching (640-802)',
    issuer: 'CyberTech IT Academy',
    earned: 'May 2014',
    earnedISO: '2014-05',
  },
];

/* ------------------------------------------------------- education & languages */

export const EDUCATION = [
  {
    degree: 'Master of Business Administration (MBA)',
    school: 'Mahan Business School',
    location: 'Tehran, Iran',
    graduated: 'December 2020',
    graduatedISO: '2020-12',
  },
] as const;

export const LANGUAGES = [
  { name: 'Persian', level: 'Native', code: 'fa' },
  { name: 'English', level: 'C1 — fluent', code: 'en' },
  { name: 'Georgian', level: 'A1', code: 'ka' },
] as const;

export const INTERESTS = [
  'Cloud technologies',
  'Networking with professionals',
  'Books',
  'Films & television',
  'Video games',
] as const;

/* ------------------------------------------------------------------ navigation */

export const NAV = [
  { label: 'Work', href: '/work/' },
  { label: 'About', href: '/about/' },
  { label: 'CV', href: '/cv/' },
  { label: 'Contact', href: '/contact/' },
] as const;
