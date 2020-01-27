import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IMyEntity } from 'app/shared/model/my-entity.model';
import { MyEntityService } from './my-entity.service';
import { MyEntityDeleteDialogComponent } from './my-entity-delete-dialog.component';

@Component({
  selector: 'jhi-my-entity',
  templateUrl: './my-entity.component.html'
})
export class MyEntityComponent implements OnInit, OnDestroy {
  myEntities?: IMyEntity[];
  eventSubscriber?: Subscription;

  constructor(protected myEntityService: MyEntityService, protected eventManager: JhiEventManager, protected modalService: NgbModal) {}

  loadAll(): void {
    this.myEntityService.query().subscribe((res: HttpResponse<IMyEntity[]>) => {
      this.myEntities = res.body ? res.body : [];
    });
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInMyEntities();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: IMyEntity): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInMyEntities(): void {
    this.eventSubscriber = this.eventManager.subscribe('myEntityListModification', () => this.loadAll());
  }

  delete(myEntity: IMyEntity): void {
    const modalRef = this.modalService.open(MyEntityDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.myEntity = myEntity;
  }
}
