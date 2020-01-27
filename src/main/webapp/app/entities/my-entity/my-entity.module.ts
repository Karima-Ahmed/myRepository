import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MayAppSharedModule } from 'app/shared/shared.module';
import { MyEntityComponent } from './my-entity.component';
import { MyEntityDetailComponent } from './my-entity-detail.component';
import { MyEntityUpdateComponent } from './my-entity-update.component';
import { MyEntityDeleteDialogComponent } from './my-entity-delete-dialog.component';
import { myEntityRoute } from './my-entity.route';

@NgModule({
  imports: [MayAppSharedModule, RouterModule.forChild(myEntityRoute)],
  declarations: [MyEntityComponent, MyEntityDetailComponent, MyEntityUpdateComponent, MyEntityDeleteDialogComponent],
  entryComponents: [MyEntityDeleteDialogComponent]
})
export class MayAppMyEntityModule {}
