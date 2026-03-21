import {
  Component,
  Input,
  ElementRef,
  Renderer2,
  OnChanges,
  inject,
} from '@angular/core';
import {
  Activity,
  Moon,
  Heart,
  Zap,
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowRight,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Bell,
  Search,
  ChevronDown,
  LayoutDashboard,
  FlaskConical,
  Plug,
  Settings,
  LogOut,
  Upload,
  FileText,
  Link,
  Link2Off,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Watch,
  Flame,
  Droplets,
  Microscope,
  Shield,
  Check,
  ChevronRight,
  Files,
  FileCheck,
  FileX,
  Loader,
  X,
  XCircle,
  Save,
  AlertCircle,
  Info,
  ChevronLeft,
  ScanLine,
  LucideIconData,
} from 'lucide-angular';

type SVGIconData = ReadonlyArray<readonly [string, Record<string, unknown>]>;

const ICONS: Record<string, SVGIconData> = {
  activity: Activity as SVGIconData,
  moon: Moon as SVGIconData,
  heart: Heart as SVGIconData,
  zap: Zap as SVGIconData,
  'trending-up': TrendingUp as SVGIconData,
  'trending-down': TrendingDown as SVGIconData,
  minus: Minus as SVGIconData,
  'arrow-right': ArrowRight as SVGIconData,
  mail: Mail as SVGIconData,
  lock: Lock as SVGIconData,
  eye: Eye as SVGIconData,
  'eye-off': EyeOff as SVGIconData,
  user: User as SVGIconData,
  bell: Bell as SVGIconData,
  search: Search as SVGIconData,
  'chevron-down': ChevronDown as SVGIconData,
  'chevron-right': ChevronRight as SVGIconData,
  'layout-dashboard': LayoutDashboard as SVGIconData,
  'flask-conical': FlaskConical as SVGIconData,
  plug: Plug as SVGIconData,
  settings: Settings as SVGIconData,
  'log-out': LogOut as SVGIconData,
  upload: Upload as SVGIconData,
  'file-text': FileText as SVGIconData,
  link: Link as SVGIconData,
  'link-2-off': Link2Off as SVGIconData,
  'refresh-cw': RefreshCw as SVGIconData,
  'check-circle': CheckCircle as SVGIconData,
  'alert-triangle': AlertTriangle as SVGIconData,
  watch: Watch as SVGIconData,
  flame: Flame as SVGIconData,
  droplets: Droplets as SVGIconData,
  microscope: Microscope as SVGIconData,
  shield: Shield as SVGIconData,
  check: Check as SVGIconData,
  files: Files as SVGIconData,
  'file-check': FileCheck as SVGIconData,
  'file-x': FileX as SVGIconData,
  loader: Loader as SVGIconData,
  x: X as SVGIconData,
  'x-circle': XCircle as SVGIconData,
  save: Save as SVGIconData,
  'alert-circle': AlertCircle as SVGIconData,
  info: Info as SVGIconData,
  'chevron-left': ChevronLeft as SVGIconData,
  'scan-line': ScanLine as SVGIconData,
};

@Component({
  selector: 'app-icon',
  standalone: true,
  template: '',
  styles: [
    ':host { display: inline-flex; align-items: center; justify-content: center; line-height: 0; }',
  ],
})
export class KrIconComponent implements OnChanges {
  @Input() name: string = '';
  @Input() size: number | string = 24;
  @Input() color: string = 'currentColor';
  @Input() strokeWidth: number = 2;

  private el = inject(ElementRef);
  private renderer = inject(Renderer2);

  ngOnChanges(): void {
    this.renderIcon();
  }

  private renderIcon(): void {
    const host = this.el.nativeElement as HTMLElement;
    while (host.firstChild) {
      this.renderer.removeChild(host, host.firstChild);
    }

    const data = ICONS[this.name];
    if (!data) return;

    const ns = 'http://www.w3.org/2000/svg';
    const sz = String(this.size);
    const svg = this.renderer.createElement('svg', ns);
    this.renderer.setAttribute(svg, 'xmlns', ns);
    this.renderer.setAttribute(svg, 'width', sz);
    this.renderer.setAttribute(svg, 'height', sz);
    this.renderer.setAttribute(svg, 'viewBox', '0 0 24 24');
    this.renderer.setAttribute(svg, 'fill', 'none');
    this.renderer.setAttribute(svg, 'stroke', this.color);
    this.renderer.setAttribute(svg, 'stroke-width', String(this.strokeWidth));
    this.renderer.setAttribute(svg, 'stroke-linecap', 'round');
    this.renderer.setAttribute(svg, 'stroke-linejoin', 'round');

    for (const [tag, attrs] of data) {
      const child = this.renderer.createElement(tag, ns);
      for (const [key, val] of Object.entries(attrs)) {
        if (key !== 'key') {
          this.renderer.setAttribute(child, key, String(val));
        }
      }
      this.renderer.appendChild(svg, child);
    }

    this.renderer.appendChild(host, svg);
  }
}
