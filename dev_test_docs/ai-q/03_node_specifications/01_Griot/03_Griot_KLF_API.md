---
title: "Griot Node KLF API"
version: 2.0
---

# **Griot Node KLF API**

## **Purpose**

The Griot Node exposes its artifact management and generation capabilities through a comprehensive KLF API. This API enables other nodes to store artifacts, coordinate generation requests, and manage the complete lifecycle of digital content.

## **Core API Operations**

### **1. Artifact Storage Operations**

#### **Store Artifact**
```typescript
// Request: Store a new artifact
interface StoreArtifactRequest {
  messageType: "GRIOT_STORE_REQUEST";
  payload: {
    artifactType: "image" | "video" | "audio" | "document" | "data";
    content: Buffer | string; // File content or URL
    metadata: {
      name: string;
      description?: string;
      tags?: string[];
      source?: string; // What created this artifact
      parentArtifacts?: string[]; // Related artifacts
    };
    accessControl: {
      visibility: "public" | "private" | "organization";
      organizationId?: string;
    };
    storageOptions?: {
      backend: "local" | "s3" | "ipfs";
      compression?: boolean;
      encryption?: boolean;
    };
  };
}

// Response: Artifact stored successfully
interface StoreArtifactResponse {
  messageType: "GRIOT_STORE_CONFIRM";
  payload: {
    artifactId: string;
    url: string;
    size: number;
    checksum: string;
    storageLocation: string;
    accessUrl: string;
  };
}
```

#### **Retrieve Artifact**
```typescript
// Request: Retrieve an artifact
interface RetrieveArtifactRequest {
  messageType: "GRIOT_RETRIEVE_REQUEST";
  payload: {
    artifactId: string;
    includeMetadata?: boolean;
    downloadFormat?: "original" | "compressed" | "thumbnail";
  };
}

// Response: Artifact retrieved
interface RetrieveArtifactResponse {
  messageType: "GRIOT_RETRIEVE_RESPONSE";
  payload: {
    artifactId: string;
    content: Buffer | string;
    metadata: ArtifactMetadata;
    url: string;
    size: number;
    checksum: string;
  };
}
```

### **2. Generation Operations**

#### **Generate Image**
```typescript
// Request: Generate image from prompt
interface GenerateImageRequest {
  messageType: "GRIOT_GENERATE_IMAGE_REQUEST";
  payload: {
    prompt: string;
    options: {
      style?: "photorealistic" | "artistic" | "cartoon" | "abstract";
      size?: "512x512" | "1024x1024" | "1920x1080" | "custom";
      aspectRatio?: "1:1" | "16:9" | "4:3" | "custom";
      quality?: "draft" | "standard" | "high" | "ultra";
      service?: "stable-diffusion" | "dalle" | "midjourney";
    };
    safetyChecks?: {
      contentFilter: boolean;
      styleFilter: boolean;
      brandFilter: boolean;
    };
  };
}

// Progress: Generation in progress
interface GenerateImageProgress {
  messageType: "GRIOT_GENERATE_IMAGE_PROGRESS";
  payload: {
    requestId: string;
    status: "queued" | "processing" | "generating" | "finalizing";
    progress: number; // 0-100
    estimatedTimeRemaining?: number;
    currentStep?: string;
  };
}

// Response: Image generated successfully
interface GenerateImageResponse {
  messageType: "GRIOT_GENERATE_IMAGE_RESPONSE";
  payload: {
    requestId: string;
    artifactId: string;
    url: string;
    prompt: string;
    generationTime: number;
    service: string;
    metadata: {
      model: string;
      parameters: Record<string, any>;
      safetyScore: number;
    };
  };
}
```

#### **Create Video**
```typescript
// Request: Create video from assets
interface CreateVideoRequest {
  messageType: "GRIOT_CREATE_VIDEO_REQUEST";
  payload: {
    assets: {
      images?: string[]; // Artifact IDs or URLs
      audio?: string[]; // Artifact IDs or URLs
      text?: string[]; // Text overlays
    };
    options: {
      duration: number; // seconds
      format: "mp4" | "mov" | "avi" | "webm";
      resolution: "720p" | "1080p" | "4k";
      fps: 24 | 30 | 60;
      quality: "draft" | "standard" | "high";
      transitions?: TransitionConfig[];
      effects?: EffectConfig[];
    };
    timeline?: {
      segments: VideoSegment[];
    };
  };
}

interface VideoSegment {
  startTime: number;
  duration: number;
  assetId: string;
  assetType: "image" | "audio" | "text";
  effects?: EffectConfig[];
}

// Response: Video created successfully
interface CreateVideoResponse {
  messageType: "GRIOT_CREATE_VIDEO_RESPONSE";
  payload: {
    requestId: string;
    artifactId: string;
    url: string;
    duration: number;
    size: number;
    format: string;
    resolution: string;
    processingTime: number;
  };
}
```

