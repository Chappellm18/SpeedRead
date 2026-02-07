import { Component, EventEmitter, Output } from '@angular/core';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { ProgressBarModule } from 'primeng/progressbar';
import * as mammoth from 'mammoth';
import { CommonModule, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-upload-file',
  standalone: true,
  imports: [
    FileUploadModule,
    ButtonModule,
    BadgeModule,
    ProgressBarModule,
    DecimalPipe,
    CommonModule
  ],
  templateUrl: './upload-file.component.html'
})
export class UploadFileComponent {
  @Output() fileParsed = new EventEmitter<string>();

  files: File[] = [];
  totalSize = 0;
  totalSizePercent = 0;

  // ---------- UI HANDLERS ----------

  onSelectedFiles(event: any) {
    this.files = event.currentFiles;
    this.totalSize = this.files.reduce((sum, f) => sum + f.size, 0);
    this.totalSizePercent = Math.min((this.totalSize / 1_000_000) * 100, 100);
  }

  removeFile(index: number) {
    this.totalSize -= this.files[index].size;
    this.files.splice(index, 1);
    this.totalSizePercent = (this.totalSize / 1_000_000) * 100;
  }

  onClear(clear: () => void) {
    clear();
    this.files = [];
    this.totalSize = 0;
    this.totalSizePercent = 0;
  }

  // ---------- UPLOAD + PARSING ----------

  async onUpload() {
    for (const file of this.files) {
      const content = await this.parseFile(file);
      if (content) {
        this.fileParsed.emit(content);
      }
    }
  }

  async parseFile(file: File): Promise<string | null> {
    const ext = file.name.split('.').pop()?.toLowerCase();

    switch (ext) {
      case 'txt':
        return this.readTxt(file);
      case 'docx':
        return this.readDocx(file);
      default:
        return null;
    }
  }

  private readTxt(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  }

  private async readDocx(file: File): Promise<string> {
    const buffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer: buffer });
    return result.value;
  }

  formatSize(bytes: number): string {
    return new Intl.NumberFormat().format(bytes) + ' bytes';
  }
}
