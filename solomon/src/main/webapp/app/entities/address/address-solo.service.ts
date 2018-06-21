import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { SERVER_API_URL } from '../../app.constants';

import { AddressSolo } from './address-solo.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class AddressSoloService {

    private resourceUrl = SERVER_API_URL + 'api/addresses';

    constructor(private http: Http) { }

    create(address: AddressSolo): Observable<AddressSolo> {
        const copy = this.convert(address);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    update(address: AddressSolo): Observable<AddressSolo> {
        const copy = this.convert(address);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    find(id: number): Observable<AddressSolo> {
        return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    query(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http.get(this.resourceUrl, options)
            .map((res: Response) => this.convertResponse(res));
    }

    delete(id: number): Observable<Response> {
        return this.http.delete(`${this.resourceUrl}/${id}`);
    }

    private convertResponse(res: Response): ResponseWrapper {
        const jsonResponse = res.json();
        const result = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            result.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return new ResponseWrapper(res.headers, result, res.status);
    }

    /**
     * Convert a returned JSON object to AddressSolo.
     */
    private convertItemFromServer(json: any): AddressSolo {
        const entity: AddressSolo = Object.assign(new AddressSolo(), json);
        return entity;
    }

    /**
     * Convert a AddressSolo to a JSON which can be sent to the server.
     */
    private convert(address: AddressSolo): AddressSolo {
        const copy: AddressSolo = Object.assign({}, address);
        return copy;
    }
}
