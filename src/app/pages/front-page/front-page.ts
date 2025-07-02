import {
  Component,
  AfterViewInit,
  ElementRef,
  QueryList,
  ViewChildren,
  ChangeDetectorRef,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { FilmCard } from '../../components/film-card/film-card';
import { TimelineArrow } from '../../components/timeline-arrow/timeline-arrow';
import { JupiterApiService } from '../../services/jupiter.service';
import { Footer } from '../../components/footer/footer';

@Component({
  selector: 'app-front-page',
  standalone: true,
  imports: [CommonModule, FilmCard, TimelineArrow, Footer],
  templateUrl: './front-page.html',
  styleUrl: './front-page.scss',
})
export class FrontPage implements AfterViewInit {
  private api  = inject(JupiterApiService);
  stripes$     = this.api.stripes.asReadonly();

  @ViewChildren('track') private tracks!: QueryList<ElementRef<HTMLDivElement>>;

  private leftDisabled:  boolean[] = [];
  private rightDisabled: boolean[] = [];
  private pendingTarget: (number | null)[] = [];

  private cdr = inject(ChangeDetectorRef);

  ngAfterViewInit(): void {
    this.initScrollStates();

    this.tracks.changes.subscribe(() => {
      this.initScrollStates();
    });
  }

  onScroll(index: number, el: HTMLDivElement): void {
    const tgt = this.pendingTarget[index];
    if (tgt !== null && Math.abs(el.scrollLeft - tgt) > 1) {
      return;
    }
    if (tgt !== null) {
      this.pendingTarget[index] = null;
    }
    this.updateStates(index, el);
  }

  scrollLeft (i: number): void { this.scrollPage(i, 'left');  }
  scrollRight(i: number): void { this.scrollPage(i, 'right'); }

  canScrollLeft (i: number): boolean { return !this.leftDisabled [i]; }
  canScrollRight(i: number): boolean { return !this.rightDisabled[i]; }

  private scrollPage(index: number, dir: 'left' | 'right'): void {
    const el   = this.tracks.toArray()[index].nativeElement;
    const page = el.clientWidth;
    const max  = el.scrollWidth - page;

    const target = dir === 'left'
      ? Math.max(0,  el.scrollLeft - page)
      : Math.min(max, el.scrollLeft + page);

    el.scrollTo({ left: target, behavior: 'smooth' });

    this.pendingTarget[index] = target;

    this.leftDisabled [index] = target === 0;
    this.rightDisabled[index] = target === max;
    this.cdr.detectChanges();
  }

  private initScrollStates(): void {
    this.pendingTarget = Array(this.tracks.length).fill(null);
    this.tracks.forEach((ref, i) => this.updateStates(i, ref.nativeElement));
    this.cdr.detectChanges();
  }

  private updateStates(i: number, el: HTMLDivElement): void {
    this.leftDisabled [i] = el.scrollLeft === 0;
    this.rightDisabled[i] = el.scrollWidth - el.clientWidth - el.scrollLeft <= 1;
  }
}
