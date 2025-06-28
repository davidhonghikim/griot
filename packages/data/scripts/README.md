README.md
README_Asset_Indexing.md
README_Persona_Loading.md
agent_bootstrap.py
asset_indexer.py
auto_index_hook.py
generic_price_aggregator.py
persona_loader_v2.py
price_aggregator.py
self_hosting_calculator.py
setup_pricing_rag.py
update_pricing.sh

# Data Scripts Index

- README_Asset_Indexing.md:
    # Asset Indexing System for kOS
    A comprehensive, chunked asset indexing system that provides efficient bootstrap loading and dynamic asset discovery for AI agents.
    ## 🎯 Overview

- README_Persona_Loading.md:
    # Persona-Driven Asset Loading System for kOS
    A sophisticated asset loading system that allows each persona to specify which assets to load by default, optimizing token usage and context windows for AI agents.
    ## 🎯 Overview

- agent_bootstrap.py:
    #!/usr/bin/env python3
    """
    Agent Bootstrap Loader for kOS
    Efficiently loads essential indexes and provides dynamic loading capabilities
    """

- asset_indexer.py:
    import json
    import os
    import yaml
    import logging
    from pathlib import Path

- auto_index_hook.py:
    #!/usr/bin/env python3
    """
    Auto-Indexing Hook for kOS
    Automatically updates indexes when files change
    """

- generic_price_aggregator.py:
    #!/usr/bin/env python3
    """
    Generic AI Provider Price Aggregator
    Dynamically scrapes pricing from any configured AI provider.
    """

- persona_loader_v2.py:
    #!/usr/bin/env python3
    """
    Persona-Driven Asset Loader v2 for kOS
    Loads assets based on persona configuration and preferences
    Works with sharded directory structure and UUIDv7 naming

- price_aggregator.py:
    #!/usr/bin/env python3
    """
    AI Provider Price Aggregator
    Scrapes pricing from various AI providers and updates the pricing configuration.
    """

- self_hosting_calculator.py:
    #!/usr/bin/env python3
    """
    Self-Hosting Cost Calculator
    Calculates and compares costs between self-hosting AI models and using cloud APIs.
    """

- setup_pricing_rag.py:
    #!/usr/bin/env python3
    """
    Setup script for RAG-based pricing system
    Initializes vector database and loads default pricing data
    """

- update_pricing.sh:
    #!/bin/bash
    # AI Pricing Update and Self-Hosting Calculator
    # Automates price aggregation and cost comparison

