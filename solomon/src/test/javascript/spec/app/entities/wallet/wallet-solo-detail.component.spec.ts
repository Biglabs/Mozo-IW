/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { JhiDateUtils, JhiDataUtils, JhiEventManager } from 'ng-jhipster';
import { SolomonTestModule } from '../../../test.module';
import { MockActivatedRoute } from '../../../helpers/mock-route.service';
import { WalletSoloDetailComponent } from '../../../../../../main/webapp/app/entities/wallet/wallet-solo-detail.component';
import { WalletSoloService } from '../../../../../../main/webapp/app/entities/wallet/wallet-solo.service';
import { WalletSolo } from '../../../../../../main/webapp/app/entities/wallet/wallet-solo.model';

describe('Component Tests', () => {

    describe('WalletSolo Management Detail Component', () => {
        let comp: WalletSoloDetailComponent;
        let fixture: ComponentFixture<WalletSoloDetailComponent>;
        let service: WalletSoloService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [SolomonTestModule],
                declarations: [WalletSoloDetailComponent],
                providers: [
                    JhiDateUtils,
                    JhiDataUtils,
                    DatePipe,
                    {
                        provide: ActivatedRoute,
                        useValue: new MockActivatedRoute({id: 123})
                    },
                    WalletSoloService,
                    JhiEventManager
                ]
            }).overrideTemplate(WalletSoloDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(WalletSoloDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(WalletSoloService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
            // GIVEN

            spyOn(service, 'find').and.returnValue(Observable.of(new WalletSolo(10)));

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.find).toHaveBeenCalledWith(123);
            expect(comp.wallet).toEqual(jasmine.objectContaining({id: 10}));
            });
        });
    });

});
