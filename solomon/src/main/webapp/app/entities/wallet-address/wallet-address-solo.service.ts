import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { SERVER_API_URL } from '../../app.constants';

import { WalletAddressSolo } from './wallet-address-solo.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class WalletAddressSoloService {

    private resourceUrl = SERVER_API_URL + 'api/wallet-addresses';

    constructor(private http: Http) { }

    create(walletAddress: WalletAddressSolo): Observable<WalletAddressSolo> {
        const copy = this.convert(walletAddress);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    update(walletAddress: WalletAddressSolo): Observable<WalletAddressSolo> {
        const copy = this.convert(walletAddress);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    find(id: number): Observable<WalletAddressSolo> {
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
     * Convert a returned JSON object to WalletAddressSolo.
     */
    private convertItemFromServer(json: any): WalletAddressSolo {
        const entity: WalletAddressSolo = Object.assign(new WalletAddressSolo(), json);
        return entity;
    }

    /**
     * Convert a WalletAddressSolo to a JSON which can be sent to the server.
     */
    private convert(walletAddress: WalletAddressSolo): WalletAddressSolo {
        const copy: WalletAddressSolo = Object.assign({}, walletAddress);
        return copy;
    }
}
