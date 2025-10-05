import { Injectable } from '@nestjs/common';
import * as pdfParse from 'pdf-parse';

@Injectable()
export class PdfService {
  async extractText(buffer: Buffer): Promise<any> {
    const parser = await pdfParse(buffer);
    const textResult = parser;

    return textResult.text;
  }
}
