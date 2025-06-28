---
title: "Oracle Class: Data Models"
description: "Data models for the Oracle Node Class, including QueryJob and QueryResponse."
---

# Oracle Class Data Models

### 1. QueryJob
Represents a complex, asynchronous query submitted to the Oracle.

```json
{
  "job_id": "string (uuid)",
  "status": "pending | planning | executing | completed | failed",
  "query": {
    "dsl_version": "1.0",
    "query_string": "SELECT LATEST 10 FROM 'griot:articles' WHERE 'topic' == 'AI' JOIN 'tohunga:sentiments' ON 'article_id' RETURN 'title', 'sentiment_score'",
    "parameters": {
        // Optional parameters for parameterized queries
    }
  },
  "requester_did": "string (did:kos:...)",
  "created_at": "string (ISO 8601 timestamp)",
  "completed_at": "string (ISO 8601 timestamp, optional)"
}
```

### 2. QueryResponse
Represents the structured response to a `QueryJob`. This is a rich object containing not just the data, but also the explanation of how the data was derived.

```json
{
  "job_id": "string (uuid)",
  "status": "completed",
  "response": {
    "results": [
        {
            "title": "The Future of AI is Collaborative",
            "sentiment_score": 0.92
        },
        // ... more results
    ],
    "summary": {
        "result_count": 10,
        "execution_time_ms": 1250
    }
  },
  "explanation": {
      "confidence_score": 0.85,
      "sources": [
          {
            "node_did": "did:kos:griot:123",
            "asset_uri": "kos:entry/article/abc-123",
            "contribution": "Provided base article data."
          },
          {
            "node_did": "did:kos:tohunga:456",
            "asset_uri": "kos:asset/sentiment-analysis/def-456",
            "contribution": "Provided sentiment analysis for article."
          }
      ],
      "reasoning_trace": [
          "1. Parsed query and identified two data sources.",
          "2. Fetched 50 articles from 'griot:123' matching topic.",
          "3. Performed join against sentiment data from 'tohunga:456'.",
          "4. Sorted by date and returned top 10 with highest sentiment."
      ]
  }
}
``` 