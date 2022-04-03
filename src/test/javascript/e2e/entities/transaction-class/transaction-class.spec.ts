import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { TransactionClassComponentsPage, TransactionClassDeleteDialog, TransactionClassUpdatePage } from './transaction-class.page-object';

const expect = chai.expect;

describe('TransactionClass e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let transactionClassComponentsPage: TransactionClassComponentsPage;
  let transactionClassUpdatePage: TransactionClassUpdatePage;
  let transactionClassDeleteDialog: TransactionClassDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load TransactionClasses', async () => {
    await navBarPage.goToEntity('transaction-class');
    transactionClassComponentsPage = new TransactionClassComponentsPage();
    await browser.wait(ec.visibilityOf(transactionClassComponentsPage.title), 5000);
    expect(await transactionClassComponentsPage.getTitle()).to.eq('Transaction Classes');
    await browser.wait(
      ec.or(ec.visibilityOf(transactionClassComponentsPage.entities), ec.visibilityOf(transactionClassComponentsPage.noResult)),
      1000
    );
  });

  it('should load create TransactionClass page', async () => {
    await transactionClassComponentsPage.clickOnCreateButton();
    transactionClassUpdatePage = new TransactionClassUpdatePage();
    expect(await transactionClassUpdatePage.getPageTitle()).to.eq('Create or edit a Transaction Class');
    await transactionClassUpdatePage.cancel();
  });

  it('should create and save TransactionClasses', async () => {
    const nbButtonsBeforeCreate = await transactionClassComponentsPage.countDeleteButtons();

    await transactionClassComponentsPage.clickOnCreateButton();

    await promise.all([
      transactionClassUpdatePage.setTransactionClassInput('transactionClass'),
      transactionClassUpdatePage.setNotesInput('notes'),
      // transactionClassUpdatePage.placeholderSelectLastOption(),
    ]);

    expect(await transactionClassUpdatePage.getTransactionClassInput()).to.eq(
      'transactionClass',
      'Expected TransactionClass value to be equals to transactionClass'
    );
    expect(await transactionClassUpdatePage.getNotesInput()).to.eq('notes', 'Expected Notes value to be equals to notes');

    await transactionClassUpdatePage.save();
    expect(await transactionClassUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await transactionClassComponentsPage.countDeleteButtons()).to.eq(
      nbButtonsBeforeCreate + 1,
      'Expected one more entry in the table'
    );
  });

  it('should delete last TransactionClass', async () => {
    const nbButtonsBeforeDelete = await transactionClassComponentsPage.countDeleteButtons();
    await transactionClassComponentsPage.clickOnLastDeleteButton();

    transactionClassDeleteDialog = new TransactionClassDeleteDialog();
    expect(await transactionClassDeleteDialog.getDialogTitle()).to.eq('Are you sure you want to delete this Transaction Class?');
    await transactionClassDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(transactionClassComponentsPage.title), 5000);

    expect(await transactionClassComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
