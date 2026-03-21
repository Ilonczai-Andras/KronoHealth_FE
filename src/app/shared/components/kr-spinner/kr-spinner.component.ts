import { Component, Input } from '@angular/core';

@Component({
  selector: 'kr-spinner',
  standalone: true,
  template: `
    @if (overlay) {
      <div class="kr-spinner-overlay">
        <div class="kr-spinner" [class]="'kr-spinner--' + size"></div>
      </div>
    } @else {
      <div class="kr-spinner" [class]="'kr-spinner--' + size"></div>
    }
  `,
  styles: [
    `
      :host {
        display: contents;
      }

      .kr-spinner-overlay {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(5, 11, 24, 0.65);
        backdrop-filter: blur(4px);
        border-radius: inherit;
        z-index: 10;
      }

      .kr-spinner {
        border-radius: 50%;
        border-style: solid;
        border-color: rgba(255, 255, 255, 0.15);
        border-top-color: #00d4ff;
        animation: kr-spin 0.7s linear infinite;
      }

      .kr-spinner--sm {
        width: 16px;
        height: 16px;
        border-width: 2px;
      }
      .kr-spinner--md {
        width: 32px;
        height: 32px;
        border-width: 3px;
      }
      .kr-spinner--lg {
        width: 48px;
        height: 48px;
        border-width: 4px;
      }

      @keyframes kr-spin {
        to {
          transform: rotate(360deg);
        }
      }
    `,
  ],
})
export class KrSpinnerComponent {
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() overlay = false;
}
