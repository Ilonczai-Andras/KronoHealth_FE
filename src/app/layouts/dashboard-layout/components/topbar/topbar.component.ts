import { Component } from '@angular/core';
import { KrIconComponent } from '@shared/components/kr-icon/kr-icon.component';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [KrIconComponent],
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent {}
