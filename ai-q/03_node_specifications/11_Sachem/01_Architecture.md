---
title: "Sachem Node 01: Architecture"
version: 1.0
---

# **1. Sachem Node Architecture**

## 1.1. Introduction: The Consensus Engine

The Sachem Node acts as the distributed consensus and reputation management system within kOS. Its purpose is not to determine objective truth, but to facilitate a shared, working agreement among a swarm of independent agents. It is inspired by consensus protocols (like Raft or Paxos) but adapted for a "social" context of intelligent agents rather than just data replication. It provides the mechanisms for nodes to propose claims, vote on their validity, and establish a collective, trusted knowledge base.

## 1.2. Core Principles

-   **Facilitation over Dictatorship**: Sachem does not decide what is true. It provides a structured forum and a set of tools for the agent collective to come to an agreement.
-   **Reputation as a First-Class Citizen**: The trustworthiness of a node is a quantifiable metric that directly impacts the weight of its claims and votes. Reputation is earned, dynamic, and vital for a healthy information ecosystem.
-   **Provable Consensus**: All consensus events (called "Accords") are cryptographically signed, auditable, and stored as immutable records in the Yachay node.
-   **Dynamic Quorum**: The threshold for reaching consensus is not fixed. It can change based on the importance of the claim and the current stability of the network.

## 1.3. System Components Overview

1.  **Claim Intake Processor**: Receives `CONSENSUS_PROPOSE_CLAIM` messages from other nodes. It validates the claim's structure, logs it, and opens a new "Debate" period.
2.  **Debate Manager**: Orchestrates the process for a given claim. It sets the voting period duration, notifies relevant nodes (based on expertise tags), and collects incoming votes (`CONSENSUS_VOTE_CAST`).
3.  **Voting Engine**: The core logic for tallying votes. It weighs each vote based on the casting node's current Reputation Score.
4.  **Reputation Ledger**: A service that manages the reputation scores for all nodes in the system. It adjusts scores based on behavior (e.g., making claims that achieve consensus increases reputation; making claims that are rejected decreases it).
5.  **Accord Finalizer**: When a Debate period ends, this component tallies the weighted votes. If consensus is reached, it creates a formal `Accord` document. If it fails, it records the failure.
6.  **Yachay Archiver**: Responsible for sending all `Accord` documents and Debate records to the Yachay node for long-term, immutable storage.

## 1.4. The Consensus Lifecycle: From Claim to Accord

1.  **Claim Proposal**: A node (e.g., Hakim) analyzes data and forms a conclusion. It sends a `CONSENSUS_PROPOSE_CLAIM` message to Sachem. The claim is now in a `PENDING` state.
2.  **Debate Initiation**: Sachem's Debate Manager opens a voting window (e.g., 60 seconds). It notifies other nodes that a new claim is open for debate.
3.  **Voting**: Other nodes evaluate the claim and its evidence. They cast their votes (`FOR`, `AGAINST`, `ABSTAIN`) by sending `CONSENSUS_VOTE_CAST` messages. The Voting Engine collects these, weighting each one by the voter's reputation.
4.  **Tally & Finalization**: When the window closes, the Accord Finalizer tallies the weighted votes.
    -   **If `FOR > AGAINST` by a required margin (the dynamic quorum)**: The claim is accepted. An `Accord` is created and the claim's status becomes `ACCEPTED`.
    -   **If `AGAINST > FOR`**: The claim is rejected. The status becomes `REJECTED`.
5.  **Reputation Adjustment**: The Reputation Ledger adjusts the reputation of the proposing node and all voting nodes based on the outcome. Proposers of accepted claims gain reputation; proposers of rejected claims lose it. Voters who were on the "winning" side gain a small amount of reputation.
6.  **Archiving**: The final `Accord` (or the record of failure) and the entire debate history are sent to Yachay via a `YACHAY_STORE_REQUEST` for permanent storage. 