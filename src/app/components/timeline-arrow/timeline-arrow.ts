import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ArrowSide = 'left' | 'right';

@Component({
  selector: 'app-timeline-arrow',
  standalone: true,
  imports: [CommonModule],
  host: {
    '[class.timeline-arrow]': 'true',
    '[class.timeline-arrow-left]': "side === 'left'",
    '[class.timeline-arrow-right]': "side === 'right'",
    '[hidden]': 'hidden',
  },
  templateUrl: './timeline-arrow.html',
  styleUrl: './timeline-arrow.scss',
})
export class TimelineArrow {
  @Input() side: ArrowSide = 'right';
  @Input() hidden = false;

  get imgSrc(): string {
    return `audio_arrow_${this.side}.svg`;
  }

  get altText(): string {
    return this.side === 'left' ? 'Vasakule' : 'Paremale';
  }
}
