export interface LearnTopic {
  id: string;
  title: string;
  shortDescription: string;
  wikiSlug: string;
}

export const LEARN_TOPICS: LearnTopic[] = [
  {
    id: "parliament",
    title: "How does a parliament work?",
    shortDescription: "A parliament is a legislative body of government. Generally, a modern parliament has three functions: representing the electorate, making laws, and overseeing the government via hearings and inquiries.",
    wikiSlug: "Parliament"
  },
  {
    id: "proportional_representation",
    title: "What is proportional representation?",
    shortDescription: "An electoral system in which divisions in an electorate are reflected proportionately in the elected body. If a party wins 30% of the votes, they get roughly 30% of the seats.",
    wikiSlug: "Proportional_representation"
  },
  {
    id: "fptp",
    title: "What is first-past-the-post voting?",
    shortDescription: "A voting method where voters indicate on a ballot the candidate of their choice, and the candidate who receives the most votes wins. This is a common, but sometimes controversial, system.",
    wikiSlug: "First-past-the-post_voting"
  },
  {
    id: "coalition",
    title: "What is a coalition government?",
    shortDescription: "A form of government in which political parties cooperate to form a government. The usual reason for this arrangement is that no single party has achieved an absolute majority after an election.",
    wikiSlug: "Coalition_government"
  },
  {
    id: "vote_counting",
    title: "How are election results counted?",
    shortDescription: "The process of counting votes varies by country and voting method. It can be done manually with paper ballots or electronically using voting machines.",
    wikiSlug: "Vote_counting"
  },
  {
    id: "election_commission",
    title: "What is the role of an Election Commission?",
    shortDescription: "An independent body tasked with overseeing the implementation of election procedures. Their main goal is to ensure that elections are free and fair.",
    wikiSlug: "Election_commission"
  },
  {
    id: "gerrymandering",
    title: "What is gerrymandering?",
    shortDescription: "The practice of establishing a political advantage for a particular party or group by manipulating district boundaries.",
    wikiSlug: "Gerrymandering"
  },
  {
    id: "postal_voting",
    title: "How does postal and absentee voting work?",
    shortDescription: "Voting in an election where ballot papers are distributed to electors (and typically returned) by post, allowing those away from polling stations to participate.",
    wikiSlug: "Postal_voting"
  },
  {
    id: "mcc",
    title: "What is the Model Code of Conduct? (India)",
    shortDescription: "A set of guidelines issued by the Election Commission of India for the conduct of political parties and candidates during elections mainly with respect to speeches, polling day, polling booths, portfolios, election manifestos, and processions.",
    wikiSlug: "Model_Code_of_Conduct"
  },
  {
    id: "nota",
    title: "What is NOTA — None of the Above?",
    shortDescription: "A ballot option in some jurisdictions or organizations, designed to allow the voter to indicate disapproval of the candidates in a voting system.",
    wikiSlug: "None_of_the_above"
  },
  {
    id: "evm",
    title: "What is an EVM and VVPAT?",
    shortDescription: "Electronic Voting Machines (EVMs) are used to record votes. A Voter Verified Paper Audit Trail (VVPAT) provides a slip showing the voter who they voted for, to ensure the machine recorded it correctly.",
    wikiSlug: "Electronic_voting_in_India"
  },
  {
    id: "suffrage",
    title: "What is universal adult franchise?",
    shortDescription: "The right of almost all adults to vote in political elections. It is considered a hallmark of a modern democracy.",
    wikiSlug: "Universal_suffrage"
  }
];
