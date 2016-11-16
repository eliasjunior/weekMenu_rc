import {Component} from "@angular/core";
import {RecipeService} from "../recipe/recipe.service";
import {NavController, ModalController, LoadingController} from "ionic-angular";
import {ModalConfirmation} from "../ingredient/modal/modal.confirmation";
import {IngredientGeneratorComponent} from "../ingredient/ingredient.generator.component";
/**
 * Created by eliasmj on 18/09/2016.
 */


@Component({
    templateUrl: 'settings-component.html'
})
export class SettingsComponent
{
    constructor(
        public recipeService: RecipeService,
        public navController : NavController,
        public modalCtrl: ModalController,
        private loadingCtrl: LoadingController
    ){}

    backup() {
        //this is duplicating the db on my local couchDB server.
        //use the couch db tool to see the db, applications Apache couchDB

        let loader = this.loading();

        this.recipeService.syncDataBase()
            .on('complete', () => {

                this.alert('Success', 'Backup done!');
                this.hideLoading(loader);

            })
            .on('error', err => {

                //this.alert('Failed', 'Failed');
                console.error("Sync failed!", err);
                this.hideLoading(loader);
                this.handleError("Sync failed!", err);
            });
    }

    private loading() : any {

        let loader = this.loadingCtrl.create({
            content: "Please wait..."
        });

        loader.present();

        return loader;
    }

    private hideLoading(loader) {
        loader.dismiss();
    }

    importBackup() {
        this.recipeService.importSyncDataBase()
            .then(response => {

                this.alert('Success', 'Import done!');
                console.log("Success imported", response)

            })
            .catch(reason => {
                console.error("error to import", reason)
                this.handleError('Failed', 'Failed to import')
            })

    }

    showHistory() {
        console.log("showHistory");
        this.alert('info', 'Not done yet');

    }

    leftIngredients() {
        this.navController.push(IngredientGeneratorComponent);
    }

    loadBasicList() {
        this.recipeService.getJsonFile();

        this.recipeService.message('Load successful!')

        this.alert('Success', 'Loaded successfully')
    }

    deleteDb() {

        let modal = this.modalCtrl.create(ModalConfirmation, {'contentMessage' : 'Are you to delete the database ?'});

        modal.onDidDismiss(result => {
            console.log("result ", result);

            if(result === 'yes') {

                this.recipeService.deleteDb()
                    .then(response => {
                        this.alert(null, 'Deleted successfully, reload the app')

                        this.recipeService.initDB();
                    }).catch(reason => {
                    console.error('error to delete', reason)
                    this.alert('Error', 'Error to delete the db')
                });
            }

        });

        modal.present();
    }

    private alert(title, subTitle) {

        this.recipeService.message(title + " "+subTitle);

        // let alert = this.alertCtrl.create({
        //     title: title || 'Alert',
        //     subTitle: subTitle || 'Message',
        //     buttons: ['OK']
        // });
        // alert.present();
    }

    private handleError(message, reason) {
        console.error(message, reason);
        this.recipeService.messageError(message);
    }
}
