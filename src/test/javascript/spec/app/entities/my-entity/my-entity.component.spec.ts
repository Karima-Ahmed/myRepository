import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { MayAppTestModule } from '../../../test.module';
import { MyEntityComponent } from 'app/entities/my-entity/my-entity.component';
import { MyEntityService } from 'app/entities/my-entity/my-entity.service';
import { MyEntity } from 'app/shared/model/my-entity.model';

describe('Component Tests', () => {
  describe('MyEntity Management Component', () => {
    let comp: MyEntityComponent;
    let fixture: ComponentFixture<MyEntityComponent>;
    let service: MyEntityService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [MayAppTestModule],
        declarations: [MyEntityComponent],
        providers: []
      })
        .overrideTemplate(MyEntityComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(MyEntityComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(MyEntityService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new MyEntity(123)],
            headers
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.myEntities && comp.myEntities[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
