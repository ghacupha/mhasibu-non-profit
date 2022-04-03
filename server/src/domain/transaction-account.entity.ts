/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { TransactionAccountType } from './transaction-account-type.entity';
import { Placeholder } from './placeholder.entity';

/**
 * A TransactionAccount.
 */
@Entity('transaction_account')
export class TransactionAccount extends BaseEntity {
    @Column({ name: 'account_name', unique: true })
    accountName: string;

    @Column({ name: 'description', nullable: true })
    description: string;

    @Column({ type: 'text', name: 'notes', nullable: true })
    notes: any;

    @ManyToOne((type) => TransactionAccountType)
    transactionAccountType: TransactionAccountType;

    @ManyToMany((type) => Placeholder)
    @JoinTable({
        name: 'rel_transaction_account__placeholder',
        joinColumn: { name: 'transaction_account_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'placeholder_id', referencedColumnName: 'id' },
    })
    placeholders: Placeholder[];

    @ManyToOne((type) => TransactionAccount)
    parentAccount: TransactionAccount;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
