
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-speed-selector',
  templateUrl: './speed-selector.component.html',
  styleUrls: ['./speed-selector.component.css'],
  standalone: true,
  imports: [FormsModule]
})
export class SpeedSelectorComponent {
  @Input() wpm = 300; // default reading speed
  @Output() speedChange = new EventEmitter<number>();

  minWpm = 100;
  maxWpm = 1000;
  step = 50;

  onWpmChange() {
    const msPerWord = Math.round(60000 / this.wpm);
    this.speedChange.emit(msPerWord);
  }
}
