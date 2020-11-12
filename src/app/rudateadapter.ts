import { NativeDateAdapter } from '@angular/material/core';
import { Injectable } from '@angular/core';
import { Platform } from '@angular/cdk/platform';

@Injectable()
export class RuDateAdapter extends NativeDateAdapter {
  constructor() {
    super('ru-RU', new Platform('ru-RU'));
  }

  getFirstDayOfWeek(): number {
    return 1;
  }
}
