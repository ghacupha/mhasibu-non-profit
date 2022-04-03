import { browser, ExpectedConditions as ec, protractor, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import {
  TransactionSignatureComponentsPage,
  TransactionSignatureDeleteDialog,
  TransactionSignatureUpdatePage,
} from './transaction-signature.page-object';

const expect = chai.expect;

describe('TransactionSignature e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let transactionSignatureComponentsPage: TransactionSignatureComponentsPage;
  let transactionSignatureUpdatePage: TransactionSignatureUpdatePage;
  let transactionSignatureDeleteDialog: TransactionSignatureDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load TransactionSignatures', async () => {
    await navBarPage.goToEntity('transaction-signature');
    transactionSignatureComponentsPage = new TransactionSignatureComponentsPage();
    await browser.wait(ec.visibilityOf(transactionSignatureComponentsPage.title), 5000);
    expect(await transactionSignatureComponentsPage.getTitle()).to.eq('Transaction Signatures');
    await browser.wait(
      ec.or(ec.visibilityOf(transactionSignatureComponentsPage.entities), ec.visibilityOf(transactionSignatureComponentsPage.noResult)),
      1000
    );
  });

  it('should load create TransactionSignature page', async () => {
    await transactionSignatureComponentsPage.clickOnCreateButton();
    transactionSignatureUpdatePage = new TransactionSignatureUpdatePage();
    expect(await transactionSignatureUpdatePage.getPageTitle()).to.eq('Create or edit a Transaction Signature');
    await transactionSignatureUpdatePage.cancel();
  });

  it('should create and save TransactionSignatures', async () => {
    const nbButtonsBeforeCreate = await transactionSignatureComponentsPage.countDeleteButtons();

    await transactionSignatureComponentsPage.clickOnCreateButton();

    await promise.all([
      transactionSignatureUpdatePage.setDescriptionInput('description'),
      transactionSignatureUpdatePage.setModuleAffectedInput('moduleAffected'),
      transactionSignatureUpdatePage.setTransactionTimeStampInput('01/01/2001' + protractor.Key.TAB + '02:30AM'),
      // transactionSignatureUpdatePage.placeholdersSelectLastOption(),
      transactionSignatureUpdatePage.userSelectLastOption(),
    ]);

    expect(await transactionSignatureUpdatePage.getDescriptionInput()).to.eq(
      'description',
      'Expected Description value to be equals to description'
    );
    expect(await transactionSignatureUpdatePage.getModuleAffectedInput()).to.eq(
      'moduleAffected',
      'Expected ModuleAffected value to be equals to moduleAffected'
    );
    expect(await transactionSignatureUpdatePage.getTransactionTimeStampInput()).to.contain(
      '2001-01-01T02:30',
      'Expected transactionTimeStamp value to be equals to 2000-12-31'
    );

    await transactionSignatureUpdatePage.save();
    expect(await transactionSignatureUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await transactionSignatureComponentsPage.countDeleteButtons()).to.eq(
      nbButtonsBeforeCreate + 1,
      'Expected one more entry in the table'
    );
  });

  it('should delete last TransactionSignature', async () => {
    const nbButtonsBeforeDelete = await transactionSignatureComponentsPage.countDeleteButtons();
    await transactionSignatureComponentsPage.clickOnLastDeleteButton();

    transactionSignatureDeleteDialog = new TransactionSignatureDeleteDialog();
    expect(await transactionSignatureDeleteDialog.getDialogTitle()).to.eq('Are you sure you want to delete this Transaction Signature?');
    await transactionSignatureDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(transactionSignatureComponentsPage.title), 5000);

    expect(await transactionSignatureComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
