import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'placeholder',
        data: { pageTitle: 'Placeholders' },
        loadChildren: () => import('./placeholder/placeholder.module').then(m => m.PlaceholderModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