#### **Complete Production Pipeline**
```typescript
// Request: Complete video production pipeline
interface ProductionPipelineRequest {
  messageType: "GRIOT_PRODUCTION_PIPELINE_REQUEST";
  payload: {
    script: string;
    options: {
      visualStyle: "professional" | "casual" | "creative" | "minimal";
      duration: number;
      includeTranscription: boolean;
      includeSubtitles: boolean;
      voiceStyle?: "male" | "female" | "neutral";
      backgroundMusic?: boolean;
      effects?: boolean;
    };
    assets?: {
      backgroundImages?: string[];
      music?: string[];
      logos?: string[];
    };
  };
}

// Progress: Pipeline execution progress
interface ProductionPipelineProgress {
  messageType: "GRIOT_PRODUCTION_PIPELINE_PROGRESS";
  payload: {
    requestId: string;
    status: "script-processing" | "voice-generation" | "video-creation" | "transcription" | "final-assembly";
    progress: number;
    currentStep: string;
    estimatedTimeRemaining?: number;
    intermediateResults?: {
      audioId?: string;
      videoId?: string;
      transcriptId?: string;
    };
  };
}

// Response: Complete production package
interface ProductionPipelineResponse {
  messageType: "GRIOT_PRODUCTION_PIPELINE_RESPONSE";
  payload: {
    requestId: string;
    package: {
      videoId: string;
      audioId: string;
      transcriptId?: string;
      subtitlesId?: string;
      thumbnailId: string;
    };
    urls: {
      video: string;
      audio: string;
      transcript?: string;
      subtitles?: string;
      thumbnail: string;
    };
    metadata: {
      duration: number;
      wordCount: number;
      processingTime: number;
      services: string[];
    };
  };
}
```

### **3. Artifact Management Operations**

#### **List Artifacts**
```typescript
// Request: List artifacts with filters
interface ListArtifactsRequest {
  messageType: "GRIOT_LIST_ARTIFACTS_REQUEST";
  payload: {
    filters?: {
      type?: "image" | "video" | "audio" | "document" | "data";
      tags?: string[];
      dateRange?: {
        start: Date;
        end: Date;
      };
      sizeRange?: {
        min: number;
        max: number;
      };
      visibility?: "public" | "private" | "organization";
    };
    pagination?: {
      page: number;
      limit: number;
      sortBy?: "created" | "size" | "name";
      sortOrder?: "asc" | "desc";
    };
  };
}

// Response: List of artifacts
interface ListArtifactsResponse {
  messageType: "GRIOT_LIST_ARTIFACTS_RESPONSE";
  payload: {
    artifacts: ArtifactSummary[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

interface ArtifactSummary {
  artifactId: string;
  name: string;
  type: string;
  size: number;
  url: string;
  createdAt: Date;
  tags: string[];
  visibility: string;
}
```

#### **Update Artifact**
```typescript
// Request: Update artifact metadata
interface UpdateArtifactRequest {
  messageType: "GRIOT_UPDATE_ARTIFACT_REQUEST";
  payload: {
    artifactId: string;
    updates: {
      name?: string;
      description?: string;
      tags?: string[];
      visibility?: "public" | "private" | "organization";
      metadata?: Record<string, any>;
    };
  };
}

// Response: Artifact updated
interface UpdateArtifactResponse {
  messageType: "GRIOT_UPDATE_ARTIFACT_RESPONSE";
  payload: {
    artifactId: string;
    updated: boolean;
    metadata: ArtifactMetadata;
  };
}
```

#### **Delete Artifact**
```typescript
// Request: Delete artifact
interface DeleteArtifactRequest {
  messageType: "GRIOT_DELETE_ARTIFACT_REQUEST";
  payload: {
    artifactId: string;
    force?: boolean; // Delete even if referenced by other artifacts
  };
}

// Response: Artifact deleted
interface DeleteArtifactResponse {
  messageType: "GRIOT_DELETE_ARTIFACT_RESPONSE";
  payload: {
    artifactId: string;
    deleted: boolean;
    cleanupRequired?: string[]; // Other artifacts that need cleanup
  };
}
```

### **4. Error Handling**

#### **Error Response**
```typescript
interface GriotErrorResponse {
  messageType: "GRIOT_ERROR";
  payload: {
    requestId?: string;
    errorCode: GriotErrorCode;
    message: string;
    details?: Record<string, any>;
    retryable: boolean;
    retryAfter?: number; // seconds
  };
}

enum GriotErrorCode {
  // Storage errors
  STORAGE_FULL = "storage_full",
  STORAGE_UNAVAILABLE = "storage_unavailable",
  FILE_TOO_LARGE = "file_too_large",
  INVALID_FILE_TYPE = "invalid_file_type",
  
  // Generation errors
  GENERATION_FAILED = "generation_failed",
  GENERATION_TIMEOUT = "generation_timeout",
  INVALID_PROMPT = "invalid_prompt",
  CONTENT_FILTERED = "content_filtered",
  SERVICE_UNAVAILABLE = "service_unavailable",
  
  // Artifact errors
  ARTIFACT_NOT_FOUND = "artifact_not_found",
  ARTIFACT_CORRUPTED = "artifact_corrupted",
  ACCESS_DENIED = "access_denied",
  QUOTA_EXCEEDED = "quota_exceeded",
  
  // System errors
  INTERNAL_ERROR = "internal_error",
  CONFIGURATION_ERROR = "configuration_error",
  RATE_LIMIT_EXCEEDED = "rate_limit_exceeded"
}
```

