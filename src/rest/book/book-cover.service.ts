import { Injectable } from '@nestjs/common';
import * as fs from 'node:fs';
import * as path from 'node:path';

@Injectable()
export class BookCoverService {
  private coversFolder = process.env.BOOK_COVER_IMAGES_PATH ?? '';

  constructor() {
    if (!this.coversFolder) {
      throw new Error('Missing covers folder path');
    }
    if (!fs.existsSync(this.coversFolder)) {
      fs.mkdirSync(this.coversFolder, { recursive: true });
    }
  }

  getCoverStream(isbn13: string): fs.ReadStream {
    const imagePath = path.join(this.coversFolder, `${isbn13}.jpg`);

    if (fs.existsSync(imagePath)) {
      return fs.createReadStream(imagePath);
    }

    return fs.createReadStream('./images/book.png');
  }

  saveCover(isbn13: string, imageBuffer: Buffer): void {
    const filePath = path.join(this.coversFolder, `${isbn13}.jpg`);
    fs.writeFileSync(filePath, imageBuffer);
  }

  exists(isbn13: string): boolean {
    const imagePath = path.join(this.coversFolder, `${isbn13}.jpg`);

    return fs.existsSync(imagePath);
  }
}
