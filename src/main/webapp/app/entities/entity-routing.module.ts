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
      {
        path: 'transaction-account-type',
        data: { pageTitle: 'TransactionAccountTypes' },
        loadChildren: () => import('./transaction-account-type/transaction-account-type.module').then(m => m.TransactionAccountTypeModule),
      },
      {
        path: 'transaction-account',
        data: { pageTitle: 'TransactionAccounts' },
        loadChildren: () => import('./transaction-account/transaction-account.module').then(m => m.TransactionAccountModule),
      },
      {
        path: 'transaction-class',
        data: { pageTitle: 'TransactionClasses' },
        loadChildren: () => import('./transaction-class/transaction-class.module').then(m => m.TransactionClassModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