## **Real-World Usage Examples**

### **Example 1: Generate and Store Image**
```typescript
// 1. Request image generation
const generateRequest: GenerateImageRequest = {
  messageType: "GRIOT_GENERATE_IMAGE_REQUEST",
  payload: {
    prompt: "A serene mountain landscape at sunset",
    options: {
      style: "photorealistic",
      size: "1024x1024",
      quality: "high"
    }
  }
};

// 2. Receive progress updates
const progress: GenerateImageProgress = {
  messageType: "GRIOT_GENERATE_IMAGE_PROGRESS",
  payload: {
    requestId: "req_123",
    status: "generating",
    progress: 75,
    estimatedTimeRemaining: 15
  }
};

// 3. Receive final result
const result: GenerateImageResponse = {
  messageType: "GRIOT_GENERATE_IMAGE_RESPONSE",
  payload: {
    requestId: "req_123",
    artifactId: "img_456",
    url: "https://storage.example.com/images/img_456.jpg",
    prompt: "A serene mountain landscape at sunset",
    generationTime: 45,
    service: "stable-diffusion"
  }
};
```

### **Example 2: Create Video from Assets**
```typescript
// 1. Request video creation
const videoRequest: CreateVideoRequest = {
  messageType: "GRIOT_CREATE_VIDEO_REQUEST",
  payload: {
    assets: {
      images: ["img_456", "img_789"],
      audio: ["aud_123"]
    },
    options: {
      duration: 30,
      format: "mp4",
      resolution: "1080p",
      fps: 30,
      quality: "high"
    }
  }
};

// 2. Receive result
const videoResult: CreateVideoResponse = {
  messageType: "GRIOT_CREATE_VIDEO_RESPONSE",
  payload: {
    requestId: "req_789",
    artifactId: "vid_101",
    url: "https://storage.example.com/videos/vid_101.mp4",
    duration: 30,
    size: 15728640, // 15MB
    format: "mp4",
    resolution: "1080p",
    processingTime: 180
  }
};
```

### **Example 3: Complete Production Pipeline**
```typescript
// 1. Request complete production
const productionRequest: ProductionPipelineRequest = {
  messageType: "GRIOT_PRODUCTION_PIPELINE_REQUEST",
  payload: {
    script: "Welcome to our presentation on AI innovation...",
    options: {
      visualStyle: "professional",
      duration: 60,
      includeTranscription: true,
      includeSubtitles: true,
      voiceStyle: "female"
    }
  }
};

// 2. Receive progress updates
const pipelineProgress: ProductionPipelineProgress = {
  messageType: "GRIOT_PRODUCTION_PIPELINE_PROGRESS",
  payload: {
    requestId: "req_202",
    status: "video-creation",
    progress: 60,
    currentStep: "Rendering video with audio synchronization",
    estimatedTimeRemaining: 120,
    intermediateResults: {
      audioId: "aud_456",
      videoId: "vid_789"
    }
  }
};

// 3. Receive complete package
const productionResult: ProductionPipelineResponse = {
  messageType: "GRIOT_PRODUCTION_PIPELINE_RESPONSE",
  payload: {
    requestId: "req_202",
    package: {
      videoId: "vid_101",
      audioId: "aud_456",
      transcriptId: "txt_789",
      subtitlesId: "sub_101",
      thumbnailId: "thumb_101"
    },
    urls: {
      video: "https://storage.example.com/videos/vid_101.mp4",
      audio: "https://storage.example.com/audio/aud_456.mp3",
      transcript: "https://storage.example.com/texts/txt_789.txt",
      subtitles: "https://storage.example.com/subtitles/sub_101.srt",
      thumbnail: "https://storage.example.com/thumbnails/thumb_101.jpg"
    },
    metadata: {
      duration: 60,
      wordCount: 150,
      processingTime: 300,
      services: ["elevenlabs", "runwayml", "whisper"]
    }
  }
};
```

## **Performance Characteristics**

### **Response Times**
- **Simple Storage Operations**: < 100ms
- **Image Generation**: 30-60 seconds
- **Video Creation**: 2-10 minutes
- **Production Pipeline**: 5-15 minutes

### **Throughput**
- **Concurrent Requests**: 100+
- **Storage Operations**: 1000+ per second
- **Generation Requests**: 10+ concurrent
- **Pipeline Requests**: 5+ concurrent

### **Reliability**
- **Uptime**: 99.9%
- **Error Rate**: < 0.1%
- **Recovery Time**: < 30 seconds
- **Data Durability**: 99.999999%

## **Security and Compliance**

### **Access Control**
- **Authentication**: Required for all operations
- **Authorization**: Role-based access control
- **Audit Logging**: All operations logged
- **Data Encryption**: At rest and in transit

### **Content Safety**
- **Prompt Filtering**: Automatic content filtering
- **Output Validation**: Generated content validation
- **Rate Limiting**: Per-user and per-organization limits
- **Quota Management**: Storage and generation quotas

---

**Version**: 2.0  
**Focus**: Practical artifact management and generation coordination 