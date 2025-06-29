version: '3.8'
services:
  griot-node-1:
    build: ./griot
    ports:
      - "3001:3000"
    environment:
      - NODE_ID=node-griot-1
      - VECTOR_BACKEND=weaviate
      - MONGO_URI=mongodb://mongo:27017
      - RETICULUM_ENABLED=true
    networks:
      - kos_network

  griot-node-2:
    build: ./griot
    ports:
      - "3002:3000"
    environment:
      - NODE_ID=node-griot-2
      - VECTOR_BACKEND=pgvector
      - MONGO_URI=mongodb://mongo:27017
      - RETICULUM_ENABLED=true
    networks:
      - kos_network

  mongo:
    image: mongo:6
    ports:
      - "27017:27017"
    networks:
      - kos_network

  weaviate:
    image: semitechnologies/weaviate:latest
    ports:
      - "8080:8080"
    environment:
      - QUERY_DEFAULTS_LIMIT=25
      - AUTHENTICATION_ANONYMOUS_ACCESS_ENABLED=true
    networks:
      - kos_network

  neo4j:
    image: neo4j:5-community
    ports:
      - "7474:7474"
      - "7687:7687"
    environment:
      - NEO4J_AUTH=neo4j/password
    networks:
      - kos_network

networks:
  kos_network:
    driver: bridge

conclusion:
  summary: "This Docker Compose YAML provisions a multi-node GKM simulation environment with MongoDB, Weaviate, Neo4j, and two Griot nodes running on separate ports and configured for Reticulum readiness."

