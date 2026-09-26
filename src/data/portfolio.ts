export type Track = {
  id: string;
  title: string;
  artist: string;
  src: string | null;
  artworkSrc: string | null;
};

export type InterestId =
  | "programming"
  | "ai"
  | "web3"
  | "gaming"
  | "technology"
  | "music";

export type Interest = {
  id: InterestId;
  label: string;
  objectName: string;
  description: string;
};

export type Project = {
  slug: string;
  title: string;
  summary: string;
  role: string;
  technologies: string[];
  coverSrc: string;
  repositoryUrl?: string;
  liveUrl?: string;
  details: string[];
};

export const profile = {
  name: "Aril",
  role: "Aspiring Software Engineer & AI Engineer",
  location: "Indonesia",
  timezone: "WITA, Asia/Makassar",
  tagline: "Building with code, curious about AI, and always learning.",
  biography:
    "I’m a vocational high school student studying Computer Networking and Telecommunications. I’m interested in programming, AI, Web3, and technology. I enjoy learning by building things and experimenting with new ideas.",
  careerGoal:
    "My goal is to become a Software Engineer and AI Engineer, building useful software and AI-powered products.",
};

export const navigation = [
  { label: "Home", href: "#top" },
  { label: "About", href: "#about" },
  { label: "Music", href: "#music" },
  { label: "Interests", href: "#interests" },
  { label: "Projects", href: "#projects" },
  { label: "Journey", href: "#journey" },
  { label: "Contact", href: "#contact" },
];

export const tracks: Track[] = [
  {
    id: "creep",
    title: "Creep",
    artist: "Radiohead",
    src: null,
    artworkSrc: null,
  },
  {
    id: "fake-plastic-trees",
    title: "Fake Plastic Trees",
    artist: "Radiohead",
    src: null,
    artworkSrc: null,
  },
  {
    id: "weird-fishes-arpeggi",
    title: "Weird Fishes/Arpeggi",
    artist: "Radiohead",
    src: null,
    artworkSrc: null,
  },
];

export const interests: Interest[] = [
  {
    id: "programming",
    label: "Programming",
    objectName: "Vintage Synthesizer MK-1",
    description:
      "I enjoy programming because it lets me turn ideas into something real and interactive.",
  },
  {
    id: "ai",
    label: "AI",
    objectName: "Analog 4-Track Mixing Console",
    description:
      "I'm fascinated by AI and want to understand how intelligent systems work and how to build useful AI-powered tools.",
  },
  {
    id: "web3",
    label: "Web3",
    objectName: "Open Reel-to-Reel Tape Deck",
    description:
      "I'm interested in blockchain technology, decentralized applications, and experimenting with new ideas in the Web3 ecosystem.",
  },
  {
    id: "gaming",
    label: "Gaming",
    objectName: "Personal Stereo Walkman TPS",
    description:
      "Gaming is one of my hobbies and also inspires my interest in graphics, technology, and interactive experiences.",
  },
  {
    id: "technology",
    label: "Technology",
    objectName: "Classic Dynamic Studio Mic",
    description:
      "I like exploring new hardware, software, operating systems, and emerging technologies.",
  },
  {
    id: "music",
    label: "Music",
    objectName: "Acoustic Studio Monitor",
    description:
      "Music is part of my everyday life and expresses a large part of my personality.",
  },
];

export const projects: Project[] = [];

export const journey = [
  {
    title: "Current Chapter",
    description:
      "Vocational student studying Computer Networking and Telecommunications.",
  },
  {
    title: "Learning Chapter",
    description:
      "Learning programming, AI, and Web3 while exploring technology through hands-on projects.",
  },
  {
    title: "Next Chapter",
    description: "Becoming a Software Engineer and AI Engineer.",
  },
];

export const socials = [
  {
    label: "GitHub",
    handle: "arilcihuyy",
    href: "https://github.com/arilcihuyy",
  },
  {
    label: "X",
    handle: "0xAril27",
    href: "https://x.com/0xAril27",
  },
];
