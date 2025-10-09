import { Injectable, Logger } from '@nestjs/common';
import { ChromaClient, Metadata, Where, WhereDocument } from 'chromadb';
import { libraryENVConfig } from 'libs/env.config';
type Include = 'distances' | 'documents' | 'embeddings' | 'metadatas' | 'uris';
@Injectable()
export class ChromaService {
  private readonly logger = new Logger(ChromaService.name);
  private readonly client: ChromaClient;

  constructor() {
    this.client = new ChromaClient({
      host: libraryENVConfig.chroma.host,
      port: libraryENVConfig.chroma.port,
    });
  }

  /** Pastikan collection tersedia */
  private async getCollection(collectionName: string) {
    try {
      return await this.client.getCollection({ name: collectionName });
    } catch {
      this.logger.log(`Creating Chroma collection: ${collectionName}`);
      return await this.client.createCollection({ name: collectionName });
    }
  }

  /** Ingest dokumen referensi (misal Job Desc, Rubric, Case Brief) */
  async addDocuments(args: {
    collection: string;
    ids: string[];
    embeddings?: number[][];
    metadatas?: Metadata[];
    documents?: string[];
    uris?: string[];
  }) {
    try {
      const collection = await this.getCollection(args.collection);
      await collection.add(args);
      this.logger.log(`✅ Added ${args.documents?.length} docs to Chroma`);
    } catch (error) {
      this.logger.error(`Failed to add docs to Chroma: ${error.message}`);
      throw error;
    }
  }

  async upsert(args: {
    collection?: string;
    ids: string[];
    embeddings?: number[][];
    metadatas?: Metadata[];
    documents?: string[];
    uris?: string[];
  }) {
    try {
      const collection = await this.getCollection(args.collection);
      await collection.upsert(args);
      this.logger.log(`✅ Upserted ${args.documents?.length} docs to Chroma`);
    } catch (error) {
      this.logger.error(`Failed to add docs to Chroma: ${error.message}`);
      throw error;
    }
  }

  /** Query dokumen relevan berdasarkan embedding */
  async query(args: {
    collection: string;
    queryEmbeddings?: number[][];
    queryTexts?: string[];
    queryURIs?: string[];
    ids?: string[];
    nResults?: number;
    where?: Where;
    whereDocument?: WhereDocument;
    include?: Include[];
  }): Promise<string[]> {
    try {
      const collection = await this.getCollection(args.collection);
      const results = await collection.query(args);

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
  async clearAll(collection: string) {
    try {
      await this.client.deleteCollection({ name: collection });
      this.logger.warn(`🗑️ Deleted collection: ${collection}`);
    } catch (error) {
      this.logger.error(`Failed to delete collection: ${error.message}`);
      throw error;
    }
  }
}
