/**
 * Created by eliasmj on 05/08/2016.
 */
import 'rxjs/add/observable/fromPromise';
import {Observable} from "rxjs";
import {Toast, ToastOptions} from "ionic-native";

export class BaseService {

    public host : String = "http://localhost:3000";

    constructor() {
        //for chrome
    }

    public message(message) {

        let options : ToastOptions =  {
            styling : {backgroundColor : '#32db64'},
            message : message,
            position: 'top'
        } ;

        Toast.showWithOptions(options)
            .subscribe(null, err => {
                console.error("toast failed", err);
            });
    }

    public messageError(message) {

        let options : ToastOptions =    {
            styling : {backgroundColor : '#ed0c0c'},
            message : message,
            position: 'top'
        } ;

        console.log("Should show toast error message")

        Toast.showWithOptions(options)
            .subscribe(null, err => {
                console.error("toast failed", err);
            });
    }

    deleteDb() {

    }

    add(object) {

    }

    update(object) {


    }


    public errorHandler(message, reason: any) {
        console.error(reason);

        return Observable.throw(reason);
    }

}
