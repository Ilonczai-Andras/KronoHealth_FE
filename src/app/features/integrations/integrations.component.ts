import { Component } from '@angular/core';
import { KrIconComponent } from '@shared/components/kr-icon/kr-icon.component';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  connected: boolean;
  lastSync?: string;
  color: string;
  accentColor: string;
}

@Component({
  selector: 'app-integrations',
  standalone: true,
  imports: [KrIconComponent],
  templateUrl: './integrations.component.html',
  styleUrls: ['./integrations.component.scss']
})
export class IntegrationsComponent {

  integrations: Integration[] = [
    {
      id: 'garmin',
      name: 'Garmin Connect',
      description: 'Szívritmus, aktivitás, alvás és stressz adatok szinkronizálása Garmin eszközökről.',
      icon: '⌚',
      category: 'Okosóra',
      connected: true,
      lastSync: '2 perce',
      color: 'rgba(0, 180, 100, 0.08)',
      accentColor: '#00b464'
    },
    {
      id: 'oura',
      name: 'Oura Ring',
      description: 'HRV, alvási fázisok, testhőmérséklet és készenléti pontszám szinkronizálása.',
      icon: '💍',
      category: 'Okosóra',
      connected: false,
      color: 'rgba(0, 212, 255, 0.08)',
      accentColor: '#00d4ff'
    },
    {
      id: 'apple-health',
      name: 'Apple Health',
      description: 'iPhone és Apple Watch egészségügyi adatok – lépések, kalóriák, szívritmus.',
      icon: '🍎',
      category: 'Mobilapp',
      connected: false,
      color: 'rgba(255, 55, 95, 0.08)',
      accentColor: '#ff375f'
    },
    {
      id: 'fitbit',
      name: 'Fitbit / Google Fit',
      description: 'Fitbit és Google Fit adatok – napi aktivitás, alvás, kalóriafelhasználás.',
      icon: '📊',
      category: 'Okosóra',
      connected: false,
      color: 'rgba(0, 180, 216, 0.08)',
      accentColor: '#00b4d8'
    },
    {
      id: 'whoop',
      name: 'WHOOP',
      description: 'Terhelés, regeneráció és alvás mérőszámok a WHOOP strap-ről.',
      icon: '🟡',
      category: 'Okosóra',
      connected: false,
      color: 'rgba(255, 196, 0, 0.08)',
      accentColor: '#ffc400'
    },
    {
      id: 'withings',
      name: 'Withings Health Mate',
      description: 'Okos mérleg, vérnyomásmérő és alváskövetés adatok szinkronizálása.',
      icon: '⚖️',
      category: 'Orvosi eszköz',
      connected: false,
      color: 'rgba(123, 47, 247, 0.08)',
      accentColor: '#7b2ff7'
    },
    {
      id: 'polar',
      name: 'Polar Flow',
      description: 'Edzés teljesítmény, ortosztatikus teszt és nightly recharge adatok.',
      icon: '🔴',
      category: 'Okosóra',
      connected: false,
      color: 'rgba(239, 68, 68, 0.08)',
      accentColor: '#ef4444'
    },
    {
      id: 'strava',
      name: 'Strava',
      description: 'Futás, kerékpározás és egyéb sportaktivitások teljesítménymutatói.',
      icon: '🏃',
      category: 'Sportalkalmazás',
      connected: false,
      color: 'rgba(252, 76, 2, 0.08)',
      accentColor: '#fc4c02'
    },
  ];

  categories = ['Összes', 'Okosóra', 'Mobilapp', 'Orvosi eszköz', 'Sportalkalmazás'];
  activeCategory = 'Összes';

  get filtered(): Integration[] {
    if (this.activeCategory === 'Összes') return this.integrations;
    return this.integrations.filter(i => i.category === this.activeCategory);
  }

  get connectedCount(): number {
    return this.integrations.filter(i => i.connected).length;
  }

  toggleConnection(item: Integration): void {
    item.connected = !item.connected;
    if (item.connected) {
      item.lastSync = 'az imént';
    } else {
      delete item.lastSync;
    }
  }
}
