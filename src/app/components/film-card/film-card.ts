import { CommonModule } from '@angular/common';
import { Component, Input, computed } from '@angular/core';
import { smartCrop, VerticalPhoto } from '../../services/jupiter.service';

const POSTER_WIDTHS = [253, 438] as const;

@Component({
  selector: 'app-film-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './film-card.html',
  styleUrl: './film-card.scss',
})
export class FilmCard {
  @Input() title = '';
  @Input() photos: VerticalPhoto[] = [];
  @Input() url: string = ''

  private original = computed(() =>
    this.photos?.[0]?.photoUrlOriginal ?? ''
  );

  get defaultUrl(): string {
    return this.original() ? smartCrop(this.original(), 438) : 'https://i.err.ee/smartcrop?type=optimize&width=438&aspectratio=2:3&url=https%3A%2F%2Fs.err.ee%2Fphoto%2Forig%2F2024%2F08%2F05%2F2500117h3579.jpg';
  }

  get srcSet(): string {
    return this.original()
      ? POSTER_WIDTHS
          .map(w => `${smartCrop(this.original(), w)} ${w}w`)
          .join(', ')
      : '';
  }
}
