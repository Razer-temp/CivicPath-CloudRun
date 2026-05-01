export interface CountryConfig {
  id: string; // ISO 2-letter
  name: string;
  wikidataId: string;
  systemType: string;
  votingMethod: string;
  nextElection: string;
  nextElectionDate: Date;
  estimatedVoters: string;
}

export const COUNTRIES: CountryConfig[] = [
  { id: "in", name: "India", wikidataId: "Q668", systemType: "Parliamentary", votingMethod: "First-Past-The-Post", nextElection: "May 2029 (Lok Sabha)", nextElectionDate: new Date("2029-05-01"), estimatedVoters: "~968M" },
  { id: "us", name: "USA", wikidataId: "Q30", systemType: "Presidential", votingMethod: "First-Past-The-Post / Electoral College", nextElection: "November 3, 2026 (Midterms)", nextElectionDate: new Date("2026-11-03"), estimatedVoters: "~168M" },
  { id: "gb", name: "United Kingdom", wikidataId: "Q145", systemType: "Parliamentary", votingMethod: "First-Past-The-Post", nextElection: "August 2029", nextElectionDate: new Date("2029-08-01"), estimatedVoters: "~46M" },
  { id: "ph", name: "Philippines", wikidataId: "Q148", systemType: "Presidential", votingMethod: "First-Past-The-Post / Party List", nextElection: "May 11, 2026 (General)", nextElectionDate: new Date("2026-05-11"), estimatedVoters: "~67M" },
  { id: "de", name: "Germany", wikidataId: "Q183", systemType: "Parliamentary", votingMethod: "Mixed-Member Proportional", nextElection: "Autumn 2029", nextElectionDate: new Date("2029-09-01"), estimatedVoters: "~61M" },
  { id: "fr", name: "France", wikidataId: "Q142", systemType: "Semi-Presidential", votingMethod: "Two-Round System", nextElection: "April 2027 (Presidential)", nextElectionDate: new Date("2027-04-01"), estimatedVoters: "~48M" },
  { id: "za", name: "South Africa", wikidataId: "Q258", systemType: "Parliamentary", votingMethod: "Proportional Representation", nextElection: "2029 (General)", nextElectionDate: new Date("2029-05-01"), estimatedVoters: "~27M" },
  { id: "br", name: "Brazil", wikidataId: "Q155", systemType: "Presidential", votingMethod: "Two-Round System", nextElection: "October 4, 2026 (General)", nextElectionDate: new Date("2026-10-04"), estimatedVoters: "~156M" },
  { id: "ca", name: "Canada", wikidataId: "Q16", systemType: "Parliamentary", votingMethod: "First-Past-The-Post", nextElection: "October 20, 2026 (Federal)", nextElectionDate: new Date("2026-10-20"), estimatedVoters: "~27M" },
  { id: "au", name: "Australia", wikidataId: "Q408", systemType: "Parliamentary", votingMethod: "Preferential Voting", nextElection: "Mid 2028", nextElectionDate: new Date("2028-05-01"), estimatedVoters: "~17M" },
  { id: "jp", name: "Japan", wikidataId: "Q17", systemType: "Parliamentary", votingMethod: "Mixed-Member Majoritarian", nextElection: "July 2028 (Upper House)", nextElectionDate: new Date("2028-07-01"), estimatedVoters: "~105M" },
  { id: "mx", name: "Mexico", wikidataId: "Q96", systemType: "Presidential", votingMethod: "FPTP / Proportional", nextElection: "June 2027 (Legislative)", nextElectionDate: new Date("2027-06-01"), estimatedVoters: "~98M" },
  { id: "id", name: "Indonesia", wikidataId: "Q252", systemType: "Presidential", votingMethod: "Open-list Proportional", nextElection: "February 2029 (General)", nextElectionDate: new Date("2029-02-01"), estimatedVoters: "~204M" },
  { id: "ng", name: "Nigeria", wikidataId: "Q1033", systemType: "Presidential", votingMethod: "First-Past-The-Post", nextElection: "February 2027 (General)", nextElectionDate: new Date("2027-02-01"), estimatedVoters: "~93M" },
  { id: "ar", name: "Argentina", wikidataId: "Q414", systemType: "Presidential", votingMethod: "Two-Round / Closed List", nextElection: "October 2027 (General)", nextElectionDate: new Date("2027-10-01"), estimatedVoters: "~35M" }
];
