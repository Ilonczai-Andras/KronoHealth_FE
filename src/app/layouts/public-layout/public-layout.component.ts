import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { KrIconComponent } from '@shared/components/kr-icon/kr-icon.component';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, KrIconComponent],
  templateUrl: './public-layout.component.html',
  styleUrls: ['./public-layout.component.scss']
})
export class PublicLayoutComponent {}
