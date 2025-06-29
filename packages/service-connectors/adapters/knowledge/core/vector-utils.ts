/**
 * Vector utilities for embedding operations
 * Provides mathematical operations for vector similarity and manipulation
 */

import { Vector } from './interfaces';

export class VectorUtils {
  /**
   * Calculate cosine similarity between two vectors
   */
  static cosineSimilarity(vector1: Vector, vector2: Vector): number {
    if (vector1.dimension !== vector2.dimension) {
      throw new Error(`Vector dimensions must match: ${vector1.dimension} vs ${vector2.dimension}`);
    }

    const dotProduct = this.dotProduct(vector1, vector2);
    const norm1 = this.norm(vector1);
    const norm2 = this.norm(vector2);

    if (norm1 === 0 || norm2 === 0) {
      return 0;
    }

    return dotProduct / (norm1 * norm2);
  }

  /**
   * Calculate dot product of two vectors
   */
  static dotProduct(vector1: Vector, vector2: Vector): number {
    if (vector1.dimension !== vector2.dimension) {
      throw new Error(`Vector dimensions must match: ${vector1.dimension} vs ${vector2.dimension}`);
    }

    let result = 0;
    for (let i = 0; i < vector1.dimension; i++) {
      result += vector1.values[i]! * vector2.values[i]!;
    }
    return result;
  }

  /**
   * Calculate L2 norm (magnitude) of a vector
   */
  static norm(vector: Vector): number {
    let sum = 0;
    for (let i = 0; i < vector.dimension; i++) {
      sum += vector.values[i]! * vector.values[i]!;
    }
    return Math.sqrt(sum);
  }

  /**
   * Calculate Euclidean distance between two vectors
   */
  static euclideanDistance(vector1: Vector, vector2: Vector): number {
    if (vector1.dimension !== vector2.dimension) {
      throw new Error(`Vector dimensions must match: ${vector1.dimension} vs ${vector2.dimension}`);
    }

    let sum = 0;
    for (let i = 0; i < vector1.dimension; i++) {
      const diff = vector1.values[i]! - vector2.values[i]!;
      sum += diff * diff;
    }
    return Math.sqrt(sum);
  }

  /**
   * Normalize a vector to unit length
   */
  static normalize(vector: Vector): Vector {
    const norm = this.norm(vector);
    if (norm === 0) {
      return vector; // Return original vector if it's zero
    }

    const normalizedValues = new Array(vector.dimension);
    for (let i = 0; i < vector.dimension; i++) {
      normalizedValues[i] = vector.values[i]! / norm;
    }

    return {
      values: normalizedValues,
      dimension: vector.dimension
    };
  }

  /**
   * Add two vectors
   */
  static add(vector1: Vector, vector2: Vector): Vector {
    if (vector1.dimension !== vector2.dimension) {
      throw new Error(`Vector dimensions must match: ${vector1.dimension} vs ${vector2.dimension}`);
    }

    const result = new Array(vector1.dimension);
    for (let i = 0; i < vector1.dimension; i++) {
      result[i] = vector1.values[i]! + vector2.values[i]!;
    }

    return {
      values: result,
      dimension: vector1.dimension
    };
  }

  /**
   * Subtract vector2 from vector1
   */
  static subtract(vector1: Vector, vector2: Vector): Vector {
    if (vector1.dimension !== vector2.dimension) {
      throw new Error(`Vector dimensions must match: ${vector1.dimension} vs ${vector2.dimension}`);
    }

    const result = new Array(vector1.dimension);
    for (let i = 0; i < vector1.dimension; i++) {
      result[i] = vector1.values[i]! - vector2.values[i]!;
    }

    return {
      values: result,
      dimension: vector1.dimension
    };
  }

  /**
   * Multiply vector by scalar
   */
  static scale(vector: Vector, scalar: number): Vector {
    const result = new Array(vector.dimension);
    for (let i = 0; i < vector.dimension; i++) {
      result[i] = vector.values[i]! * scalar;
    }

    return {
      values: result,
      dimension: vector.dimension
    };
  }

  /**
   * Create a zero vector of given dimension
   */
  static zero(dimension: number): Vector {
    return {
      values: new Array(dimension).fill(0),
      dimension
    };
  }

  /**
   * Create a random vector of given dimension
   */
  static random(dimension: number, min: number = -1, max: number = 1): Vector {
    const values = new Array(dimension);
    for (let i = 0; i < dimension; i++) {
      values[i] = min + Math.random() * (max - min);
    }

    return {
      values,
      dimension
    };
  }

  /**
   * Check if two vectors are equal
   */
  static equals(vector1: Vector, vector2: Vector, tolerance: number = 1e-10): boolean {
    if (vector1.dimension !== vector2.dimension) {
      return false;
    }

    for (let i = 0; i < vector1.dimension; i++) {
      if (Math.abs(vector1.values[i]! - vector2.values[i]!) > tolerance) {
        return false;
      }
    }

    return true;
  }
} 