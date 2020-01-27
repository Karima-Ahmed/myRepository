import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IMyEntity } from 'app/shared/model/my-entity.model';
import { MyEntityService } from './my-entity.service';

@Component({
  templateUrl: './my-entity-delete-dialog.component.html'
})
export class MyEntityDeleteDialogComponent {
  myEntity?: IMyEntity;

  constructor(protected myEntityService: MyEntityService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  clear(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.myEntityService.delete(id).subscribe(() => {
      this.eventManager.broadcast('myEntityListModification');
      this.activeModal.close();
    });
  }
}
