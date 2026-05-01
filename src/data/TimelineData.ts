export interface TimelineEvent {
  id: string;
  title: string;
  date: string;
  description: string;
  isVotingDay?: boolean;
  isMCC?: boolean;
  calendarLink?: string;
}

export type TimelineData = Record<string, TimelineEvent[]>;

// Factory to create Google Calendar links easily
export const createCalLink = (title: string, startDate: string, endDate: string, details: string) => {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${startDate}/${endDate}`,
    details: details,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

// Mock data structured around the 2026 expected timelines
export const TIMELINE_CMS: TimelineData = {
  in: [
    {
      id: "in1",
      title: "Election Announcement",
      date: "Early March 2026",
      description: "The ECI announces the dates. The Model Code of Conduct (MCC) immediately comes into effect, preventing the government from announcing new schemes.",
      isMCC: true,
    },
    {
      id: "in2",
      title: "Gazette Notification",
      date: "Mid March 2026",
      description: "Official notification is issued, opening the window for candidates to file their nomination papers.",
    },
    {
      id: "in3",
      title: "Nominations & Scrutiny",
      date: "Late March 2026",
      description: "Candidates file nominations. Scrutiny is done by Returning Officers. Withdrawals are allowed up to a specific date.",
    },
    {
      id: "in4",
      title: "Campaign Period",
      date: "April 2026",
      description: "Candidates hold rallies. Note: Campaigning strictly stops 48 hours before polling begins in each respective phase.",
    },
    {
      id: "in5",
      title: "Voting Phase 1 to 7",
      date: "April - May 2026",
      description: "India conducts elections in 7 phases across different states to ensure security. E.g., TN in Phase 1, UP spread across all 7.",
      isVotingDay: true,
      calendarLink: createCalLink("Voting Day (India)", "20260515T013000Z", "20260515T123000Z", "Don't forget to take your Voter ID to the designated polling station.")
    },
    {
      id: "in6",
      title: "Counting & Results",
      date: "Early June 2026",
      description: "All EVMs are transported to strong rooms, unsealed, and counted. Results are declared by evening.",
      calendarLink: createCalLink("Election Results Day", "20260604T023000Z", "20260604T103000Z", "Watch the election results unfold on TV or the ECI website.")
    },
    {
      id: "in7",
      title: "New Govt Sworn In",
      date: "Mid June 2026",
      description: "The newly elected Prime Minister and Council of Ministers take the oath of office.",
    }
  ],
  us: [
    {
      id: "us1",
      title: "State Primaries Conclude",
      date: "August 2026",
      description: "The final cutoff for primary elections determining the party nominees for the Midterms.",
    },
    {
      id: "us2",
      title: "Voter Registration Deadline",
      date: "October 5, 2026",
      description: "Deadlines vary by state (usually 15-30 days before election). This is a safe average.",
    },
    {
      id: "us3",
      title: "Early Voting Begins",
      date: "Mid October 2026",
      description: "Mail-in ballots are sent out and early voting centers open across participating states.",
    },
    {
      id: "us4",
      title: "Election Day (Midterms)",
      date: "November 3, 2026",
      description: "The first Tuesday after the first Monday in November. All 435 House seats and 34 Senate seats are up.",
      isVotingDay: true,
      calendarLink: createCalLink("US Midterm Elections", "20261103T120000Z", "20261104T010000Z", "Vote in the 2026 Midterm Elections.")
    },
    {
      id: "us5",
      title: "New Congress Sworn In",
      date: "January 3, 2027",
      description: "The 120th United States Congress convenes.",
    }
  ],
  gb: [ // Placeholder for UK (General estimate since their system can be triggered early but maximum term is August 2029)
     {
      id: "gb1",
      title: "Parliament Dissolved",
      date: "TBD",
      description: "The Monarch dissolves Parliament upon request of the Prime Minister, officially marking a 25-working-day campaign period.",
    },
    {
      id: "gb2",
      title: "Voter Registration Deadline",
      date: "TBA - 12 days before poll",
      description: "Must be registered by midnight 12 working days before polling day.",
    },
     {
      id: "gb3",
      title: "Polling Day",
      date: "TBD 2029 (Expected)",
      description: "Voting takes place at local polling stations from 7am to 10pm.",
      isVotingDay: true,
    }
  ]
};
