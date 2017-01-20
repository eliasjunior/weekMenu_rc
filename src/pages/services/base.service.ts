import "rxjs/add/observable/fromPromise";
import {Observable} from "rxjs";
import {Platform} from "ionic-angular";

export class BaseService {

    constructor(public  platform: Platform) {
        //for chrome
    }

    public errorHandler(message, reason: any) {
        console.error(reason);

        return Observable.throw(reason);
    }

}
