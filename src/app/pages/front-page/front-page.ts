import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FilmCard } from '../../components/film-card/film-card';
import { JupiterApiService } from '../../services/jupiter.service';

@Component({
  selector: 'app-front-page',
  imports: [CommonModule, FilmCard],
  templateUrl: './front-page.html',
  styleUrl: './front-page.scss'
})
export class FrontPage {
  private api = inject(JupiterApiService);
  stripes$ = this.api.stripes.asReadonly();
}
