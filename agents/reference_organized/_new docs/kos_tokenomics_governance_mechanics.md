governance:
  model: "Decentralized, Quadratic Voting with Reputation Weighting"
  voting:
    type: "Quadratic Voting"
    rationale: "To prevent plutocratic control and amplify minority consensus while giving more weight to high-reputation contributors."
    participation_requirements:
      - "Minimum reputation threshold for proposal submission"
      - "Stake-based voting power (subject to quadratic cost escalation)"
      - "Partial non-refundable token burn per vote to discourage spam voting"
    vote_weighting:
      - "Quadratic vote power curve"
      - "Reputation multipliers"
      - "Wallet activity decay factor"
    decision_types:
      - "Economic policy adjustments (UBI rate, burn curve changes)"
      - "New module or feature approval"
      - "Security parameter adjustments"
      - "Emergency protocol triggers"

  proposal_process:
    phases:
      - "Draft Submission"
      - "Community Feedback Period (7 days minimum)"
      - "Finalization with Reputation-Verified Co-Sponsors"
      - "Network-wide Vote (minimum 20% active wallet participation for quorum)"
      - "Multi-signature Time-Locked Execution (48 hours delay minimum)"

  treasury_management:
    treasury_type: "Community DAO"
    revenue_sources:
      - "Module deployment fees"
      - "Governance vote burns"
      - "Voluntary donations"
      - "Part of network burn pool diverted for treasury upkeep"
    spending_approvals:
      - "Governance-approved budget proposals"
      - "Time-locked release mechanisms for large disbursements"

  anti_whale_mechanisms:
    methods:
      - "Quadratic vote scaling"
      - "Reputation-weighted voting caps"
      - "Decay on dormant high-balance wallets"
      - "Stake-based cooldown periods for large token holders"

  emergency_governance:
    triggers:
      - "Economic health index breach"
      - "Sybil attack detection"
      - "Catastrophic network event"
    process:
      - "Fast-track governance proposal submission"
      - "Shortened voting window (24 hours)"
      - "Mandatory multi-sig execution approval"
      - "Post-crisis community audit and rollback option within 72 hours"

  reputation_influence:
    scoring_integration:
      - "Node uptime longevity"
      - "Task success rate"
      - "Module contribution history"
      - "Governance participation consistency"
      - "Community endorsements (weighted staking)"

  transparency:
    public_dashboards:
      - "Live proposal feed"
      - "Voter participation metrics"
      - "Reputation-weighted vote results"
      - "Treasury balance and spending ledger"

  narrative_flavor:
    governance_body: "Council of Griots and Skalds"
    proposal_term: "Pulse Directive"
    voting_term: "Echo Weight"
    emergency_vote_term: "Signal Override"

