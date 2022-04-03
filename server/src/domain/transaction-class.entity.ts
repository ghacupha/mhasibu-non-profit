/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { Placeholder } from './placeholder.entity';

/**
 * A TransactionClass.
 */
@Entity('transaction_class')
export class TransactionClass extends BaseEntity {
    @Column({ name: 'transaction_class', unique: true })
    transactionClass: string;

    @Column({ type: 'text', name: 'notes', nullable: true })
    notes: any;

    @ManyToMany((type) => Placeholder)
    @JoinTable({
        name: 'rel_transaction_class__placeholder',
        joinColumn: { name: 'transaction_class_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'placeholder_id', referencedColumnName: 'id' },
    })
    placeholders: Placeholder[];

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
