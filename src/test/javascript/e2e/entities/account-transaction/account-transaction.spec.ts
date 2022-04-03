import { browser, ExpectedConditions as ec /* , protractor, promise */ } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import {
  AccountTransactionComponentsPage,
  /* AccountTransactionDeleteDialog, */
  AccountTransactionUpdatePage,
} from './account-transaction.page-object';

const expect = chai.expect;

describe('AccountTransaction e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let accountTransactionComponentsPage: AccountTransactionComponentsPage;
  let accountTransactionUpdatePage: AccountTransactionUpdatePage;
  /* let accountTransactionDeleteDialog: AccountTransactionDeleteDialog; */
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load AccountTransactions', async () => {
    await navBarPage.goToEntity('account-transaction');
    accountTransactionComponentsPage = new AccountTransactionComponentsPage();
    await browser.wait(ec.visibilityOf(accountTransactionComponentsPage.title), 5000);
    expect(await accountTransactionComponentsPage.getTitle()).to.eq('Account Transactions');
    await browser.wait(
      ec.or(ec.visibilityOf(accountTransactionComponentsPage.entities), ec.visibilityOf(accountTransactionComponentsPage.noResult)),
      1000
    );
  });

  it('should load create AccountTransaction page', async () => {
    await accountTransactionComponentsPage.clickOnCreateButton();
    accountTransactionUpdatePage = new AccountTransactionUpdatePage();
    expect(await accountTransactionUpdatePage.getPageTitle()).to.eq('Create or edit a Account Transaction');
    await accountTransactionUpdatePage.cancel();
  });

  /* it('should create and save AccountTransactions', async () => {
        const nbButtonsBeforeCreate = await accountTransactionComponentsPage.countDeleteButtons();

        await accountTransactionComponentsPage.clickOnCreateButton();

        await promise.all([
            accountTransactionUpdatePage.setTransactionNumberInput('transactionNumber'),
            accountTransactionUpdatePage.setTransactionDateInput('01/01/2001' + protractor.Key.TAB + '02:30AM'),
            accountTransactionUpdatePage.setParticularsInput('particulars'),
            accountTransactionUpdatePage.setNotesInput('notes'),
            accountTransactionUpdatePage.setTransactionAmountInput('5'),
            accountTransactionUpdatePage.debitAccountSelectLastOption(),
            accountTransactionUpdatePage.creditAccountSelectLastOption(),
            accountTransactionUpdatePage.transactionClassSelectLastOption(),
            // accountTransactionUpdatePage.placeholderSelectLastOption(),
        ]);

        expect(await accountTransactionUpdatePage.getTransactionNumberInput()).to.eq('transactionNumber', 'Expected TransactionNumber value to be equals to transactionNumber');
        expect(await accountTransactionUpdatePage.getTransactionDateInput()).to.contain('2001-01-01T02:30', 'Expected transactionDate value to be equals to 2000-12-31');
        expect(await accountTransactionUpdatePage.getParticularsInput()).to.eq('particulars', 'Expected Particulars value to be equals to particulars');
        expect(await accountTransactionUpdatePage.getNotesInput()).to.eq('notes', 'Expected Notes value to be equals to notes');
        expect(await accountTransactionUpdatePage.getTransactionAmountInput()).to.eq('5', 'Expected transactionAmount value to be equals to 5');

        await accountTransactionUpdatePage.save();
        expect(await accountTransactionUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

        expect(await accountTransactionComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
    }); */

  /* it('should delete last AccountTransaction', async () => {
        const nbButtonsBeforeDelete = await accountTransactionComponentsPage.countDeleteButtons();
        await accountTransactionComponentsPage.clickOnLastDeleteButton();

        accountTransactionDeleteDialog = new AccountTransactionDeleteDialog();
        expect(await accountTransactionDeleteDialog.getDialogTitle())
            .to.eq('Are you sure you want to delete this Account Transaction?');
        await accountTransactionDeleteDialog.clickOnConfirmButton();
        await browser.wait(ec.visibilityOf(accountTransactionComponentsPage.title), 5000);

        expect(await accountTransactionComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
    }); */

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
