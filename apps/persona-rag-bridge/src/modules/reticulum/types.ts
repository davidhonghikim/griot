/**
 * Reticulum Encrypted Communication Types
 * 
 * Defines the types and interfaces for the Reticulum mesh network
 * communication system with end-to-end encryption.
 */

// =============================================================================
// CORE TYPES
// =============================================================================

export interface ReticulumNode {
  id: string;
  name: string;
  type: 'client' | 'server' | 'relay';
  version: string;
  capabilities: string[];
  address: ReticulumAddress;
  publicKey: string;
  lastSeen: Date;
  status: 'online' | 'offline' | 'unreachable';
}

export interface ReticulumAddress {
  host: string;
  port: number;
  protocol: 'udp' | 'tcp' | 'websocket';
  encrypted: boolean;
}

export interface ReticulumMessage {
  id: string;
  type: 'data' | 'control' | 'discovery' | 'routing';
  source: string;
  destination: string;
  payload: any;
  timestamp: Date;
  ttl: number;
  hops: number;
  encrypted: boolean;
  signature?: string;
}

export interface ReticulumPacket {
  header: ReticulumPacketHeader;
  payload: Buffer;
  signature?: Buffer;
}

export interface ReticulumPacketHeader {
  version: number;
  type: ReticulumPacketType;
  source: string;
  destination: string;
  timestamp: number;
  ttl: number;
  hops: number;
  flags: ReticulumPacketFlags;
  payloadLength: number;
}

export enum ReticulumPacketType {
  DATA = 0x01,
  CONTROL = 0x02,
  DISCOVERY = 0x03,
  ROUTING = 0x04,
  ENCRYPTED = 0x05,
  FRAGMENT = 0x06,
}

export interface ReticulumPacketFlags {
  encrypted: boolean;
  compressed: boolean;
  fragmented: boolean;
  acknowledged: boolean;
  priority: number;
}

// =============================================================================
// ENCRYPTION TYPES
// =============================================================================

export interface ReticulumKeyPair {
  publicKey: Buffer;
  privateKey: Buffer;
  algorithm: 'rsa' | 'ed25519' | 'x25519';
  keySize: number;
}

export interface ReticulumSymmetricKey {
  key: Buffer;
  algorithm: 'aes-256-gcm' | 'chacha20-poly1305';
  nonce: Buffer;
}

export interface ReticulumEncryptedData {
  encryptedPayload: Buffer;
  iv: Buffer;
  tag: Buffer;
  algorithm: string;
  keyId: string;
}

export interface ReticulumKeyExchange {
  initiator: string;
  responder: string;
  ephemeralKey: Buffer;
  sharedSecret: Buffer;
  timestamp: Date;
  expiresAt: Date;
}

// =============================================================================
// DISCOVERY TYPES
// =============================================================================

export interface ReticulumDiscoveryMessage {
  type: 'announce' | 'query' | 'response';
  node: ReticulumNode;
  network: string;
  timestamp: Date;
  ttl: number;
}

export interface ReticulumDiscoveryQuery {
  network: string;
  nodeTypes?: string[];
  capabilities?: string[];
  maxResults?: number;
  timeout?: number;
}

export interface ReticulumDiscoveryResponse {
  nodes: ReticulumNode[];
  total: number;
  queryId: string;
  timestamp: Date;
}

// =============================================================================
// ROUTING TYPES
// =============================================================================

export interface ReticulumRoute {
  destination: string;
  nextHop: string;
  cost: number;
  hops: number;
  lastUpdated: Date;
  expiresAt: Date;
  reliable: boolean;
}

export interface ReticulumRoutingTable {
  routes: Map<string, ReticulumRoute>;
  lastUpdated: Date;
  version: number;
}

export interface ReticulumRoutingUpdate {
  type: 'add' | 'remove' | 'update';
  route: ReticulumRoute;
  timestamp: Date;
  source: string;
}

// =============================================================================
// COMMUNICATION TYPES
// =============================================================================

export interface ReticulumConnection {
  id: string;
  remoteNode: string;
  localAddress: ReticulumAddress;
  remoteAddress: ReticulumAddress;
  status: 'connecting' | 'connected' | 'disconnected' | 'error';
  encrypted: boolean;
  establishedAt: Date;
  lastActivity: Date;
  statistics: ReticulumConnectionStats;
}

export interface ReticulumConnectionStats {
  bytesSent: number;
  bytesReceived: number;
  packetsSent: number;
  packetsReceived: number;
  errors: number;
  latency: number;
}

export interface ReticulumChannel {
  id: string;
  name: string;
  type: 'reliable' | 'unreliable' | 'ordered';
  encryption: boolean;
  compression: boolean;
  maxMessageSize: number;
  subscribers: string[];
  messages: ReticulumMessage[];
}

// =============================================================================
// EVENT TYPES
// =============================================================================

export interface ReticulumEvent {
  type: ReticulumEventType;
  data: any;
  timestamp: Date;
  source?: string;
}

