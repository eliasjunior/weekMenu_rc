import {Injectable} from "@angular/core";
import {ToastOptions, Toast} from "ionic-native";
import {Platform} from "ionic-angular";

@Injectable()
export class UtilService {

    public host : string;

    constructor(private platform: Platform) {

        //if chrome is on mobile it wont work
        if(this.platform.is('core')) {
           this.host = 'http://192.168.0.12:3002';
        } else {
          this.host = "https://week-menu-api.herokuapp.com";
        }
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
            message : this.getMessage(message),
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



    private getMessage(message) {

        let result = "Default error Log";

        if(message) {
            result = message.message  || message;
        }

        return result;
    }
}
