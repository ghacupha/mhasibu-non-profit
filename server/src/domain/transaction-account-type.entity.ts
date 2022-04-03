/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { Placeholder } from './placeholder.entity';

/**
 * A TransactionAccountType.
 */
@Entity('transaction_account_type')
export class TransactionAccountType extends BaseEntity {
    @Column({ name: 'account_type', unique: true })
    accountType: string;

    @Column({ type: 'text', name: 'description', nullable: true })
    description: any;

    @ManyToMany((type) => Placeholder)
    @JoinTable({
        name: 'rel_transaction_account_type__placeholder',
        joinColumn: { name: 'transaction_account_type_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'placeholder_id', referencedColumnName: 'id' },
    })
    placeholders: Placeholder[];

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
