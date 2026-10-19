import type { embedMovieDocument } from "../../src/services/embedding.service.js";

export type PendingDocument = {
  id: number;
  title: string;
  content: string;
  contentHash: string;
};

export type EmbeddingDependencies = {
  findPending: (limit: number, model: string) => Promise<PendingDocument[]>;
  embed: typeof embedMovieDocument;
  save: (document: PendingDocument, vector: number[], model: string) => Promise<boolean>;
  wait: (milliseconds: number) => Promise<unknown>;
  log: (message: string) => void;
};
