import {Injectable} from "@angular/core";
import {ToastOptions, Toast} from "ionic-native";
import {Platform} from "ionic-angular";

@Injectable()
export class UtilService {
    constructor(
                private platform: Platform
               ) {

    }


    public hideLoading(loader) {
        loader.dismiss();
    }

    public handleError(err) {
        console.error(err)
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

}
