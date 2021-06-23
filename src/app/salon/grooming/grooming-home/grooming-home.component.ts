import { Component, OnInit } from '@angular/core';
import { Grooming } from '@app/shared/_models';
import { GroomingService } from '@app/shared/_services';
import { Observable } from 'rxjs';

@Component({
  selector: 'grooming-home',
  templateUrl: './grooming-home.component.html',
})
export class GroomingHomeComponent implements OnInit {

  headerText = 'Grooming Tool';
  inspections$: Observable<Array<Grooming>>;
  duplicate$: Observable<Array<Grooming>>;

  constructor(
    private service: GroomingService,
  ) { }

  ngOnInit(): void {
    this.doLoad();
  }

  doLoad() {
    this.inspections$ = this.service.getAll();
    this.duplicate$ = this.inspections$;
  }

  doFilterDate(value) {
    this.duplicate$ = value;
  }

  doCancel(value) {
    this.doLoad();
  }

}
