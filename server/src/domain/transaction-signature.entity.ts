/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { Placeholder } from './placeholder.entity';

import { User } from './user.entity';

/**
 * A TransactionSignature.
 */
@Entity('transaction_signature')
export class TransactionSignature extends BaseEntity {
    @Column({ name: 'description' })
    description: string;

    @Column({ name: 'module_affected', nullable: true })
    moduleAffected: string;

    @ManyToMany((type) => Placeholder)
    @JoinTable({
        name: 'rel_transaction_signature__placeholders',
        joinColumn: { name: 'transaction_signature_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'placeholders_id', referencedColumnName: 'id' },
    })
    placeholders: Placeholder[];

    @ManyToOne((type) => User)
    user: User;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
