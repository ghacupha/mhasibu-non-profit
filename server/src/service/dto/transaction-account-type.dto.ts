/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { BaseDTO } from './base.dto';

import { PlaceholderDTO } from './placeholder.dto';

/**
 * A TransactionAccountTypeDTO object.
 */
export class TransactionAccountTypeDTO extends BaseDTO {
    @IsNotEmpty()
    @ApiModelProperty({ description: 'accountType field' })
    accountType: string;

    @ApiModelProperty({ description: 'description field', required: false })
    description: any;

    @ApiModelProperty({ type: PlaceholderDTO, isArray: true, description: 'placeholders relationship' })
    placeholders: PlaceholderDTO[];

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
