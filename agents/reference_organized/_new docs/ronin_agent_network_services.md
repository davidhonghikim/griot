---
title: "Ronin Agent Network Services"
description: |
  Specification for the services offered by the Ronin Node to other kOS agents, enabling them to query, analyze, and utilize the underlying network data and routing logic.

service_types:
  - Network Path Recommendation
  - Link Health Status
  - Topology Snapshot Export
  - Active Node List
  - Federation Reachability Status

api_endpoints:
  - /agent_get_best_path
  - /agent_get_link_health
  - /agent_get_topology_snapshot
  - /agent_get_active_node_list
  - /agent_check_federation_status

agent_integration_patterns:
  - On-demand API calls by agents before outbound communication
  - Scheduled health polling by agents for mission-critical tasks
  - Auto-triggered network re-check after agent-detected failure

security_and_rate_limiting:
  - Token-authenticated API access for agents
  - Role-based query permissions
  - Rate limit profiles per agent class

future_services:
  - Agent-specific routing profiles
  - Proactive route suggestion broadcasts
  - Cross-agent collaboration API for joint network decisions

...

