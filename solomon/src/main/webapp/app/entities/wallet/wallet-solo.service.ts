import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { SERVER_API_URL } from '../../app.constants';

import { WalletSolo } from './wallet-solo.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class WalletSoloService {

    private resourceUrl = SERVER_API_URL + 'api/wallets';

    constructor(private http: Http) { }

    create(wallet: WalletSolo): Observable<WalletSolo> {
        const copy = this.convert(wallet);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    update(wallet: WalletSolo): Observable<WalletSolo> {
        const copy = this.convert(wallet);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    find(id: number): Observable<WalletSolo> {
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
     * Convert a returned JSON object to WalletSolo.
     */
    private convertItemFromServer(json: any): WalletSolo {
        const entity: WalletSolo = Object.assign(new WalletSolo(), json);
        return entity;
    }

    /**
     * Convert a WalletSolo to a JSON which can be sent to the server.
     */
    private convert(wallet: WalletSolo): WalletSolo {
        const copy: WalletSolo = Object.assign({}, wallet);
        return copy;
    }
}
