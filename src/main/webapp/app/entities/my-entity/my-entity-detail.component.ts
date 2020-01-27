import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IMyEntity } from 'app/shared/model/my-entity.model';

@Component({
  selector: 'jhi-my-entity-detail',
  templateUrl: './my-entity-detail.component.html'
})
export class MyEntityDetailComponent implements OnInit {
  myEntity: IMyEntity | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ myEntity }) => {
      this.myEntity = myEntity;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
