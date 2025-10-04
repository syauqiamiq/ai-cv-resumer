import { Injectable, Logger } from '@nestjs/common';
import { ChromaClient, IncludeEnum, Metadata } from 'chromadb';
import { libraryENVConfig } from 'libs/env.config';

@Injectable()
export class ChromaService {
  private readonly logger = new Logger(ChromaService.name);
  private readonly client: ChromaClient;
  private readonly collectionName = 'reference_docs';

  constructor() {
    this.client = new ChromaClient({
      path: libraryENVConfig.chroma.host,
    });
  }

  /** Pastikan collection tersedia */
  private async getCollection() {
    try {
      return await this.client.getCollection({ name: this.collectionName });
    } catch {
      this.logger.log(`Creating Chroma collection: ${this.collectionName}`);
      return await this.client.createCollection({ name: this.collectionName });
    }
  }

  /** Ingest dokumen referensi (misal Job Desc, Rubric, Case Brief) */
  async addDocuments(args: {
    ids: string[];
    embeddings?: number[][];
    metadatas?: Metadata[];
    documents?: string[];
    uris?: string[];
  }) {
    try {
      const collection = await this.getCollection();
      await collection.add(args);
      this.logger.log(`✅ Added ${args.documents?.length} docs to Chroma`);
    } catch (error) {
      this.logger.error(`Failed to add docs to Chroma: ${error.message}`);
      throw error;
    }
  }

  /** Query dokumen relevan berdasarkan embedding */
  async query(embedding: number[], topK = 5): Promise<string[]> {
    try {
      const collection = await this.getCollection();
      const results = await collection.query({
        queryEmbeddings: [embedding],
        nResults: topK,
        include: [IncludeEnum.documents, IncludeEnum.metadatas],
      });

      if (!results.documents?.length) return [];

      this.logger.debug(
        `🔍 Chroma returned ${results.documents[0].length} matches.`,
      );

      return results.documents[0];
    } catch (error) {
      this.logger.error(`Failed to query Chroma: ${error.message}`);
      throw error;
    }
  }

  /** Optional: Hapus semua dokumen referensi */
  async clearAll() {
    try {
      await this.client.deleteCollection({ name: this.collectionName });
      this.logger.warn(`🗑️ Deleted collection: ${this.collectionName}`);
    } catch (error) {
      this.logger.error(`Failed to delete collection: ${error.message}`);
      throw error;
    }
  }
}
