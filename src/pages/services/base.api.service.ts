import {Injectable} from "@angular/core";
import {Response} from "@angular/http";
import {Observable} from "rxjs";

@Injectable()
export class BaseApiService {

    public host : String = "http://localhost:3000";

    constructor() {

    }

    public extractData(res: Response) {
        let body = res.json();
        return body || { };
    }

    public handleError(error: Response | any) {
        console.error(error);
        return Observable.throw("");
    }
}
