/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { BaseDTO } from './base.dto';

import { TransactionAccountTypeDTO } from './transaction-account-type.dto';
import { PlaceholderDTO } from './placeholder.dto';

/**
 * A TransactionAccountDTO object.
 */
export class TransactionAccountDTO extends BaseDTO {
    @IsNotEmpty()
    @ApiModelProperty({ description: 'accountName field' })
    accountName: string;

    @ApiModelProperty({ description: 'description field', required: false })
    description: string;

    @ApiModelProperty({ description: 'notes field', required: false })
    notes: any;

    @ApiModelProperty({ type: TransactionAccountTypeDTO, description: 'transactionAccountType relationship' })
    transactionAccountType: TransactionAccountTypeDTO;

    @ApiModelProperty({ type: PlaceholderDTO, isArray: true, description: 'placeholders relationship' })
    placeholders: PlaceholderDTO[];

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
