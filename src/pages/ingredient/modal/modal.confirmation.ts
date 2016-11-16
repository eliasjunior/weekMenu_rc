import {Component} from "@angular/core";
import {ViewController, NavParams} from "ionic-angular";
/**
 * Created by eliasmj on 31/08/2016.
 */


@Component({
    templateUrl: 'modal-confirmation.html'
})

export class ModalConfirmation
{
    public contentMessage;
    constructor(
        private viewCtrl: ViewController,
        private params: NavParams)
    {
        console.log("Modal", this.params.get('contentMessage'))

        this.contentMessage = this.params.get('contentMessage');
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

    carryOut() {
        this.viewCtrl.dismiss('yes');
    }
}
