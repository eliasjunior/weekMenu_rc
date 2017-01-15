/**
 * Created by eliasmj on 11/08/2016.
 */

import {IngredientService} from "../services/ingredient.service";
import {Component, NgZone} from "@angular/core";
import {NavController, NavParams, ModalController, LoadingController} from "ionic-angular";
import {IngredientComponent} from "./Ingredient.component";
import {Category} from "../category.model";
import {Ingredient} from "../ingredient.model";
import {ModalConfirmation} from "../modal/modal.confirmation";
import {Recipe} from "../../recipe/recipe.model";
import {RecipeComponent} from "../../recipe/recipe.component";
import {RecipeService} from "../../recipe/recipe.service";

@Component({
    selector: 'ingredient',
    templateUrl: 'ingredient-list-component.html'
})

export class IngredientListComponent
{
    categories : Category[];
    tempCategories: Category[];
    recipeId: string;
    listLoaded: boolean = false;
    recipe: Recipe;

    constructor(
        private ingredientService: IngredientService,
        public recipeService: RecipeService,
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
        });
    }

    private hideLoading(loader) {
        this.listLoaded = true;
        loader.dismiss();
    }

    addIngredient() {
        this.navCtrl.push(IngredientComponent, {recipeId: this.recipeId});
    }

    saveCheckedIng(category) {

        //check box bug
        setTimeout(() => {

            let checkedIngredient =
                category.ingredients.filter(ingredient => ingredient.tempRecipeLinkIndicator === true);

            console.log("CHecked Ingredients", checkedIngredient)

            if(checkedIngredient.length > 0) {

                let tempCategory = Object.assign({}, category);
                tempCategory.ingredients = checkedIngredient;

                this.recipeService.linkRecipeToCategory(this.recipeId, tempCategory)
                    .subscribe(res => {

                        console.log("Link is done!", res)

                    }, err => console.error(err));
            }

        }, 500);
    }

    backToRecipe() {
        if(this.recipeId) {
            this.navCtrl.push(RecipeComponent, {recipe: this.recipe});
        }
    }

    editIngredient(ingredient: Ingredient) {
        this.navCtrl.push(IngredientComponent, {ingredient : ingredient, recipeId: this.recipeId});
    }

    editCategory(category) {
        this.navCtrl.push(IngredientComponent, {category : category, recipeId: this.recipeId});
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

        this.initCategoryList();

        // set val to the value of the searchbar
        let val = ev.target.value;

        // if the value is an empty string don't filter the items
        if (val && val.trim() !== '') {
            let cats = [];

            this.categories.forEach(cat => {
                let filter = cat.ingredients.filter(ing => {
                    return (ing.name.toLowerCase().indexOf(val.toLowerCase()) > - 1);
                });

                if(filter.length > 0) {

                    cats.push(cat);

                    cat.ingredients = filter;
                }

            });

            this.categories = cats;
        }
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
        this.refreshList();
    }

    private successGetCatIngredient(response: any, cat: Category) {

        let ingredients : Ingredient [] = response[0].ingredients;

        console.log("ING PER CAT", ingredients);

        // this.ingredientService._delete(cat)
        //     .then(response => this.successDeletePartialCat(response, ingredients))
        //     .catch(reason => this.handleError("successDeletePartialCat",reason));
    }


    private getCategories(loader : any) {

        this.ingredientService.getCategoriesIngredient(this.recipeId)
            .subscribe(cats => {
                    console.log("Loaded", cats)
                this.categories = cats;

                this.tempCategories = this.categories;

            }, err => console.error(err)
             , () =>   this.hideLoading(loader));
    }

    private initCategoryList() {
        this.categories = this.tempCategories;
    }
}
