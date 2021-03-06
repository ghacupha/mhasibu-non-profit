/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

/**
 * A Placeholder.
 */
@Entity('placeholder')
export class Placeholder extends BaseEntity {
    @Column({ name: 'description', unique: true })
    description: string;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
