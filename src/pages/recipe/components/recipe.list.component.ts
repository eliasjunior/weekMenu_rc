/**
 * Created by eliasmj on 08/08/2016.
 */
import {RecipeService} from "../services/recipe.service";
import {Component} from "@angular/core";
import {NavController, LoadingController, ModalController} from "ionic-angular";
import {RecipeComponent} from "./recipe.component";
import {Recipe} from "../recipe.model";
import {IngredientComponent} from "../../ingredient/components/Ingredient.component";
import {ModalSelectDays} from "../modal/modal.select.days";

@Component({
  templateUrl: 'recipe-list-component.html'
})

export class RecipeListComponent {

    public recipes : Recipe [] = [];
    public recipesTemp : Recipe [];

    constructor(private recipeService: RecipeService,
                public navCtrl: NavController,
                private loadingCtrl: LoadingController,
                public modalCtrl: ModalController
    ) {
    }

    ionViewDidEnter() {
        this.refreshList(null);
    }

    public addRecipe() {
        this.navCtrl.push(RecipeComponent);
    }

    public editIngredient(ingredientId) {
        this.navCtrl.push(IngredientComponent, {ingredientId : ingredientId});
    }

    public resetWeekList() {

        //TODO not api to update many at the moment

        let recipeWeek = this.recipes.filter(recipe => {
            return recipe.weekDay !== null || recipe.weekDay !== undefined;
        });

        let loader = this.getLoading();

        let loopCount = recipeWeek.length;

        if( loopCount > 0) {

            recipeWeek.forEach(recipe => {

                //we can use as well as a filter in the weekly menu
                recipe.weekDay = null;
                //do not show in the weekly menu
                recipe.isInMenuWeek = false;

                this.recipeService.saveRecipe(recipe)
                    .subscribe(() => {
                        if(--loopCount === 0) {
                            this.dismissLoader(loader, null);
                            this.refreshList(null);
                        }
                    }, err => {
                        this.dismissLoader(loader, null);
                        this.handleError(err);
                    })
            });
        }
    }

    public openModalDays(recipe: Recipe) {

        let modal = this.modalCtrl.create(ModalSelectDays);

        modal.onDidDismiss(result => {

            if(result) {

                recipe.weekDay = result;
                recipe.isInMenuWeek = true;

                this.recipeService.saveRecipe(recipe).subscribe(this.success, this.handleError)
            }
        });

        modal.present();
    }

    selectItem(recipe: Recipe) {

        this.navCtrl.push(RecipeComponent, {recipe});
    }

    getItems(ev: any) {

        // set val to the value of the searchbar
        let val = ev.target.value;

        this.initRecipe();

        // if the value is an empty string don't filter the items
        if (val && val.trim() != '') {

            this.recipes = this.recipes.filter(rec => {
                return rec.name.toLowerCase().indexOf(val.toLowerCase()) > -1
            });
        }
    }

    public refreshList(refresher) {

        let loader = this.getLoading();
        this.recipes = [];

        this.recipeService.getList()
            .subscribe(
                recipes => {
                    this.recipes = recipes;
                    if(this.recipes){
                        this.recipesTemp = this.recipes;
                    }

                    this.dismissLoader(loader, refresher);
                },
                err => {
                    this.dismissLoader(loader, refresher);
                    this.handleError(err);
                });
    }

    private getLoading() {
        let loader = this.loadingCtrl.create({
            content: "Please wait..."
        });

        loader.present();

        return loader;
    }

    private dismissLoader(loader, refresher) {
        if(refresher) {
            refresher.complete();
        }
        loader.dismiss();
        console.log("dismiss loading!")
    }

    private success(response) {

        console.log("Success updated", response)
    }
    private handleError(reason: any) {
        console.error("recipe error", reason)
    }

    private initRecipe() {
        this.recipes = this.recipesTemp;
    }
}
