/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { BaseDTO } from './base.dto';

import { TransactionAccountDTO } from './transaction-account.dto';
import { TransactionClassDTO } from './transaction-class.dto';
import { PlaceholderDTO } from './placeholder.dto';

/**
 * A AccountTransactionDTO object.
 */
export class AccountTransactionDTO extends BaseDTO {
    @ApiModelProperty({ description: 'transactionNumber field', required: false })
    transactionNumber: string;

    @ApiModelProperty({ description: 'transactionDate field', required: false })
    transactionDate: any;

    @ApiModelProperty({ description: 'particulars field', required: false })
    particulars: string;

    @ApiModelProperty({ description: 'notes field', required: false })
    notes: any;

    @IsNotEmpty()
    @Min(0)
    @ApiModelProperty({ description: 'transactionAmount field' })
    transactionAmount: number;

    @ApiModelProperty({ type: TransactionAccountDTO, description: 'debitAccount relationship' })
    debitAccount: TransactionAccountDTO;

    @ApiModelProperty({ type: TransactionAccountDTO, description: 'creditAccount relationship' })
    creditAccount: TransactionAccountDTO;

    @ApiModelProperty({ type: TransactionClassDTO, description: 'transactionClass relationship' })
    transactionClass: TransactionClassDTO;

    @ApiModelProperty({ type: PlaceholderDTO, isArray: true, description: 'placeholders relationship' })
    placeholders: PlaceholderDTO[];

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
