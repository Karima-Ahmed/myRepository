import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { IMyEntity, MyEntity } from 'app/shared/model/my-entity.model';
import { MyEntityService } from './my-entity.service';

@Component({
  selector: 'jhi-my-entity-update',
  templateUrl: './my-entity-update.component.html'
})
export class MyEntityUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    name: [],
    age: []
  });

  constructor(protected myEntityService: MyEntityService, protected activatedRoute: ActivatedRoute, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ myEntity }) => {
      this.updateForm(myEntity);
    });
  }

  updateForm(myEntity: IMyEntity): void {
    this.editForm.patchValue({
      id: myEntity.id,
      name: myEntity.name,
      age: myEntity.age
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const myEntity = this.createFromForm();
    if (myEntity.id !== undefined) {
      this.subscribeToSaveResponse(this.myEntityService.update(myEntity));
    } else {
      this.subscribeToSaveResponse(this.myEntityService.create(myEntity));
    }
  }

  private createFromForm(): IMyEntity {
    return {
      ...new MyEntity(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      age: this.editForm.get(['age'])!.value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMyEntity>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }
}
