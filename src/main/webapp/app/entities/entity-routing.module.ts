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
      {
        path: 'transaction-signature',
        data: { pageTitle: 'TransactionSignatures' },
        loadChildren: () => import('./transaction-signature/transaction-signature.module').then(m => m.TransactionSignatureModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
