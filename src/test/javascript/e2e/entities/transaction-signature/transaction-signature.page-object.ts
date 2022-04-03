import { element, by, ElementFinder } from 'protractor';

export class TransactionSignatureComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-transaction-signature div table .btn-danger'));
  title = element.all(by.css('jhi-transaction-signature div h2#page-heading span')).first();
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

export class TransactionSignatureUpdatePage {
  pageTitle = element(by.id('jhi-transaction-signature-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  idInput = element(by.id('field_id'));
  descriptionInput = element(by.id('field_description'));
  moduleAffectedInput = element(by.id('field_moduleAffected'));
  transactionTimeInput = element(by.id('field_transactionTime'));

  placeholdersSelect = element(by.id('field_placeholders'));
  userSelect = element(by.id('field_user'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }

  async setIdInput(id: string): Promise<void> {
    await this.idInput.sendKeys(id);
  }

  async getIdInput(): Promise<string> {
    return await this.idInput.getAttribute('value');
  }

  async setDescriptionInput(description: string): Promise<void> {
    await this.descriptionInput.sendKeys(description);
  }

  async getDescriptionInput(): Promise<string> {
    return await this.descriptionInput.getAttribute('value');
  }

  async setModuleAffectedInput(moduleAffected: string): Promise<void> {
    await this.moduleAffectedInput.sendKeys(moduleAffected);
  }

  async getModuleAffectedInput(): Promise<string> {
    return await this.moduleAffectedInput.getAttribute('value');
  }

  async setTransactionTimeInput(transactionTime: string): Promise<void> {
    await this.transactionTimeInput.sendKeys(transactionTime);
  }

  async getTransactionTimeInput(): Promise<string> {
    return await this.transactionTimeInput.getAttribute('value');
  }

  async placeholdersSelectLastOption(): Promise<void> {
    await this.placeholdersSelect.all(by.tagName('option')).last().click();
  }

  async placeholdersSelectOption(option: string): Promise<void> {
    await this.placeholdersSelect.sendKeys(option);
  }

  getPlaceholdersSelect(): ElementFinder {
    return this.placeholdersSelect;
  }

  async getPlaceholdersSelectedOption(): Promise<string> {
    return await this.placeholdersSelect.element(by.css('option:checked')).getText();
  }

  async userSelectLastOption(): Promise<void> {
    await this.userSelect.all(by.tagName('option')).last().click();
  }

  async userSelectOption(option: string): Promise<void> {
    await this.userSelect.sendKeys(option);
  }

  getUserSelect(): ElementFinder {
    return this.userSelect;
  }

  async getUserSelectedOption(): Promise<string> {
    return await this.userSelect.element(by.css('option:checked')).getText();
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

export class TransactionSignatureDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-transactionSignature-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-transactionSignature'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getText();
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
