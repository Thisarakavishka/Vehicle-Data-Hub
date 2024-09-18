import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

@Injectable()
export class UploadService {
  constructor(
    @InjectQueue('file-upload-queue') private readonly fileUploadQueue: Queue,
  ) { }

  async handleFileUpload(file: any): Promise<string> {
    try {
      const { createReadStream, filename } = await file.promise; //Destructure input file

      if (!createReadStream || !filename) {
        throw new Error('Invalid file structure: Missing file stream or filename.');
      }

      const uploadDir = join(process.cwd(), 'uploads'); //Get current directory and create new Directory for save files locally

      if (!existsSync(uploadDir)) { //Check directory is already exists
        mkdirSync(uploadDir, { recursive: true });
      }

      const filePath = join(uploadDir, filename);

      await new Promise((resolve, reject) => {
        createReadStream()
          .pipe(createWriteStream(filePath))
          .on('finish', () => resolve(`File uploaded successfully: ${filename}`))
          .on('error', (err) => reject(`Failed to upload file: ${err.message}`));
      });

      //Adding file path to queue and assign new job that name 'process-data'
      const job = await this.fileUploadQueue.add('process-data', { filePath });

      return `File uploaded and job added: ${filename}`;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new Error('File upload failed');
    }
  }
}
