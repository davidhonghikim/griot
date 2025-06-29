/**
 * Text chunking utility for content segmentation
 * Breaks down text into optimal chunks for embedding generation
 */

export interface ChunkingConfig {
  readonly maxChunkSize: number;
  readonly overlapSize: number;
  readonly preserveSentences: boolean;
  readonly preserveParagraphs: boolean;
}

export interface TextChunk {
  readonly content: string;
  readonly index: number;
  readonly startOffset: number;
  readonly endOffset: number;
  readonly metadata: ChunkMetadata;
}

export interface ChunkMetadata {
  readonly isCompleteSentence: boolean;
  readonly isCompleteParagraph: boolean;
  readonly wordCount: number;
  readonly characterCount: number;
}

export class TextChunker {
  private config: ChunkingConfig;

  constructor(config: ChunkingConfig) {
    this.config = config;
  }

  /**
   * Chunk text into optimal segments for embedding
   */
  chunkText(text: string): TextChunk[] {
    if (!text.trim()) {
      return [];
    }

    if (this.config.preserveParagraphs) {
      return this.chunkByParagraphs(text);
    } else if (this.config.preserveSentences) {
      return this.chunkBySentences(text);
    } else {
      return this.chunkByWords(text);
    }
  }

  /**
   * Chunk by paragraphs first, then by sentences if needed
   */
  private chunkByParagraphs(text: string): TextChunk[] {
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim());
    const chunks: TextChunk[] = [];
    let globalIndex = 0;
    let offset = 0;

    for (const paragraph of paragraphs) {
      const trimmedParagraph = paragraph.trim();
      
      if (trimmedParagraph.length <= this.config.maxChunkSize) {
        // Paragraph fits in one chunk
        chunks.push({
          content: trimmedParagraph,
          index: globalIndex++,
          startOffset: offset,
          endOffset: offset + trimmedParagraph.length,
          metadata: {
            isCompleteSentence: this.isCompleteSentence(trimmedParagraph),
            isCompleteParagraph: true,
            wordCount: this.countWords(trimmedParagraph),
            characterCount: trimmedParagraph.length
          }
        });
        offset += trimmedParagraph.length + 2; // +2 for paragraph separator
      } else {
        // Paragraph needs to be split by sentences
        const sentenceChunks = this.chunkBySentences(trimmedParagraph, globalIndex, offset);
        chunks.push(...sentenceChunks);
        globalIndex += sentenceChunks.length;
        offset += trimmedParagraph.length + 2;
      }
    }

    return this.applyOverlap(chunks);
  }

  /**
   * Chunk by sentences, respecting max chunk size
   */
  private chunkBySentences(text: string, startIndex: number = 0, startOffset: number = 0): TextChunk[] {
    const sentences = this.splitIntoSentences(text);
    const chunks: TextChunk[] = [];
    let currentChunk = '';
    let currentIndex = startIndex;
    let offset = startOffset;

    for (const sentence of sentences) {
      const trimmedSentence = sentence.trim();
      
      if (!trimmedSentence) continue;

      if (currentChunk.length + trimmedSentence.length <= this.config.maxChunkSize) {
        // Add sentence to current chunk
        currentChunk += (currentChunk ? ' ' : '') + trimmedSentence;
      } else {
        // Finalize current chunk and start new one
        if (currentChunk) {
          chunks.push({
            content: currentChunk,
            index: currentIndex++,
            startOffset: offset,
            endOffset: offset + currentChunk.length,
            metadata: {
              isCompleteSentence: this.isCompleteSentence(currentChunk),
              isCompleteParagraph: false,
              wordCount: this.countWords(currentChunk),
              characterCount: currentChunk.length
            }
          });
          offset += currentChunk.length + 1; // +1 for space
        }
        currentChunk = trimmedSentence;
      }
    }

    // Add final chunk
    if (currentChunk) {
      chunks.push({
        content: currentChunk,
        index: currentIndex,
        startOffset: offset,
        endOffset: offset + currentChunk.length,
        metadata: {
          isCompleteSentence: this.isCompleteSentence(currentChunk),
          isCompleteParagraph: false,
          wordCount: this.countWords(currentChunk),
          characterCount: currentChunk.length
        }
      });
    }

    return chunks;
  }

  /**
   * Chunk by words, respecting max chunk size
   */
  private chunkByWords(text: string): TextChunk[] {
    const words = text.split(/\s+/).filter(word => word.trim());
    const chunks: TextChunk[] = [];
    let currentChunk = '';
    let currentIndex = 0;
    let offset = 0;

    for (const word of words) {
      if (currentChunk.length + word.length + 1 <= this.config.maxChunkSize) {
        // Add word to current chunk
        currentChunk += (currentChunk ? ' ' : '') + word;
      } else {
        // Finalize current chunk and start new one
        if (currentChunk) {
          chunks.push({
            content: currentChunk,
            index: currentIndex++,
            startOffset: offset,
            endOffset: offset + currentChunk.length,
            metadata: {
              isCompleteSentence: this.isCompleteSentence(currentChunk),
              isCompleteParagraph: false,
              wordCount: this.countWords(currentChunk),
              characterCount: currentChunk.length
            }
          });
          offset += currentChunk.length + 1; // +1 for space
        }
        currentChunk = word;
      }
    }

    // Add final chunk
    if (currentChunk) {
      chunks.push({
        content: currentChunk,
        index: currentIndex,
        startOffset: offset,
        endOffset: offset + currentChunk.length,
        metadata: {
          isCompleteSentence: this.isCompleteSentence(currentChunk),
          isCompleteParagraph: false,
          wordCount: this.countWords(currentChunk),
          characterCount: currentChunk.length
        }
      });
    }

    return this.applyOverlap(chunks);
  }

  /**
   * Split text into sentences using multiple delimiters
   */
  private splitIntoSentences(text: string): string[] {
    // Split by common sentence endings, preserving the punctuation
    return text.split(/(?<=[.!?])\s+/).filter(sentence => sentence.trim());
  }

  /**
   * Check if text ends with a complete sentence
   */
  private isCompleteSentence(text: string): boolean {
    return /[.!?]$/.test(text.trim());
  }

  /**
   * Count words in text
   */
  private countWords(text: string): number {
    return text.split(/\s+/).filter(word => word.trim()).length;
  }

  /**
   * Apply overlap between chunks if configured
   */
  private applyOverlap(chunks: TextChunk[]): TextChunk[] {
    if (this.config.overlapSize <= 0 || chunks.length <= 1) {
      return chunks;
    }

    const overlappedChunks: TextChunk[] = [];
    
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      if (!chunk) continue;
      let overlappedContent = chunk.content;
      if (i > 0) {
        const prevChunk = chunks[i - 1];
        if (prevChunk) {
          const overlapWords = prevChunk.content.split(/\s+/).slice(-this.config.overlapSize);
          overlappedContent = overlapWords.join(' ') + ' ' + overlappedContent;
        }
      }
      overlappedChunks.push({
        ...chunk,
        content: overlappedContent,
        index: chunk.index ?? i,
        startOffset: chunk.startOffset ?? 0,
        endOffset: chunk.endOffset ?? 0,
        metadata: {
          ...chunk.metadata,
          wordCount: chunk.metadata?.wordCount ?? 0,
          characterCount: chunk.metadata?.characterCount ?? 0,
          isCompleteSentence: chunk.metadata?.isCompleteSentence ?? false,
          isCompleteParagraph: chunk.metadata?.isCompleteParagraph ?? false
        }
      });
    }

    return overlappedChunks;
  }
} 