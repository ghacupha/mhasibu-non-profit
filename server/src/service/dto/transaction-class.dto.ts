/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { BaseDTO } from './base.dto';

import { PlaceholderDTO } from './placeholder.dto';

/**
 * A TransactionClassDTO object.
 */
export class TransactionClassDTO extends BaseDTO {
    @IsNotEmpty()
    @ApiModelProperty({ description: 'transactionClass field' })
    transactionClass: string;

    @ApiModelProperty({ description: 'notes field', required: false })
    notes: any;

    @ApiModelProperty({ type: PlaceholderDTO, isArray: true, description: 'placeholders relationship' })
    placeholders: PlaceholderDTO[];

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
