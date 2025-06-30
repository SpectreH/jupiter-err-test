import { Injectable, effect, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface JupiterResponse {
  data: {
    category: {
      frontPage: JupiterStripe[];
    };
  };
}

export interface JupiterStripe {
  header: string;
  highTimeline: boolean;
  data: JupiterItem[];
}

export interface JupiterItem {
  id: number;
  heading: string;
  verticalPhotos: VerticalPhoto[];
}

export interface VerticalPhoto {
  photoTypes: Record<string, PhotoType>;
  photoUrlOriginal: string;
  photoUrlBase: string;
}

export interface PhotoType {
  type: number;
  w: number;
  h: number;
  url: string;
}

@Injectable({ providedIn: 'root' })
export class JupiterApiService {
  private readonly api =
    'https://services.err.ee/api/v2/category/getByUrl?url=video&domain=jupiter.err.ee';


  readonly stripes = signal<JupiterStripe[]>([]);

  constructor(private http: HttpClient) {
    this.loadFrontPage();
  }

  private loadFrontPage() {
    this.http.get<JupiterResponse>(this.api).subscribe((r) => {
      const stripes = r.data.category.frontPage.filter((s) => s.highTimeline);
      this.stripes.set(stripes);
    });
  }
}

export function photoSources(vp: VerticalPhoto) {
  return Object.values(vp.photoTypes).sort((a, b) => a.w - b.w);
}

export function smartCrop(
  original: string,
  width: number,
  aspect: string = '2:3'
): string {
  return (
    'https://i.err.ee/smartcrop?type=optimize' +
    `&width=${width}` +
    `&aspectratio=${aspect}` +
    `&url=${encodeURIComponent(original)}`
  );
}
