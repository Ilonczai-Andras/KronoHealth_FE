import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { KrIconComponent } from '@shared/components/kr-icon/kr-icon.component';

export interface NavItem {
  label: string;
  path: string;
  icon: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, KrIconComponent],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  navItems: NavItem[] = [
    { label: 'Dashboard',     path: '/app/dashboard',     icon: 'layout-dashboard' },
    { label: 'Biomarker Lab', path: '/app/biomarker-lab', icon: 'flask-conical'    },
    { label: 'Integrációk',   path: '/app/integrations',  icon: 'plug'             },
    { label: 'Beállítások',   path: '/app/settings',      icon: 'settings'         },
  ];
}
