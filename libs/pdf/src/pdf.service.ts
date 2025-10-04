import { Injectable } from '@nestjs/common';
import PDFParse from 'pdf-parse';

@Injectable()
export class PdfService {
  async extractText(buffer: Buffer): Promise<string> {
    const data = await PDFParse(buffer);
    return data.text;
  }
}
