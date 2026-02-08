import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import * as mammoth from 'mammoth';

@Component({
  selector: 'app-upload-file',
  standalone: true,
  imports: [
    CommonModule,
    DecimalPipe
  ],
  templateUrl: './upload-file.component.html'
})
export class UploadFileComponent {
  @Output() fileParsed = new EventEmitter<string>();

  files: (File & { objectURL?: string })[] = [];
  totalSize = 0;
  totalSizePercent = 0;

  private readonly MAX_SIZE = 1_000_000;

  // ---------- UI HANDLERS ----------

  onSelectedFiles(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    this.files = Array.from(input.files).map(file => {
      const isImage = file.type.startsWith('image/');
      return Object.assign(file, {
        objectURL: isImage ? URL.createObjectURL(file) : undefined
      });
    });

    this.recalculateSize();
    input.value = ''; // allow re-selecting same files
  }

  removeFile(index: number) {
    const file = this.files[index];
    if (file.objectURL) {
      URL.revokeObjectURL(file.objectURL);
    }

    this.files.splice(index, 1);
    this.recalculateSize();
  }

  onClear() {
    this.files.forEach(f => {
      if (f.objectURL) {
        URL.revokeObjectURL(f.objectURL);
      }
    });

    this.files = [];
    this.totalSize = 0;
    this.totalSizePercent = 0;
  }

  private recalculateSize() {
    this.totalSize = this.files.reduce((sum, f) => sum + f.size, 0);
    this.totalSizePercent = Math.min(
      (this.totalSize / this.MAX_SIZE) * 100,
      100
    );
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
