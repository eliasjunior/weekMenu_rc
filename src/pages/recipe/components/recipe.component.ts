/**
 * Created by eliasmj on 05/08/2016.
 */
import {Component, Input} from "@angular/core";
import {NavController, NavParams, LoadingController, Refresher, Loading} from "ionic-angular";
import {IngredientComponent} from "../../ingredient/components/Ingredient.component";
import {RecipeService} from "../services/recipe.service";
import {Recipe} from "../model/recipe.model";
import {IngredientListComponent} from "../../ingredient/components/Ingredient.list.component";
import {UtilService} from "../../services/util.service";

@Component({
    selector: 'recipe-component',
    templateUrl : 'recipe-component.html'
})

export class RecipeComponent {

    private recipe: Recipe;
    private mainMeals = [];
    private loading: Loading;

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

    ionViewDidLoad() {

        //when uses the back button the param is null
        if(this.recipe && this.recipe._id) {
            this.getLoading();
            this.refreshList(null);
        }
    }

    public refreshList(refresher: Refresher) {

        this.recipeService.getRecipeCategories(this.recipe._id)
            .subscribe(
                recipe => {
                    this.dismissLoader(refresher);
                    this.recipe = recipe;
                },
                err => {
                    this.dismissLoader(refresher);
                    this.utilService.messageError(err);
                });
    }


    public addIngredient(recipeId : string){

        if(!recipeId) {
            console.warn("problem, recipe is null!!");
            this.utilService.message('Tap Save before add ingredients')
        } else {

            this.navCtrl.push(IngredientListComponent, {recipe: this.recipe});
        }

    }

    public editIngredient(ingredient) {

        console.log("Ingredient ", ingredient)

        this.navCtrl.push(IngredientComponent, {ingredient : ingredient, recipe: this.recipe});
    }

    public saveRecipe(){

        this.recipeService.saveRecipe(this.recipe)
            .subscribe(response =>
            {
                console.log("Save or update!!", response);

                this.recipe._id = response._id;

                this.utilService.message('Recipe saved successfully!');

                this.dismissLoader(null);

            },
            err => {
                console.error("Got here in the compononet", err)
                this.dismissLoader(null);
            });
    }

    private getLoading() {
        this.loading = this.utilService.triggerLoading(this.loadingCtrl);
    }

    private dismissLoader(refresher) {
        this.utilService.dismissLoader(this.loading, refresher);
    }
}
