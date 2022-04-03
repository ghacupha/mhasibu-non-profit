import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import {
  TransactionAccountTypeComponentsPage,
  TransactionAccountTypeDeleteDialog,
  TransactionAccountTypeUpdatePage,
} from './transaction-account-type.page-object';

const expect = chai.expect;

describe('TransactionAccountType e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let transactionAccountTypeComponentsPage: TransactionAccountTypeComponentsPage;
  let transactionAccountTypeUpdatePage: TransactionAccountTypeUpdatePage;
  let transactionAccountTypeDeleteDialog: TransactionAccountTypeDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load TransactionAccountTypes', async () => {
    await navBarPage.goToEntity('transaction-account-type');
    transactionAccountTypeComponentsPage = new TransactionAccountTypeComponentsPage();
    await browser.wait(ec.visibilityOf(transactionAccountTypeComponentsPage.title), 5000);
    expect(await transactionAccountTypeComponentsPage.getTitle()).to.eq('Transaction Account Types');
    await browser.wait(
      ec.or(ec.visibilityOf(transactionAccountTypeComponentsPage.entities), ec.visibilityOf(transactionAccountTypeComponentsPage.noResult)),
      1000
    );
  });

  it('should load create TransactionAccountType page', async () => {
    await transactionAccountTypeComponentsPage.clickOnCreateButton();
    transactionAccountTypeUpdatePage = new TransactionAccountTypeUpdatePage();
    expect(await transactionAccountTypeUpdatePage.getPageTitle()).to.eq('Create or edit a Transaction Account Type');
    await transactionAccountTypeUpdatePage.cancel();
  });

  it('should create and save TransactionAccountTypes', async () => {
    const nbButtonsBeforeCreate = await transactionAccountTypeComponentsPage.countDeleteButtons();

    await transactionAccountTypeComponentsPage.clickOnCreateButton();

    await promise.all([
      transactionAccountTypeUpdatePage.setAccountTypeInput('accountType'),
      transactionAccountTypeUpdatePage.setDescriptionInput('description'),
      // transactionAccountTypeUpdatePage.placeholderSelectLastOption(),
    ]);

    expect(await transactionAccountTypeUpdatePage.getAccountTypeInput()).to.eq(
      'accountType',
      'Expected AccountType value to be equals to accountType'
    );
    expect(await transactionAccountTypeUpdatePage.getDescriptionInput()).to.eq(
      'description',
      'Expected Description value to be equals to description'
    );

    await transactionAccountTypeUpdatePage.save();
    expect(await transactionAccountTypeUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await transactionAccountTypeComponentsPage.countDeleteButtons()).to.eq(
      nbButtonsBeforeCreate + 1,
      'Expected one more entry in the table'
    );
  });

  it('should delete last TransactionAccountType', async () => {
    const nbButtonsBeforeDelete = await transactionAccountTypeComponentsPage.countDeleteButtons();
    await transactionAccountTypeComponentsPage.clickOnLastDeleteButton();

    transactionAccountTypeDeleteDialog = new TransactionAccountTypeDeleteDialog();
    expect(await transactionAccountTypeDeleteDialog.getDialogTitle()).to.eq(
      'Are you sure you want to delete this Transaction Account Type?'
    );
    await transactionAccountTypeDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(transactionAccountTypeComponentsPage.title), 5000);

    expect(await transactionAccountTypeComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
