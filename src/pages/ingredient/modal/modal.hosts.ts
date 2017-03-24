/**
 * Created by eliasmj on 19/01/2017.
 */
import {Component} from "@angular/core";
import {ViewController} from "ionic-angular";

@Component({
    templateUrl: 'modal-hosts.html'
})

export class ModalHosts
{
    public hosts: any [] = [
        {label: "work", url: 'http://10.157.196.224:3000'},
        {label: "home", url: 'http://192.168.0.12:3002'},
        {label: "Prod", url: 'https://week-menu-api.herokuapp.com'},
        {label: "custom", url: 'custom'}];
    public selectedHost: string;
    public customField: string = 'http://';
    constructor(
        private viewCtrl: ViewController)
    {

    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

    dismissSettingHost() {

        if(this.selectedHost !== "custom") {
            this.viewCtrl.dismiss(this.selectedHost);
        } else {
            this.viewCtrl.dismiss(this.customField);
        }

    }
}
