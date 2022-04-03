/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { BaseDTO } from './base.dto';

/**
 * A PlaceholderDTO object.
 */
export class PlaceholderDTO extends BaseDTO {
    @IsNotEmpty()
    @ApiModelProperty({ description: 'description field' })
    description: string;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
