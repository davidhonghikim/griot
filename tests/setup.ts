/**
 * Jest Test Setup
 * 
 * Global setup for integration tests
 */

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/griot-node-test';
process.env.WEAVIATE_HOST = process.env.WEAVIATE_HOST || 'localhost:8080';
process.env.WEAVIATE_SCHEME = process.env.WEAVIATE_SCHEME || 'http';

// Global test timeout
jest.setTimeout(30000);

// Suppress console logs during tests unless there's an error
const originalConsoleLog = console.log;
const originalConsoleWarn = console.warn;
const originalConsoleError = console.error;

beforeAll(() => {
  // Suppress logs during tests
  console.log = jest.fn();
  console.warn = jest.fn();
  console.error = jest.fn();
});

afterAll(() => {
  // Restore console functions
  console.log = originalConsoleLog;
  console.warn = originalConsoleWarn;
  console.error = originalConsoleError;
});

// Global error handler for unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Global error handler for uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
}); 