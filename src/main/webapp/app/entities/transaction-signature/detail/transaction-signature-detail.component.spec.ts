import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { TransactionSignatureDetailComponent } from './transaction-signature-detail.component';

describe('Component Tests', () => {
  describe('TransactionSignature Management Detail Component', () => {
    let comp: TransactionSignatureDetailComponent;
    let fixture: ComponentFixture<TransactionSignatureDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [TransactionSignatureDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ transactionSignature: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(TransactionSignatureDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(TransactionSignatureDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load transactionSignature on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.transactionSignature).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
