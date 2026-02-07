
import { Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-read-file',
  templateUrl: './read-file.component.html',
  styleUrls: ['./read-file.component.css'],
  standalone: true,
  imports: [FormsModule]
})
export class ReadFileComponent implements OnChanges, OnDestroy {
  @Input() text = '';
  @Input() intervalMs = 500; // default: 500ms per word

  words: string[] = [];
  currentWord = '';
  currentIndex = 0;

  private timer: any = null;

  ngOnChanges() {
    this.reset();
    this.words = this.text
      ? this.text.trim().split(/\s+/)
      : [];
  }

  start() {
    if (this.timer || this.words.length === 0) return;

    this.timer = setInterval(() => {
      if (this.currentIndex >= this.words.length) {
        this.stop();
        return;
      }

      this.currentWord = this.words[this.currentIndex];
      this.currentIndex++;
    }, this.intervalMs);
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  reset() {
    this.stop();
    this.currentIndex = 0;
    this.currentWord = '';
  }

  ngOnDestroy() {
    this.stop();
  }
}
