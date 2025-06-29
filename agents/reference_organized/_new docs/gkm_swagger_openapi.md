openapi: "3.0.0"
info:
  title: "kOS GKM API"
  version: "1.0.0"
paths:
  /transport/reticulum/send:
    post:
      summary: "Send KLF message over Reticulum"
      requestBody:
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/KLFMessage"
      responses:
        '202':
          description: "Accepted"

  /vector/federated-search:
    post:
      summary: "Federated Vector Query"
      requestBody:
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/FederatedVectorQueryRequest"
      responses:
        '200':
          description: "Query Results"
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/FederatedVectorQueryResponse"

  /node/announce:
    post:
      summary: "Node Announcement"
      requestBody:
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/NodeDescriptor"
      responses:
        '200':
          description: "Acknowledged"

  /sync/push:
    post:
      summary: "Push Sync Events"
      requestBody:
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/SyncEventArray"
      responses:
        '202':
          description: "Sync Accepted"

  /mesh/health:
    get:
      summary: "Get Mesh Health"
      responses:
        '200':
          description: "Health Status"
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/NodeHealthReportArray"

components:
  schemas:
    KLFMessage:
      type: object
      properties:
        type:
          type: string
        payload:
          type: object

    FederatedVectorQueryRequest:
      type: object
      properties:
        queryText:
          type: string
        maxResults:
          type: integer

    FederatedVectorQueryResponse:
      type: object
      properties:
        results:
          type: array
          items:
            type: object
            properties:
              content:
                type: string
              similarity:
                type: number

    NodeDescriptor:
      type: object
      properties:
        node_id:
          type: string
        capabilities:
          type: array
          items:
            type: string

    SyncEventArray:
      type: array
      items:
        type: object
        properties:
          event_id:
            type: string
          event_type:
            type: string
          payload:
            type: object

    NodeHealthReportArray:
      type: array
      items:
        type: object
        properties:
          node_id:
            type: string
          status:
            type: string
          latency:
            type: number
          last_seen:
            type: string

conclusion:
  summary: "This OpenAPI YAML provides the Swagger specification for the kOS GKM service layer, suitable for automated API documentation and client generation."

