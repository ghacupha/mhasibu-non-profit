import { element, by, ElementFinder } from 'protractor';

export class TransactionAccountComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-transaction-account div table .btn-danger'));
  title = element.all(by.css('jhi-transaction-account div h2#page-heading span')).first();
  noResult = element(by.id('no-result'));
  entities = element(by.id('entities'));

  async clickOnCreateButton(): Promise<void> {
    await this.createButton.click();
  }

  async clickOnLastDeleteButton(): Promise<void> {
    await this.deleteButtons.last().click();
  }

  async countDeleteButtons(): Promise<number> {
    return this.deleteButtons.count();
  }

  async getTitle(): Promise<string> {
    return this.title.getText();
  }
}

export class TransactionAccountUpdatePage {
  pageTitle = element(by.id('jhi-transaction-account-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  idInput = element(by.id('field_id'));
  accountNameInput = element(by.id('field_accountName'));
  descriptionInput = element(by.id('field_description'));
  notesInput = element(by.id('field_notes'));

  transactionAccountTypeSelect = element(by.id('field_transactionAccountType'));
  placeholderSelect = element(by.id('field_placeholder'));
  parentAccountSelect = element(by.id('field_parentAccount'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }

  async setIdInput(id: string): Promise<void> {
    await this.idInput.sendKeys(id);
  }

  async getIdInput(): Promise<string> {
    return await this.idInput.getAttribute('value');
  }

  async setAccountNameInput(accountName: string): Promise<void> {
    await this.accountNameInput.sendKeys(accountName);
  }

  async getAccountNameInput(): Promise<string> {
    return await this.accountNameInput.getAttribute('value');
  }

  async setDescriptionInput(description: string): Promise<void> {
    await this.descriptionInput.sendKeys(description);
  }

  async getDescriptionInput(): Promise<string> {
    return await this.descriptionInput.getAttribute('value');
  }

  async setNotesInput(notes: string): Promise<void> {
    await this.notesInput.sendKeys(notes);
  }

  async getNotesInput(): Promise<string> {
    return await this.notesInput.getAttribute('value');
  }

  async transactionAccountTypeSelectLastOption(): Promise<void> {
    await this.transactionAccountTypeSelect.all(by.tagName('option')).last().click();
  }

  async transactionAccountTypeSelectOption(option: string): Promise<void> {
    await this.transactionAccountTypeSelect.sendKeys(option);
  }

  getTransactionAccountTypeSelect(): ElementFinder {
    return this.transactionAccountTypeSelect;
  }

  async getTransactionAccountTypeSelectedOption(): Promise<string> {
    return await this.transactionAccountTypeSelect.element(by.css('option:checked')).getText();
  }

  async placeholderSelectLastOption(): Promise<void> {
    await this.placeholderSelect.all(by.tagName('option')).last().click();
  }

  async placeholderSelectOption(option: string): Promise<void> {
    await this.placeholderSelect.sendKeys(option);
  }

  getPlaceholderSelect(): ElementFinder {
    return this.placeholderSelect;
  }

  async getPlaceholderSelectedOption(): Promise<string> {
    return await this.placeholderSelect.element(by.css('option:checked')).getText();
  }

  async parentAccountSelectLastOption(): Promise<void> {
    await this.parentAccountSelect.all(by.tagName('option')).last().click();
  }

  async parentAccountSelectOption(option: string): Promise<void> {
    await this.parentAccountSelect.sendKeys(option);
  }

  getParentAccountSelect(): ElementFinder {
    return this.parentAccountSelect;
  }

  async getParentAccountSelectedOption(): Promise<string> {
    return await this.parentAccountSelect.element(by.css('option:checked')).getText();
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }

  getSaveButton(): ElementFinder {
    return this.saveButton;
  }
}

export class TransactionAccountDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-transactionAccount-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-transactionAccount'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getText();
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
