/**
 * Created by eliasmj on 11/08/2016.
 */

import {IngredientService} from "./ingredient.service";
import {Component, NgZone} from "@angular/core";
import {NavController, NavParams, ModalController, LoadingController} from "ionic-angular";
import {IngredientComponent} from "./Ingredient.component";
import {Category} from "./category.model";
import {Ingredient} from "./ingredient.model";
import {ModalConfirmation} from "./modal/modal.confirmation";
import {Recipe} from "../recipe/recipe.model";
import {RecipeComponent} from "../recipe/recipe.component";

@Component({
    selector: 'ingredient',
    templateUrl: 'ingredient-list-component.html'
})

export class IngredientListComponent
{
    categories : Category[];
    categoriaTemp: Category[];
    recipeId: string;
    listLoaded: boolean = false;
    recipe: Recipe;

    constructor(
        private ingredientService: IngredientService,
        private navCtrl : NavController,
        private navParams : NavParams,
        public modalCtrl: ModalController,
        private loadingCtrl: LoadingController,
        private zone : NgZone
    )
    {
        this.recipeId = navParams.get('recipeId');
    }

    ionViewDidEnter(){

        this.refreshList();
    }

    private refreshList() {

        let loader = this.loadingCtrl.create({
            content: "Please wait..."
        });

        loader.present();

        this.zone.run(() => {
            this.getCategories(loader);
            this.getRecipe();
        });
    }

    //set the checkbox based on the recipe's ingredient.
    private setChecks(loader) {

        //FIXME very slow
        this.categories.forEach(cat => {
            cat.ingredients.forEach(ingredient => {

                if (this.recipeId) {

                    //console.log("recipe_ids", ingredient.recipe_ids)
                    if(ingredient.recipe_ids && ingredient.recipe_ids.find(id => id === this.recipeId)) {
                        ingredient.checkedInCartShopping = true;
                    } else {
                        ingredient.checkedInCartShopping = false;
                    }

                } else {
                    ingredient.checkedInCartShopping = false;
                }
               // console.log(">>>>>", ingredient._id)
            });
        });

        this.hideLoading(loader);

    }

    private hideLoading(loader) {
        this.listLoaded = true;
        loader.dismiss();
    }

    addIngredient() {
        this.navCtrl.push(IngredientComponent, {recipeId: this.recipeId});
    }

    saveCheckedIng(ingredient : Ingredient) {

        //bug ionic or angular, isInMenuWeek ngmodel takes a few time to update
        setTimeout(() => {
            // this.ingredientService.linkRecipeToIng(this.recipeId, ingredient)
            //     .then(response => {
            //         console.log("Recipes Ing saved!", response)
            //     })
            //     .catch(reason => this.handleError("error to add recipe_ing", reason));
        }, 0);

    }

    backToRecipe() {
        if(this.recipeId) {
            this.navCtrl.push(RecipeComponent, {recipe: this.recipe});
        }
    }

    editIngredient(ingredientId) {
        console.log("go to ingredient component", ingredientId)
        this.navCtrl.push(IngredientComponent, {ingredientId : ingredientId});
    }

    deleteCat(cat) {

        let modal = this.modalCtrl.create(ModalConfirmation,
            {'contentMessage' :  'Are you sure to delete ' + cat.name + 's category  and all its item ?'});

        modal.onDidDismiss(result => {

            if(result === 'yes') {
                //*** I need to get before delete category
                // this.ingredientService.getCategoriesIngredient(cat._id)
                //     .then(response => this.successGetCatIngredient(response, cat))
                //     .catch(reason => this.handleError("getCategoriesIngredient",reason));
            }
        });

        modal.present();
    }

    getItems(ev: any) {

        // set val to the value of the searchbar
        let val = ev.target.value;

        this.initCat();

        // if the value is an empty string don't filter the items
        if (val && val.trim() != '') {
            let cats = [];

            this.categories.forEach(cat => {
                let filter = cat.ingredients.filter(ing => {
                    return (ing.name.toLowerCase().indexOf(val.toLowerCase()) > - 1);
                });

                if(filter.length > 0) {
                   // console.log("concat filter", filter)

                    cats.push(cat)

                    cat.ingredients = filter;
                }

            });

            this.categories = cats;
        }

    }

    private initCat(){
        this.categories = this.categoriaTemp;
    }

    private successDeletePartialCat(response, ingredients) {
        console.log("Cat Deleted!", response);

        //delete all ingredient from this category
        // this.ingredientService._deleteMany(ingredients)
        //     .then(response => this.successsDeletedCat("Category and ingredients deleted!"))
        //     .catch(reason => this.handleError("Problem to delete ingredients", reason));
    }

    private handleError(message, reason) {
        console.error(message, reason);
        this.ingredientService.messageError(message);
    }


    private successsDeletedCat(message) {
        this.ingredientService.message(message);
        this.refreshList()
    }

    private successGetCatIngredient(response: any, cat: Category) {

        let ingredients : Ingredient [] = response[0].ingredients;

        console.log("ING PER CAT", ingredients);

        // this.ingredientService._delete(cat)
        //     .then(response => this.successDeletePartialCat(response, ingredients))
        //     .catch(reason => this.handleError("successDeletePartialCat",reason));
    }


    private getCategories(loader : any) {

        this.ingredientService.getCategoriesIngredient(null)
            .subscribe(cats => {
                this.categories = cats;
            }, err => console.error(err)
             , () =>   loader.dismiss());

        // this.ingredientService.getCategoriesIngredient(null)
        //     .then(response =>
        //     {
        //         console.log("categories response", response)
        //
        //         this.categories = response;
        //
        //         //search
        //         this.categoriaTemp = this.categories;
        //
        //         this.setChecks(loader);
        //     })
        //     .catch(reason => {
        //         console.error("Error getCategoriesIngredient", reason);
        //         loader.dismiss();
        //     });
    }

    private getRecipe() {

        if(this.recipeId) {
            // this.ingredientService.get(this.recipeId)
            //     .then(recipe => {
            //         this.recipe = new Recipe();
            //         this.recipe.parseRecipe(recipe);
            //     })
            //     .catch(reason => this.handleError("error get", reason));
        }
    }
}
