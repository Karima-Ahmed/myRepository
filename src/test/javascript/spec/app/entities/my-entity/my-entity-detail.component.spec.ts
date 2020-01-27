import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MayAppTestModule } from '../../../test.module';
import { MyEntityDetailComponent } from 'app/entities/my-entity/my-entity-detail.component';
import { MyEntity } from 'app/shared/model/my-entity.model';

describe('Component Tests', () => {
  describe('MyEntity Management Detail Component', () => {
    let comp: MyEntityDetailComponent;
    let fixture: ComponentFixture<MyEntityDetailComponent>;
    const route = ({ data: of({ myEntity: new MyEntity(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [MayAppTestModule],
        declarations: [MyEntityDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(MyEntityDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(MyEntityDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load myEntity on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.myEntity).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
