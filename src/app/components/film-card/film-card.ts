import { CommonModule } from '@angular/common';
import { Component, Input, computed } from '@angular/core';
import { smartCrop, VerticalPhoto } from '../../services/jupiter.service';

const POSTER_WIDTHS = [253, 438] as const;

@Component({
  selector: 'app-film-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './film-card.html',
  styleUrls: ['./film-card.scss'],
})
export class FilmCard {
  @Input() title  = '';
  @Input() photos: VerticalPhoto[] = [];

  private original = computed(() =>
    this.photos?.[0]?.photoUrlOriginal ?? ''
  );

  get defaultUrl(): string {
    return this.original()
      ? smartCrop(this.original(), 438)
      : '/assets/placeholder-160x240.png';
  }

  get srcSet(): string {
    return this.original()
      ? POSTER_WIDTHS
          .map(w => `${smartCrop(this.original(), w)} ${w}w`)
          .join(', ')
      : '';
  }
}
