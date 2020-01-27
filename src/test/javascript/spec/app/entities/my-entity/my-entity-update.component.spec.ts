import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { MayAppTestModule } from '../../../test.module';
import { MyEntityUpdateComponent } from 'app/entities/my-entity/my-entity-update.component';
import { MyEntityService } from 'app/entities/my-entity/my-entity.service';
import { MyEntity } from 'app/shared/model/my-entity.model';

describe('Component Tests', () => {
  describe('MyEntity Management Update Component', () => {
    let comp: MyEntityUpdateComponent;
    let fixture: ComponentFixture<MyEntityUpdateComponent>;
    let service: MyEntityService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [MayAppTestModule],
        declarations: [MyEntityUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(MyEntityUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(MyEntityUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(MyEntityService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new MyEntity(123);
        spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.update).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));

      it('Should call create service on save for new entity', fakeAsync(() => {
        // GIVEN
        const entity = new MyEntity();
        spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.create).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));
    });
  });
});
