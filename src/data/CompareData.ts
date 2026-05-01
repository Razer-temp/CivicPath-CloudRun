export interface CountryElectionData {
  id: string;
  name: string;
  flagEmoji: string;
  systemType: string;
  votingMethod: string;
  votingAge: number;
  mandatoryVoting: boolean;
  electionFrequency: string;
  voterTurnout: string;
  registeredVoters: string;
  runsElections: string;
}

export const COMPARE_DATA: CountryElectionData[] = [
  {
    id: "india",
    name: "India",
    flagEmoji: "🇮🇳",
    systemType: "Parliamentary Republic",
    votingMethod: "First-Past-The-Post (EVMs)",
    votingAge: 18,
    mandatoryVoting: false,
    electionFrequency: "Every 5 years",
    voterTurnout: "66-67%",
    registeredVoters: "968 Million",
    runsElections: "Election Commission of India (Independent)",
  },
  {
    id: "usa",
    name: "United States",
    flagEmoji: "🇺🇸",
    systemType: "Presidential Republic / Federal",
    votingMethod: "First-Past-The-Post / Electoral College",
    votingAge: 18,
    mandatoryVoting: false,
    electionFrequency: "Every 4 years",
    voterTurnout: "62-66%",
    registeredVoters: "161 Million",
    runsElections: "Decentralized (State & Local Gov)",
  },
  {
    id: "uk",
    name: "United Kingdom",
    flagEmoji: "🇬🇧",
    systemType: "Parliamentary Constitutional Monarchy",
    votingMethod: "First-Past-The-Post",
    votingAge: 18,
    mandatoryVoting: false,
    electionFrequency: "Every 5 years",
    voterTurnout: "67%",
    registeredVoters: "47 Million",
    runsElections: "Electoral Commission (Independent)",
  },
  {
    id: "australia",
    name: "Australia",
    flagEmoji: "🇦🇺",
    systemType: "Parliamentary Constitutional Monarchy",
    votingMethod: "Ranked Choice / Preferential Voting",
    votingAge: 18,
    mandatoryVoting: true,
    electionFrequency: "Every 3 years",
    voterTurnout: "90-92%",
    registeredVoters: "17 Million",
    runsElections: "Australian Electoral Commission (Independent)",
  },
  {
    id: "brazil",
    name: "Brazil",
    flagEmoji: "🇧🇷",
    systemType: "Presidential Republic",
    votingMethod: "Proportional Representation / Two-Round System",
    votingAge: 16,
    mandatoryVoting: true,
    electionFrequency: "Every 4 years",
    voterTurnout: "79-80%",
    registeredVoters: "156 Million",
    runsElections: "Superior Electoral Court (Judicial)",
  },
  {
    id: "germany",
    name: "Germany",
    flagEmoji: "🇩🇪",
    systemType: "Parliamentary Republic",
    votingMethod: "Mixed-Member Proportional Representation",
    votingAge: 18,
    mandatoryVoting: false,
    electionFrequency: "Every 4 years",
    voterTurnout: "76%",
    registeredVoters: "61 Million",
    runsElections: "Federal Returning Officer (Ministry of Interior)",
  }
];
