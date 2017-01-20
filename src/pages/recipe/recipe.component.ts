/**
 * Created by eliasmj on 05/08/2016.
 */
import {Component, Input} from "@angular/core";
import {NavController, NavParams, LoadingController} from "ionic-angular";
import {IngredientComponent} from "../ingredient/components/Ingredient.component";
import {RecipeService} from "./recipe.service";
import {Recipe} from "./recipe.model";
import {IngredientListComponent} from "../ingredient/components/Ingredient.list.component";
import {UtilService} from "../services/util.service";

@Component({
    selector: 'recipe-component',
    templateUrl : 'recipe-component.html'
})

export class RecipeComponent {

    @Input() recipe: Recipe;
    public mainMeals = [];

    constructor(private navCtrl : NavController,
                private navParam : NavParams,
                private recipeService: RecipeService,
                private loadingCtrl: LoadingController,
                private utilService: UtilService){


        this.navCtrl = navCtrl;

        if(this.navParam.get('recipe')) {
            this.recipe = this.navParam.get('recipe');

        } else if(!this.recipe){

            this.recipe = new Recipe();
        }

        this.mainMeals = recipeService.getMainMealList();
     }

    ionViewDidEnter() {

        //get from here instead the attribute class recipe
        if(this.navParam.get('recipe')) {

            this.refreshListIngredients(null);

        }
    }

    public refreshListIngredients(refresher) {

        let loader = this.getLoading();

        this.recipeService.getRecipeCategories(this.recipe._id)
            .subscribe(
                recipe => {

                    this.recipe = recipe;

                    this.dismissLoader(loader, refresher);
                },
                err => {
                    console.error("Got here in the compononet", err)
                    this.dismissLoader(loader, refresher);
                });

    }


    public addIngredient(recipeId : string){

        if(!recipeId) {
            console.warn("problem, recipe is null!!");
            this.utilService.message('Tap Save before add ingredients')
        } else {

            this.navCtrl.push(IngredientListComponent, {recipeId : recipeId});
        }

    }

    public editIngredient(ingredient) {

        console.log("Ingredient ", ingredient)

        this.navCtrl.push(IngredientComponent, {ingredient : ingredient, recipeId: this.recipe._id});
    }

    public saveRecipe(){

        let loader = this.getLoading();

        this.recipeService.saveRecipe(this.recipe)
            .subscribe(response =>
            {
                console.log("Save or update!!", response);

                this.recipe._id = response._id;

                this.utilService.message('Recipe saved successfully!');

                this.dismissLoader(loader, null);

            },
            err => {
                console.error("Got here in the compononet", err)
                this.dismissLoader(loader, null);
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
}
