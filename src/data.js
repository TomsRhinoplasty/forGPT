/**
 * Data module containing the main nodes and their hierarchical structure.
 * @module data
 */

export const mainNodes = [
  {
    id: "m1",
    title: "A Business Exists",
    role: "human",
    desc: "Foundational assumption: a business exists as an entity that provides value in exchange for resources.",
    children: []
  },
  {
    id: "m2",
    title: "Scans for Unmet Need / Opportunity",
    role: "hybrid",
    desc: "The business actively looks for things it can improve, fix, or create.",
    children: [
      {
        id: "m2s1",
        title: "Conducts Market Research",
        role: "hybrid",
        desc: "Actively seeks to understand customer needs.",
        children: [
          {
            id: "m2s1ss1",
            title: "Distributes Surveys / Runs Interviews",
            role: "hybrid",
            desc: "Collects firsthand insights.",
            children: []
          },
          {
            id: "m2s1ss2",
            title: "Analyzes Sales & Churn Data",
            role: "ai",
            desc: "Processes quantitative data.",
            children: []
          },
          {
            id: "m2s1ss3",
            title: "Reviews Competitor Feedback",
            role: "hybrid",
            desc: "Examines competitor strengths and weaknesses.",
            children: []
          }
        ]
      },
      {
        id: "m2s2",
        title: "Observes Trends & Behaviors",
        role: "hybrid",
        desc: "Watches how trends evolve in the market.",
        children: [
          {
            id: "m2s2ss1",
            title: "Scrapes Forums / Social Platforms",
            role: "ai",
            desc: "Gathers online discussions.",
            children: []
          },
          {
            id: "m2s2ss2",
            title: "Watches Keyword & Search Trends",
            role: "ai",
            desc: "Monitors trending search data.",
            children: []
          },
          {
            id: "m2s2ss3",
            title: "Follows Consumer Habits",
            role: "hybrid",
            desc: "Tracks shifts in behavior.",
            children: []
          }
        ]
      },
      {
        id: "m2s3",
        title: "Analyzes Technology & Process Landscape",
        role: "hybrid",
        desc: "Explores current tools and processes for improvement.",
        children: [
          {
            id: "m2s3ss1",
            title: "Tracks New APIs & Platforms",
            role: "ai",
            desc: "Identifies emerging technologies.",
            children: []
          },
          {
            id: "m2s3ss2",
            title: "Audits Standard Workflows",
            role: "ai",
            desc: "Reviews existing processes.",
            children: []
          },
          {
            id: "m2s3ss3",
            title: "Compares Operational Benchmarks",
            role: "ai",
            desc: "Measures performance against norms.",
            children: []
          }
        ]
      }
    ]
  },
  {
    id: "m3",
    title: "Selects Worthwhile Opportunities",
    role: "hybrid",
    desc: "Determines which discovered needs or opportunities are realistic, aligned with the business, and worth pursuing.",
    children: []
  },
  {
    id: "m4",
    title: "Prepares Selected Opportunities for Execution",
    role: "hybrid",
    desc: "Transitions a selected opportunity into a defined, actionable structure the business can begin working on.",
    children: [
      {
        id: "m4s1",
        title: "Categorize the Opportunity",
        role: "ai",
        desc: "Determines the type of opportunity.",
        children: [
          {
            id: "m4s1ss1",
            title: "Classifies by Business Function",
            role: "ai",
            desc: "Determines the relevant business area.",
            children: []
          },
          {
            id: "m4s1ss2",
            title: "Tags Complexity or Urgency",
            role: "ai",
            desc: "Labels the effort required.",
            children: []
          },
          {
            id: "m4s1ss3",
            title: "Matches with Historical Work Archetypes",
            role: "ai",
            desc: "Finds similar past projects.",
            children: []
          }
        ]
      },
      {
        id: "m4s2",
        title: "Define Scope and Objectives",
        role: "hybrid",
        desc: "Clarifies what is included and what success looks like.",
        children: [
          {
            id: "m4s2ss1",
            title: "Clarifies Deliverables and Constraints",
            role: "hybrid",
            desc: "Outlines what must be delivered.",
            children: []
          },
          {
            id: "m4s2ss2",
            title: "Establishes Success Criteria",
            role: "hybrid",
            desc: "Defines measurable outcomes.",
            children: []
          },
          {
            id: "m4s2ss3",
            title: "Confirms Stakeholder Agreements",
            role: "human",
            desc: "Verifies mutual consent.",
            children: []
          }
        ]
      },
      {
        id: "m4s3",
        title: "Allocate Resources and Roles",
        role: "hybrid",
        desc: "Assigns the needed people, tools, and budget.",
        children: [
          {
            id: "m4s3ss1",
            title: "Assigns Ownership and Responsibility",
            role: "human",
            desc: "Determines who leads each task.",
            children: []
          },
          {
            id: "m4s3ss2",
            title: "Confirms Tool Access and Permissions",
            role: "ai",
            desc: "Ensures necessary accesses are in place.",
            children: []
          },
          {
            id: "m4s3ss3",
            title: "Estimates Time and Budget Needs",
            role: "ai",
            desc: "Forecasts resource requirements.",
            children: []
          }
        ]
      },
      {
        id: "m4s4",
        title: "Draft Initial Plan or Workflow",
        role: "ai",
        desc: "Creates a rough outline to guide execution.",
        children: [
          {
            id: "m4s4ss1",
            title: "Outlines Major Phases or Milestones",
            role: "ai",
            desc: "Breaks work into segments.",
            children: []
          },
          {
            id: "m4s4ss2",
            title: "Maps Task Dependencies",
            role: "ai",
            desc: "Shows prerequisite relationships.",
            children: []
          },
          {
            id: "m4s4ss3",
            title: "Creates Visual or Written Workflow",
            role: "ai",
            desc: "Documents the execution path.",
            children: []
          }
        ]
      },
      {
        id: "m4s5",
        title: "Identify Risks and Constraints",
        role: "ai",
        desc: "Highlights potential blockers and limitations.",
        children: [
          {
            id: "m4s5ss1",
            title: "Flags External Dependencies",
            role: "ai",
            desc: "Identifies outside requirements.",
            children: []
          },
          {
            id: "m4s5ss2",
            title: "Surfaces Legal, Compliance, or Policy Concerns",
            role: "human",
            desc: "Highlights sensitive issues.",
            children: []
          },
          {
            id: "m4s5ss3",
            title: "Identifies Known Technical Limitations",
            role: "ai",
            desc: "Notes current system constraints.",
            children: []
          }
        ]
      },
      {
        id: "m4s6",
        title: "Confirm Stakeholder Expectations",
        role: "human",
        desc: "Ensures all parties are aligned.",
        children: [
          {
            id: "m4s6ss1",
            title: "Holds Kickoff or Alignment Meeting",
            role: "human",
            desc: "Starts the project with team alignment.",
            children: []
          },
          {
            id: "m4s6ss2",
            title: "Documents Commitments and Expectations",
            role: "human",
            desc: "Records agreed-upon points.",
            children: []
          },
          {
            id: "m4s6ss3",
            title: "Logs Stakeholder Sign-Off",
            role: "human",
            desc: "Documents final approvals.",
            children: []
          }
        ]
      },
      {
        id: "m4s7",
        title: "Set Success Criteria",
        role: "human",
        desc: "Defines when the opportunity is successfully addressed.",
        children: [
          {
            id: "m4s7ss1",
            title: "Chooses Leading & Lagging Metrics",
            role: "ai",
            desc: "Selects performance indicators.",
            children: []
          },
          {
            id: "m4s7ss2",
            title: "Creates Tracking or Dashboard Plan",
            role: "ai",
            desc: "Plans how to monitor progress.",
            children: []
          },
          {
            id: "m4s7ss3",
            title: "Aligns Metrics With Business Objectives",
            role: "human",
            desc: "Ensures metrics reflect strategic goals.",
            children: []
          }
        ]
      }
    ]
  },
  {
    id: "m5",
    title: "Transfers Prepared Work to Executers",
    role: "hybrid",
    desc: "Transfers fully prepared opportunities to the department, team, or individual best suited to execute them.",
    children: []
  },
  {
    id: "m6",
    title: "Executes Work",
    role: "hybrid",
    desc: "The assigned department or role carries out the necessary actions to fulfill the opportunity.",
    children: [
      {
        id: "m6s1",
        title: "Gathers or Receives Required Inputs",
        role: "ai",
        desc: "Collects necessary data or materials.",
        children: [
          {
            id: "m6s1ss1",
            title: "Retrieves Instructions, Briefs, or Requirements",
            role: "ai",
            desc: "Pulls necessary documentation.",
            children: []
          },
          {
            id: "m6s1ss2",
            title: "Collects Materials, Data, or Assets",
            role: "ai",
            desc: "Gathers required inputs.",
            children: []
          },
          {
            id: "m6s1ss3",
            title: "Verifies Input Completeness and Accuracy",
            role: "ai",
            desc: "Checks data quality.",
            children: []
          }
        ]
      },
      {
        id: "m6s2",
        title: "Performs Core Tasks",
        role: "hybrid",
        desc: "Carries out the main functions needed.",
        children: [
          {
            id: "m6s2ss1",
            title: "Applies Skills or Tools to Deliver Output",
            role: "hybrid",
            desc: "Executes the core task.",
            children: []
          },
          {
            id: "m6s2ss2",
            title: "Follows Defined Workflow or Process",
            role: "ai",
            desc: "Adheres to the plan.",
            children: []
          },
          {
            id: "m6s2ss3",
            title: "Adapts to Unexpected Situations if Needed",
            role: "human",
            desc: "Responds to unplanned challenges.",
            children: []
          }
        ]
      },
      {
        id: "m6s3",
        title: "Collaborates Across Roles or Tools",
        role: "hybrid",
        desc: "Coordinates with other systems or teams.",
        children: [
          {
            id: "m6s3ss1",
            title: "Hands Off Partial Work for Contribution",
            role: "human",
            desc: "Transfers parts of work for input.",
            children: []
          },
          {
            id: "m6s3ss2",
            title: "Uses Integrated Tools, APIs, or Workflows",
            role: "ai",
            desc: "Connects across systems.",
            children: []
          },
          {
            id: "m6s3ss3",
            title: "Communicates Status or Needs in Real Time",
            role: "ai",
            desc: "Shares updates instantly.",
            children: []
          }
        ]
      },
      {
        id: "m6s4",
        title: "Tracks Progress and Captures Output",
        role: "ai",
        desc: "Logs work and metrics.",
        children: [
          {
            id: "m6s4ss1",
            title: "Saves and Stores Work in Agreed Location",
            role: "ai",
            desc: "Archives the work.",
            children: []
          },
          {
            id: "m6s4ss2",
            title: "Updates Task or Project Management Systems",
            role: "ai",
            desc: "Logs current status.",
            children: []
          },
          {
            id: "m6s4ss3",
            title: "Records Key Metrics or Completion Data",
            role: "ai",
            desc: "Captures performance numbers.",
            children: []
          }
        ]
      },
      {
        id: "m6s5",
        title: "Verifies Self-Quality Before Handoff",
        role: "hybrid",
        desc: "Checks that work is complete and correct.",
        children: [
          {
            id: "m6s5ss1",
            title: "Cross-Checks Against Brief or Criteria",
            role: "hybrid",
            desc: "Verifies requirements are met.",
            children: []
          },
          {
            id: "m6s5ss2",
            title: "Runs Basic Tests or Validations",
            role: "ai",
            desc: "Performs simple checks.",
            children: []
          },
          {
            id: "m6s5ss3",
            title: "Makes Final Edits or Fixes",
            role: "hybrid",
            desc: "Adjusts minor issues.",
            children: []
          }
        ]
      }
    ]
  },
  {
    id: "m7",
    title: "Reviews and Approves Work Internally",
    role: "hybrid",
    desc: "The completed work is submitted for internal review to ensure it meets quality and compliance standards.",
    children: [
      {
        id: "m7s1",
        title: "Conducts Quality Assurance",
        role: "hybrid",
        desc: "Checks work for defects and inconsistencies.",
        children: [
          {
            id: "m7s1ss1",
            title: "Checks for Errors, Omissions, or Defects",
            role: "ai",
            desc: "Scans for mistakes.",
            children: []
          },
          {
            id: "m7s1ss2",
            title: "Confirms Adherence to Internal Standards",
            role: "ai",
            desc: "Ensures compliance with standards.",
            children: []
          },
          {
            id: "m7s1ss3",
            title: "Tests Output in Relevant Environment",
            role: "ai",
            desc: "Validates functionality.",
            children: []
          }
        ]
      },
      {
        id: "m7s2",
        title: "Performs Peer or Cross-Team Review",
        role: "human",
        desc: "Gathers feedback from colleagues.",
        children: [
          {
            id: "m7s2ss1",
            title: "Assigns Reviewer Not Involved in Execution",
            role: "human",
            desc: "Selects an unbiased reviewer.",
            children: []
          },
          {
            id: "m7s2ss2",
            title: "Collects Feedback and Suggested Changes",
            role: "human",
            desc: "Gathers improvement ideas.",
            children: []
          },
          {
            id: "m7s2ss3",
            title: "Iterates Based on Internal Collaboration",
            role: "human",
            desc: "Revises work based on input.",
            children: []
          }
        ]
      },
      {
        id: "m7s3",
        title: "Validates Against Original Requirements",
        role: "hybrid",
        desc: "Ensures deliverables meet defined criteria.",
        children: [
          {
            id: "m7s3ss1",
            title: "Cross-References Output with Scope or Brief",
            role: "hybrid",
            desc: "Checks work against expectations.",
            children: []
          },
          {
            id: "m7s3ss2",
            title: "Checks All Success Criteria Are Met",
            role: "ai",
            desc: "Verifies key goals are achieved.",
            children: []
          },
          {
            id: "m7s3ss3",
            title: "Identifies Gaps or Overlooked Elements",
            role: "ai",
            desc: "Finds missing pieces.",
            children: []
          }
        ]
      },
      {
        id: "m7s4",
        title: "Conducts Managerial or Final Sign-Off",
        role: "human",
        desc: "Provides the final review and approval.",
        children: [
          {
            id: "m7s4ss1",
            title: "Escalates Work for Final Authority Review",
            role: "human",
            desc: "Sends work up the chain.",
            children: []
          },
          {
            id: "m7s4ss2",
            title: "Assesses Strategic or Client Alignment",
            role: "human",
            desc: "Ensures strategic fit.",
            children: []
          },
          {
            id: "m7s4ss3",
            title: "Signs Off or Requests Final Adjustments",
            role: "human",
            desc: "Gives final approval or feedback.",
            children: []
          }
        ]
      },
      {
        id: "m7s5",
        title: "Logs Approval and Prepares for Handoff",
        role: "ai",
        desc: "Documents approval and readies delivery.",
        children: [
          {
            id: "m7s5ss1",
            title: "Marks Work as Approved in Tracking System",
            role: "ai",
            desc: "Updates status to approved.",
            children: []
          },
          {
            id: "m7s5ss2",
            title: "Packages Deliverables for Final Delivery",
            role: "ai",
            desc: "Prepares assets for handoff.",
            children: []
          },
          {
            id: "m7s5ss3",
            title: "Coordinates Handoff Timing and Channel",
            role: "ai",
            desc: "Synchronizes the transfer.",
            children: []
          }
        ]
      }
    ]
  },
  {
    id: "m8",
    title: "Finalizes and Delivers the Output",
    role: "hybrid",
    desc: "The approved work is finalized into its completed form and delivered to the intended recipient.",
    children: [
      {
        id: "m8s1",
        title: "Finalizes Output for Delivery",
        role: "hybrid",
        desc: "Polishes the work into its final form.",
        children: [
          {
            id: "m8s1ss1",
            title: "Applies Final Formatting or Cleanup",
            role: "ai",
            desc: "Polishes the final output.",
            children: []
          },
          {
            id: "m8s1ss2",
            title: "Converts Output into Required Format",
            role: "ai",
            desc: "Transforms the work into the needed format.",
            children: []
          },
          {
            id: "m8s1ss3",
            title: "Runs Last Check Before Packaging",
            role: "hybrid",
            desc: "Performs a final review.",
            children: []
          }
        ]
      },
      {
        id: "m8s2",
        title: "Selects Delivery Channel or Method",
        role: "hybrid",
        desc: "Chooses the best way to deliver the work.",
        children: [
          {
            id: "m8s2ss1",
            title: "Evaluates Recipient’s Needs and Preferences",
            role: "human",
            desc: "Assesses the best delivery approach.",
            children: []
          },
          {
            id: "m8s2ss2",
            title: "Chooses Secure and Efficient Method",
            role: "ai",
            desc: "Selects a safe delivery method.",
            children: []
          },
          {
            id: "m8s2ss3",
            title: "Prepares Channel for Use",
            role: "ai",
            desc: "Gets the delivery channel ready.",
            children: []
          }
        ]
      },
      {
        id: "m8s3",
        title: "Delivers to Intended Recipient or System",
        role: "ai",
        desc: "Executes the delivery.",
        children: [
          {
            id: "m8s3ss1",
            title: "Executes Transfer or Submission",
            role: "ai",
            desc: "Carries out the transfer.",
            children: []
          },
          {
            id: "m8s3ss2",
            title: "Includes Necessary Instructions or Context",
            role: "hybrid",
            desc: "Adds guidance with the delivery.",
            children: []
          },
          {
            id: "m8s3ss3",
            title: "Ensures Access is Granted and Live",
            role: "ai",
            desc: "Verifies that delivery is accessible.",
            children: []
          }
        ]
      },
      {
        id: "m8s4",
        title: "Confirms Receipt and Acknowledgement",
        role: "ai",
        desc: "Verifies that the delivery was received.",
        children: [
          {
            id: "m8s4ss1",
            title: "Notifies Stakeholder of Completion",
            role: "ai",
            desc: "Sends a completion alert.",
            children: []
          },
          {
            id: "m8s4ss2",
            title: "Requests or Monitors Confirmation",
            role: "ai",
            desc: "Watches for confirmation.",
            children: []
          },
          {
            id: "m8s4ss3",
            title: "Follows Up If Delivery Unacknowledged",
            role: "ai",
            desc: "Reaches out if needed.",
            children: []
          }
        ]
      },
      {
        id: "m8s5",
        title: "Archives Final Version or Proof of Delivery",
        role: "ai",
        desc: "Stores the final output for record keeping.",
        children: [
          {
            id: "m8s5ss1",
            title: "Saves Deliverable to Long-Term Storage",
            role: "ai",
            desc: "Archives the delivery.",
            children: []
          },
          {
            id: "m8s5ss2",
            title: "Logs Delivery Timestamp and Method",
            role: "ai",
            desc: "Records delivery details.",
            children: []
          },
          {
            id: "m8s5ss3",
            title: "Backs Up Files or Output Securely",
            role: "ai",
            desc: "Creates a secure backup.",
            children: []
          }
        ]
      }
    ]
  },
  {
    id: "m9",
    title: "Reflects and Learns",
    role: "hybrid",
    desc: "After delivery, the business analyzes results and identifies improvement areas.",
    children: [
      {
        id: "m9s1",
        title: "Collects Outcome Feedback",
        role: "ai",
        desc: "Gathers responses and performance data.",
        children: [
          {
            id: "m9s1ss1",
            title: "Distributes Feedback Requests or Surveys",
            role: "ai",
            desc: "Initiates feedback collection.",
            children: []
          },
          {
            id: "m9s1ss2",
            title: "Monitors Organic Feedback Channels",
            role: "ai",
            desc: "Observes natural feedback flows.",
            children: []
          },
          {
            id: "m9s1ss3",
            title: "Aggregates Quantitative & Qualitative Responses",
            role: "ai",
            desc: "Combines different feedback types.",
            children: []
          }
        ]
      },
      {
        id: "m9s2",
        title: "Measures Against Success Criteria",
        role: "ai",
        desc: "Compares results to established goals.",
        children: [
          {
            id: "m9s2ss1",
            title: "Revisits Goals Defined During Preparation",
            role: "human",
            desc: "Brings back the original targets.",
            children: []
          },
          {
            id: "m9s2ss2",
            title: "Compiles Post-Delivery Metrics or Logs",
            role: "ai",
            desc: "Collects performance data.",
            children: []
          },
          {
            id: "m9s2ss3",
            title: "Compares Results to Benchmarks or Thresholds",
            role: "ai",
            desc: "Measures outcomes against standards.",
            children: []
          }
        ]
      },
      {
        id: "m9s3",
        title: "Identifies Strengths and Shortcomings",
        role: "ai",
        desc: "Analyzes what worked and what did not.",
        children: [
          {
            id: "m9s3ss1",
            title: "Runs Internal Team Debrief",
            role: "human",
            desc: "Leads a reflective discussion.",
            children: []
          },
          {
            id: "m9s3ss2",
            title: "Surfaces Process or Communication Breakdowns",
            role: "human",
            desc: "Identifies where things went wrong.",
            children: []
          },
          {
            id: "m9s3ss3",
            title: "Highlights High-Impact Success Factors",
            role: "human",
            desc: "Points out what drove success.",
            children: []
          }
        ]
      },
      {
        id: "m9s4",
        title: "Logs Learnings and Recommendations",
        role: "hybrid",
        desc: "Records insights for future reference.",
        children: [
          {
            id: "m9s4ss1",
            title: "Writes Up Lessons Learned Summary",
            role: "hybrid",
            desc: "Documents key takeaways.",
            children: []
          },
          {
            id: "m9s4ss2",
            title: "Links Outcomes to Specific Actions or Decisions",
            role: "hybrid",
            desc: "Connects results with causes.",
            children: []
          },
          {
            id: "m9s4ss3",
            title: "Tags Learnings for Future Retrieval",
            role: "ai",
            desc: "Makes insights easily searchable.",
            children: []
          }
        ]
      },
      {
        id: "m9s5",
        title: "Updates Systems and Practices",
        role: "human",
        desc: "Modifies processes based on lessons learned.",
        children: [
          {
            id: "m9s5ss1",
            title: "Improves Documentation or Templates",
            role: "ai",
            desc: "Updates reference materials.",
            children: []
          },
          {
            id: "m9s5ss2",
            title: "Implements New Tools or Adjustments",
            role: "ai",
            desc: "Introduces changes to boost efficiency.",
            children: []
          },
          {
            id: "m9s5ss3",
            title: "Shares Improvements with the Org",
            role: "human",
            desc: "Communicates enhancements to the team.",
            children: []
          }
        ]
      }
    ]
  },
  {
    id: "m10",
    title: "Scans for Unmet Need / Opportunity",
    role: "hybrid",
    desc: "The business actively looks for things it can improve, fix, or create.",
    children: []
  }
];
