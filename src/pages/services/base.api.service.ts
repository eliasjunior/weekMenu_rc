import {Injectable} from "@angular/core";
import {Response, Headers, RequestOptions} from "@angular/http";
import {Observable} from "rxjs";

@Injectable()
export class BaseApiService {



    constructor() {

    }

    public extractData(res: Response) {

        if(res.status === 204) {
            return {}
        } else {
            let body = res.json();
            return body || { };
        }
    }

    public handleError(error: Response | any) {
        let body = error.json();

        return Observable.throw(body);
    }

    public getHeadersOption() {

        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return options;
    }
}
