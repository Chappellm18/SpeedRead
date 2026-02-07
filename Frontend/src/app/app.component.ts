import { Component } from '@angular/core';
import { UploadFileComponent } from './components/upload-file/upload-file.component';
import { SpeedSelectorComponent } from './components/speed-selector/speed-selector.component';
import { ReadFileComponent } from './components/read-file/read-file.component';

import { FormsModule } from '@angular/forms';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  imports: [UploadFileComponent, SpeedSelectorComponent, ReadFileComponent, FormsModule, FooterComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true
})
export class AppComponent {
  title = 'UI';
  fileContent = '';
  intervalMs = 200; // default from speed selector
}
