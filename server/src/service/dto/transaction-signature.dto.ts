/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { BaseDTO } from './base.dto';

import { PlaceholderDTO } from './placeholder.dto';

import { UserDTO } from './user.dto';

/**
 * A TransactionSignatureDTO object.
 */
export class TransactionSignatureDTO extends BaseDTO {
    @IsNotEmpty()
    @ApiModelProperty({ description: 'description field' })
    description: string;

    @ApiModelProperty({ description: 'moduleAffected field', required: false })
    moduleAffected: string;

    @ApiModelProperty({ description: 'transactionTimeStamp field', required: false })
    transactionTimeStamp: any;

    @ApiModelProperty({ type: PlaceholderDTO, isArray: true, description: 'placeholders relationship' })
    placeholders: PlaceholderDTO[];

    @ApiModelProperty({ type: UserDTO, description: 'user relationship' })
    user: UserDTO;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