export enum ReticulumEventType {
  NODE_DISCOVERED = 'node_discovered',
  NODE_LOST = 'node_lost',
  MESSAGE_RECEIVED = 'message_received',
  MESSAGE_SENT = 'message_sent',
  CONNECTION_ESTABLISHED = 'connection_established',
  CONNECTION_LOST = 'connection_lost',
  ROUTE_ADDED = 'route_added',
  ROUTE_REMOVED = 'route_removed',
  ENCRYPTION_KEY_EXCHANGED = 'encryption_key_exchanged',
  ERROR = 'error',
}

// =============================================================================
// CONFIGURATION TYPES
// =============================================================================

export interface ReticulumConfig {
  nodeId: string;
  networkName: string;
  discovery: ReticulumDiscoveryConfig;
  communication: ReticulumCommunicationConfig;
  encryption: ReticulumEncryptionConfig;
  routing: ReticulumRoutingConfig;
}

export interface ReticulumDiscoveryConfig {
  enabled: boolean;
  port: number;
  interval: number;
  timeout: number;
  broadcast: boolean;
  maxNodes: number;
}

export interface ReticulumCommunicationConfig {
  port: number;
  timeout: number;
  retries: number;
  maxConnections: number;
  keepAlive: boolean;
  keepAliveInterval: number;
}

export interface ReticulumEncryptionConfig {
  enabled: boolean;
  keyDerivationIterations: number;
  symmetricKeySize: number;
  asymmetricKeySize: number;
  keyExchangeTimeout: number;
  keyRotationInterval: number;
}

export interface ReticulumRoutingConfig {
  enabled: boolean;
  timeout: number;
  retries: number;
  maxHops: number;
  routeTimeout: number;
  routeRefreshInterval: number;
}

// =============================================================================
// API TYPES
// =============================================================================

export interface ReticulumAPI {
  // Node Management
  getNodeId(): string;
  getNodeInfo(): ReticulumNode;
  updateNodeInfo(info: Partial<ReticulumNode>): Promise<void>;
  
  // Discovery
  startDiscovery(): Promise<void>;
  stopDiscovery(): Promise<void>;
  discoverNodes(query?: ReticulumDiscoveryQuery): Promise<ReticulumNode[]>;
  announceNode(): Promise<void>;
  
  // Communication
  sendMessage(destination: string, payload: any, options?: ReticulumSendOptions): Promise<string>;
  broadcastMessage(payload: any, options?: ReticulumSendOptions): Promise<string[]>;
  subscribeToChannel(channelId: string): Promise<void>;
  unsubscribeFromChannel(channelId: string): Promise<void>;
  
  // Routing
  getRoutes(): ReticulumRoute[];
  addRoute(route: ReticulumRoute): Promise<void>;
  removeRoute(destination: string): Promise<void>;
  
  // Encryption
  generateKeyPair(): Promise<ReticulumKeyPair>;
  exchangeKeys(remoteNode: string): Promise<ReticulumKeyExchange>;
  encryptData(data: Buffer, key: ReticulumSymmetricKey): Promise<ReticulumEncryptedData>;
  decryptData(encryptedData: ReticulumEncryptedData, key: ReticulumSymmetricKey): Promise<Buffer>;
  
  // Events
  on(event: ReticulumEventType, handler: (event: ReticulumEvent) => void): void;
  off(event: ReticulumEventType, handler: (event: ReticulumEvent) => void): void;
  
  // Lifecycle
  start(): Promise<void>;
  stop(): Promise<void>;
  isRunning(): boolean;
}

export interface ReticulumSendOptions {
  encrypted?: boolean;
  reliable?: boolean;
  priority?: number;
  timeout?: number;
  retries?: number;
  ttl?: number;
}

// =============================================================================
// ERROR TYPES
// =============================================================================

export class ReticulumError extends Error {
  constructor(
    message: string,
    public code: ReticulumErrorCode,
    public details?: any
  ) {
    super(message);
    this.name = 'ReticulumError';
  }
}

export enum ReticulumErrorCode {
  NODE_NOT_FOUND = 'NODE_NOT_FOUND',
  ROUTE_NOT_FOUND = 'ROUTE_NOT_FOUND',
  CONNECTION_FAILED = 'CONNECTION_FAILED',
  ENCRYPTION_FAILED = 'ENCRYPTION_FAILED',
  DECRYPTION_FAILED = 'DECRYPTION_FAILED',
  KEY_EXCHANGE_FAILED = 'KEY_EXCHANGE_FAILED',
  MESSAGE_TOO_LARGE = 'MESSAGE_TOO_LARGE',
  TIMEOUT = 'TIMEOUT',
  INVALID_MESSAGE = 'INVALID_MESSAGE',
  NETWORK_ERROR = 'NETWORK_ERROR',
}

// =============================================================================
// UTILITY TYPES
// =============================================================================

export interface ReticulumMetrics {
  nodesDiscovered: number;
  messagesSent: number;
  messagesReceived: number;
  bytesSent: number;
  bytesReceived: number;
  errors: number;
  uptime: number;
  connections: number;
  routes: number;
}

export interface ReticulumStatus {
  running: boolean;
  nodeId: string;
  networkName: string;
  discoveredNodes: number;
  activeConnections: number;
  routes: number;
  uptime: number;
  lastActivity: Date;
  errors: ReticulumError[];
} 