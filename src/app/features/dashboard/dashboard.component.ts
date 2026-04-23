import { Component, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';
import { KrIconComponent } from '@shared/components/kr-icon/kr-icon.component';

interface MetricCard {
  title: string;
  value: string;
  unit: string;
  change: number;
  changeLabel: string;
  icon: string;
  color: string;
  trend: 'up' | 'down' | 'neutral';
}

interface LabHistoryEntry {
  id: string;
  date: string;
  lab: string;
  markerCount: number;
  keyValues: {
    label: string;
    value: string;
    unit: string;
    flag?: 'high' | 'low';
  }[];
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [KrIconComponent, DecimalPipe],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  private router = inject(Router);

  readonly labHistory: LabHistoryEntry[] = [
    {
      id: 'DOC-003',
      date: '2026. február 12.',
      lab: 'Synlab Magyarország',
      markerCount: 24,
      keyValues: [
        { label: 'Glükóz', value: '5.2', unit: 'mmol/L' },
        { label: 'HbA1c', value: '5.8', unit: '%', flag: 'high' },
        { label: 'LDL', value: '3.1', unit: 'mmol/L' },
        { label: 'D-vit.', value: '28', unit: 'ng/mL', flag: 'low' },
      ],
    },
    {
      id: 'DOC-002',
      date: '2025. november 3.',
      lab: 'Medicover Lab',
      markerCount: 18,
      keyValues: [
        { label: 'Glükóz', value: '5.1', unit: 'mmol/L' },
        { label: 'HbA1c', value: '5.5', unit: '%' },
        { label: 'LDL', value: '3.0', unit: 'mmol/L' },
        { label: 'D-vit.', value: '31', unit: 'ng/mL', flag: 'low' },
      ],
    },
    {
      id: 'DOC-001',
      date: '2025. augusztus 8.',
      lab: 'Synlab Magyarország',
      markerCount: 22,
      keyValues: [
        { label: 'Glükóz', value: '4.9', unit: 'mmol/L' },
        { label: 'HbA1c', value: '5.3', unit: '%' },
        { label: 'LDL', value: '2.8', unit: 'mmol/L' },
        { label: 'D-vit.', value: '34', unit: 'ng/mL', flag: 'low' },
      ],
    },
  ];

  openLabReview(id: string): void {
    this.router.navigate(['/app/biomarker-lab/review', id]);
  }

  readonly metrics: MetricCard[] = [
    {
      title: 'Alvásminőség',
      value: '7.4',
      unit: 'h',
      change: +5,
      changeLabel: '+5% a múlt héthez',
      icon: 'moon',
      color: '#7b2ff7',
      trend: 'up',
    },
    {
      title: 'HRV',
      value: '58',
      unit: 'ms',
      change: +8,
      changeLabel: '+8ms javulás',
      icon: 'heart',
      color: '#00d4ff',
      trend: 'up',
    },
    {
      title: 'Aktivitás',
      value: '8 420',
      unit: 'lépés',
      change: -3,
      changeLabel: '-3% a célhoz képest',
      icon: 'zap',
      color: '#00ff88',
      trend: 'down',
    },
    {
      title: 'Kalóriaégetés',
      value: '2 140',
      unit: 'kcal',
      change: 0,
      changeLabel: 'Nincs változás',
      icon: 'flame',
      color: '#f59e0b',
      trend: 'neutral',
    },
    {
      title: 'Vízfogyasztás',
      value: '1.8',
      unit: 'L',
      change: +12,
      changeLabel: '+12% a tegnap óta',
      icon: 'droplets',
      color: '#00d4ff',
      trend: 'up',
    },
    {
      title: 'Longevity Score',
      value: '82',
      unit: '/100',
      change: +4,
      changeLabel: '+4 pont a múlt héten',
      icon: 'activity',
      color: '#00ff88',
      trend: 'up',
    },
  ];

  weeklyData = [
    { day: 'H', sleep: 6.5, hrv: 52, steps: 7800 },
    { day: 'K', sleep: 7.2, hrv: 58, steps: 9200 },
    { day: 'Sz', sleep: 6.8, hrv: 55, steps: 11000 },
    { day: 'Cs', sleep: 8.0, hrv: 62, steps: 8400 },
    { day: 'P', sleep: 7.4, hrv: 60, steps: 7100 },
    { day: 'Szo', sleep: 9.1, hrv: 71, steps: 4300 },
    { day: 'V', sleep: 8.3, hrv: 68, steps: 5600 },
  ];

  maxSteps = Math.max(...this.weeklyData.map((d) => d.steps));

  getBarHeight(steps: number): number {
    return (steps / this.maxSteps) * 100;
  }
}
