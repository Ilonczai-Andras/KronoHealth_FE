import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { KrIconComponent } from '@shared/components/kr-icon/kr-icon.component';

interface Feature {
  icon: string;
  title: string;
  desc: string;
  badge: string;
  badgeClass: string;
}

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink, KrIconComponent],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent {
  features: Feature[] = [
    { icon: 'microscope', title: 'Biomarker Lab',      desc: 'Töltsd fel a vérkép-leletedet, és az AI azonnal elemzi a kulcsmarkereket – B12-től a tesztoszteronig.', badge: 'AI-alapú',    badgeClass: 'badge-cyan'   },
    { icon: 'trending-up',title: 'Élettartam Score',   desc: 'Egyetlen szám, ami mutatja, hol állsz. Összesítjük az alvást, a HRV-t, az aktivitást és a biomarkereket.',badge: 'Valós idejű', badgeClass: 'badge-purple' },
    { icon: 'zap',         title: 'Okosóra Szinkron',  desc: 'Garmin, Oura, Apple Health – minden adat egy helyen. Automatikus napi szinkronizáció.',                      badge: 'Automatikus', badgeClass: 'badge-green'  },
    { icon: 'shield',      title: 'Privát & Biztonságos',desc: 'Az adataid csak a tieid. End-to-end titkosítás, EU szerveren tárolva, GDPR-kompatibilis.',                  badge: 'GDPR',       badgeClass: 'badge-amber'  }
  ];

  steps = [
    { num: '01', title: 'Regisztrálj',               desc: 'Hozz létre egy fiókot pillanatok alatt – email vagy Google-fiókkal.' },
    { num: '02', title: 'Kapcsold össze az eszközöket',desc: 'Kösd össze az okosórádat és töltsd fel az első vérkép-leleted.' },
    { num: '03', title: 'Kapd meg az elemzést',       desc: 'Az AI azonnal feldolgozza az adataid és személyre szabott javaslatokat ad.' },
    { num: '04', title: 'Kövesd a fejlődést',         desc: 'Heti és havi összefoglalók, trend-elemzések, és riasztások ha valami kileng.' }
  ];
}
