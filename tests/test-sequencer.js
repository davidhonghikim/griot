/**
 * Test Sequencer
 * 
 * Ensures tests run in logical order:
 * 1. Core services (PersonaLoader, EmbeddingService, VectorStore)
 * 2. Database integration
 * 3. End-to-end workflows
 */

import { TestSequencer } from '@jest/test-sequencer';

class CustomSequencer extends TestSequencer {
  sort(tests) {
    // Define test execution order
    const testOrder = [
      'persona-loader.test.ts',
      'embedding-service.test.ts', 
      'vector-store.test.ts',
      'database-integration.test.ts'
    ];

    return tests.sort((testA, testB) => {
      const testAIndex = testOrder.findIndex(pattern => 
        testA.path.includes(pattern)
      );
      const testBIndex = testOrder.findIndex(pattern => 
        testB.path.includes(pattern)
      );

      // If both tests are in the order list, sort by their position
      if (testAIndex !== -1 && testBIndex !== -1) {
        return testAIndex - testBIndex;
      }

      // If only one test is in the order list, prioritize it
      if (testAIndex !== -1) return -1;
      if (testBIndex !== -1) return 1;

      // For tests not in the order list, maintain original order
      return 0;
    });
  }
}

export default CustomSequencer; 