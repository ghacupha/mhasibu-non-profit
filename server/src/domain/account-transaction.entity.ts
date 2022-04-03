/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { TransactionAccount } from './transaction-account.entity';
import { TransactionClass } from './transaction-class.entity';
import { Placeholder } from './placeholder.entity';

/**
 * A AccountTransaction.
 */
@Entity('account_transaction')
export class AccountTransaction extends BaseEntity {
    @Column({ name: 'transaction_number', nullable: true })
    transactionNumber: string;

    @Column({ type: 'timestamptz', name: 'transaction_date', nullable: true })
    transactionDate: any;

    @Column({ name: 'particulars', nullable: true })
    particulars: string;

    @Column({ type: 'text', name: 'notes', nullable: true })
    notes: any;

    @Column({ type: 'decimal', name: 'transaction_amount', precision: 10, scale: 2 })
    transactionAmount: number;

    @ManyToOne((type) => TransactionAccount)
    debitAccount: TransactionAccount;

    @ManyToOne((type) => TransactionAccount)
    creditAccount: TransactionAccount;

    @ManyToOne((type) => TransactionClass)
    transactionClass: TransactionClass;

    @ManyToMany((type) => Placeholder)
    @JoinTable({
        name: 'rel_account_transaction__placeholder',
        joinColumn: { name: 'account_transaction_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'placeholder_id', referencedColumnName: 'id' },
    })
    placeholders: Placeholder[];

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
