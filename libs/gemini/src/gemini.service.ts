import {
  EmbedContentParameters,
  EmbedContentResponse,
  FinishReason,
  GenerateContentParameters,
  GenerateContentResponse,
  GoogleGenAI,
} from '@google/genai';
import { Injectable, Logger } from '@nestjs/common';

import { libraryENVConfig } from 'libs/env.config';

@Injectable()
export class GeminiService {
  private readonly logger = new Logger(GeminiService.name);
  private genAI: GoogleGenAI;

  constructor() {
    const apiKey = libraryENVConfig.gemini.apiKey;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is required');
    }

    this.genAI = new GoogleGenAI({
      apiKey: apiKey,
    });
  }

  async embedContent(
    param: EmbedContentParameters,
  ): Promise<EmbedContentResponse> {
    try {
      const response = await this.genAI.models.embedContent(param);

      return response;
    } catch (error) {
      this.logger.error('Gemini Error: ', error);
      throw new Error(error.message);
    }
  }

  async generateContent(
    param: GenerateContentParameters,
  ): Promise<GenerateContentResponse> {
    try {
      const response = await this.genAI.models.generateContent(param);
      return response;
    } catch (error) {
      this.logger.error('Gemini Error: ', error);
      throw new Error(error.message);
    }
  }
}
