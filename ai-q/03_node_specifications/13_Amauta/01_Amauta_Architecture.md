---
title: "Amauta Node 01: Architecture"
version: 1.0
---

# **1. Amauta Node Architecture**

## 1.1. Introduction: The Generative Teacher

The Amauta Node is a synthetic data generator and simulation environment provider for the kOS agent ecosystem. Its primary function is to facilitate proactive, supervised learning for other nodes. It does this by creating tailored "training curricula" in the form of `TrainingSet`s and "practice environments" in the form of `Simulation`s. It is the engine that drives continuous improvement and adaptation within the agent swarm.

## 1.2. Core Principles

-   **Learning by Generation**: Amauta is based on the principle that a system can learn more effectively if it can generate its own examples and test its own boundaries.
-   **Curriculum-Based Training**: Rather than just creating random data, Amauta builds structured `TrainingSet`s that can range from simple variations to complex, adversarial examples, allowing for a structured learning path.
-   **Simulation as Practice**: For process-oriented nodes like Archon, abstract data is insufficient. Amauta provides stateful, interactive `Simulation` environments where these nodes can practice their decision-making workflows.
-   **Performance-Driven Feedback**: Amauta's goal is to improve other nodes. It initiates a training cycle, but it then monitors the target node's performance on the generated data, creating a feedback loop for future curriculum development.

## 1.3. System Components Overview

1.  **Training Request Handler**: The entry point for other nodes. It receives a `AMAUTA_REQUEST_TRAINING` message, which specifies the target node, the skill to be improved, and performance goals.
2.  **Curriculum Generator**: Takes the training request and queries Yachay for relevant "seed" data (e.g., existing `MemoryTapestry` or `Accord` documents). It then uses generative models (e.g., a GAN, VAE, or a fine-tuned LLM) to create a `TrainingSet` of synthetic data.
3.  **Simulation Engine**: For requests involving workflow practice, this component spins up a simulated environment. This could involve creating mock versions of other kOS nodes or simulating external network conditions.
4.  **Training Orchestrator**: Manages the training lifecycle. It dispatches the `TrainingSet` to the target node (the "student"), sends evaluation metrics, and collects the results.
5.  **Performance Analyzer**: Receives the training results from the student node. It compares the student's performance against the ground truth of the synthetic data and generates a `PerformanceReport`.
6.  **Model Updater (Internal)**: The Amauta node's own generative models are not static. This internal service uses the `PerformanceReport` to fine-tune its own generators, allowing it to create more effective training curricula over time.

## 1.4. The Training Lifecycle

1.  **Request**: An Archon node, noticing that a Hakim node is performing poorly on a certain class of analysis, sends an `AMAUTA_REQUEST_TRAINING` message to Amauta.
2.  **Curriculum Generation**: The Curriculum Generator pulls relevant, real examples from Yachay. It then uses its internal generative models to create a new `TrainingSet` containing hundreds of synthetic examples, some with known adversarial perturbations.
3.  **Training**: The Training Orchestrator sends a `AMAUTA_DISPATCH_TRAINING_SET` message to the target Hakim node. The Hakim node processes this data.
4.  **Evaluation**: The Hakim node sends its analysis of the training data back to Amauta via an `AMAUTA_SUBMIT_TRAINING_RESULTS` message.
5.  **Analysis & Reporting**: The Performance Analyzer compares the Hakim node's results to the known ground truth of the synthetic data. It generates a `PerformanceReport` detailing accuracy, precision, recall, and identifying specific weaknesses.
6.  **Feedback**: The `PerformanceReport` is sent back to the requesting Archon node, which can now make a more informed decision (e.g., re-assigning tasks, requesting further training).
7.  **Self-Improvement**: The `PerformanceReport` is also fed to Amauta's internal Model Updater, which may fine-tune the generative model that created the `TrainingSet` to be more effective in the future. 