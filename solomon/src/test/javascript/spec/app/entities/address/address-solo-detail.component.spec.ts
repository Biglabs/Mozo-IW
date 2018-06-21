/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { JhiDateUtils, JhiDataUtils, JhiEventManager } from 'ng-jhipster';
import { SolomonTestModule } from '../../../test.module';
import { MockActivatedRoute } from '../../../helpers/mock-route.service';
import { AddressSoloDetailComponent } from '../../../../../../main/webapp/app/entities/address/address-solo-detail.component';
import { AddressSoloService } from '../../../../../../main/webapp/app/entities/address/address-solo.service';
import { AddressSolo } from '../../../../../../main/webapp/app/entities/address/address-solo.model';

describe('Component Tests', () => {

    describe('AddressSolo Management Detail Component', () => {
        let comp: AddressSoloDetailComponent;
        let fixture: ComponentFixture<AddressSoloDetailComponent>;
        let service: AddressSoloService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [SolomonTestModule],
                declarations: [AddressSoloDetailComponent],
                providers: [
                    JhiDateUtils,
                    JhiDataUtils,
                    DatePipe,
                    {
                        provide: ActivatedRoute,
                        useValue: new MockActivatedRoute({id: 123})
                    },
                    AddressSoloService,
                    JhiEventManager
                ]
            }).overrideTemplate(AddressSoloDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(AddressSoloDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(AddressSoloService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
            // GIVEN

            spyOn(service, 'find').and.returnValue(Observable.of(new AddressSolo(10)));

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.find).toHaveBeenCalledWith(123);
            expect(comp.address).toEqual(jasmine.objectContaining({id: 10}));
            });
        });
    });

});
