/**
 * Created by eliasmj on 05/08/2016.
 */
import 'rxjs/add/observable/fromPromise';
import {Observable} from "rxjs";
import {Toast, ToastOptions} from "ionic-native";
import { Platform } from 'ionic-angular';

export class BaseService {

    public host : String = "http://localhost:3000";

    constructor(public  platform: Platform) {
        //for chrome
    }

    public message(message) {

        let options : ToastOptions =  {
            styling : {backgroundColor : '#32db64'},
            message : message,
            position: 'top'
        };

        console.log(">>>", this.platform.is('core'))

        if(!this.platform.is('core')) {

            Toast.showWithOptions(options)
                .subscribe(null, err => {
                    console.error("toast failed", err);
                });
        } else {
            console.log("Toast message", message);
        }

    }

    public messageError(message) {

        let options : ToastOptions =    {
            styling : {backgroundColor : '#ed0c0c'},
            message : message,
            position: 'top'
        } ;

        console.log("Should show toast error message");

        if(!this.platform.is('core')) {

            Toast.showWithOptions(options)
                .subscribe(null, err => {
                    console.error("toast failed", err);
                });
        } else {
            console.log("Toast message", message);
        }
    }
    public errorHandler(message, reason: any) {
        console.error(reason);

        return Observable.throw(reason);
    }

}
