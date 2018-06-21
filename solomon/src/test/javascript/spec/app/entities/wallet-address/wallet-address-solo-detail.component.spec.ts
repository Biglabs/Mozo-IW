/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { JhiDateUtils, JhiDataUtils, JhiEventManager } from 'ng-jhipster';
import { SolomonTestModule } from '../../../test.module';
import { MockActivatedRoute } from '../../../helpers/mock-route.service';
import { WalletAddressSoloDetailComponent } from '../../../../../../main/webapp/app/entities/wallet-address/wallet-address-solo-detail.component';
import { WalletAddressSoloService } from '../../../../../../main/webapp/app/entities/wallet-address/wallet-address-solo.service';
import { WalletAddressSolo } from '../../../../../../main/webapp/app/entities/wallet-address/wallet-address-solo.model';

describe('Component Tests', () => {

    describe('WalletAddressSolo Management Detail Component', () => {
        let comp: WalletAddressSoloDetailComponent;
        let fixture: ComponentFixture<WalletAddressSoloDetailComponent>;
        let service: WalletAddressSoloService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [SolomonTestModule],
                declarations: [WalletAddressSoloDetailComponent],
                providers: [
                    JhiDateUtils,
                    JhiDataUtils,
                    DatePipe,
                    {
                        provide: ActivatedRoute,
                        useValue: new MockActivatedRoute({id: 123})
                    },
                    WalletAddressSoloService,
                    JhiEventManager
                ]
            }).overrideTemplate(WalletAddressSoloDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(WalletAddressSoloDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(WalletAddressSoloService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
            // GIVEN

            spyOn(service, 'find').and.returnValue(Observable.of(new WalletAddressSolo(10)));

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.find).toHaveBeenCalledWith(123);
            expect(comp.walletAddress).toEqual(jasmine.objectContaining({id: 10}));
            });
        });
    });

});
