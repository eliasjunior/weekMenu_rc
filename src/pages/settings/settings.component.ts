import {Component} from "@angular/core";
import {RecipeService} from "../recipe/recipe.service";
import {NavController, ModalController} from "ionic-angular";
import {IngredientGeneratorComponent} from "../ingredient/components/ingredient.generator.component";
import {ModalHosts} from "../ingredient/modal/modal.hosts";
import {IngredientService} from "../ingredient/services/ingredient.service";
import {UtilService} from "../services/util.service";
/**
 * Created by eliasmj on 18/09/2016.
 */


@Component({
    templateUrl: 'settings-component.html'
})
export class SettingsComponent
{
    constructor(
        private recipeService: RecipeService,
        private ingredientService: IngredientService,
        private navController : NavController,
        private modalCtrl: ModalController,
        private utilService: UtilService
    ){}

    setServerApi() {

        let modal = this.modalCtrl.create(ModalHosts);

        modal.onDidDismiss(result => {
            console.log("result ", result);

            this.recipeService.recipeApiService.host = result;
            this.ingredientService.ingredientApiService.host = result;
        });

        modal.present();
    }

    showHistory() {
        console.log("showHistory");
        this.alert('info', 'Not done yet');

    }

    leftIngredients() {
        this.navController.push(IngredientGeneratorComponent);
    }

    loadBasicList() {
        //this.recipeService.getJsonFile();

        //TODO get from DB

        this.utilService.message('Load successful!')

        this.alert('Success', 'Loaded successfully')
    }

    private alert(title, subTitle) {

        this.utilService.message(title + " "+subTitle);
    }

}
