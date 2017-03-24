/**
 * Created by eliasmj on 11/08/2016.
 */
import {IngredientService} from "../services/ingredient.service";
import {Component} from "@angular/core";
import {NavController, NavParams, ModalController, LoadingController} from "ionic-angular";
import {IngredientComponent} from "./Ingredient.component";
import {Category} from "../model/category.model";
import {Ingredient} from "../model/ingredient.model";
import {ModalConfirmation} from "../modal/modal.confirmation";
import {Recipe} from "../../recipe/model/recipe.model";
import {RecipeComponent} from "../../recipe/components/recipe.component";
import {RecipeService} from "../../recipe/services/recipe.service";
import {UtilService} from "../../services/util.service";

@Component({
    selector: 'ingredient',
    templateUrl: 'ingredient-list-component.html'
})

export class IngredientListComponent
{
    categories : Category[];
    tempCategories: Category[];
    listLoaded: boolean = false;
    recipe: Recipe;

    constructor(
        private ingredientService: IngredientService,
        public recipeService: RecipeService,
        private navCtrl : NavController,
        private navParams : NavParams,
        public modalCtrl: ModalController,
        private loadingCtrl: LoadingController,
        private utilService: UtilService
    )
    {
        this.recipe = navParams.get('recipe');

        console.log(">>>>", this.recipe)
    }

    ionViewDidEnter(){

        this.refreshList(null);
    }

    public addIngredient() {
        this.navCtrl.push(IngredientComponent, {recipe: this.recipe});
    }

    public saveCheckedIng(ingredient) {

        //check box bug
        setTimeout(() => {

                this.recipeService.linkRecipeToCategory(this.recipe._id, ingredient)
                    .subscribe(res => {

                        console.log("Link is done!", res)

                    }, err => console.error(err));

        }, 500);
    }

    public backToRecipe() {
        if(this.recipe) {
            this.navCtrl.push(RecipeComponent, {recipe: this.recipe});
        }
    }

    public editIngredient(ingredient: Ingredient) {
        this.navCtrl.push(IngredientComponent, {ingredient : ingredient, recipe: this.recipe});
    }

    public editCategory(category) {
        this.navCtrl.push(IngredientComponent, {category : category, recipe: this.recipe});
    }

    public deleteCat(cat) {

        let modal = this.modalCtrl.create(ModalConfirmation,
            {'contentMessage' :  'Are you sure to delete ' + cat.name + 's category  and all its item ?'});

        modal.onDidDismiss(result => {

            if(result === 'yes') {
             //TODO
            }
        });

        modal.present();
    }

    public getItems(ev: any) {

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

    public refreshList(refresher) {

        let loader = this.getLoading();

        this.ingredientService.getCategoriesIngredient(this.recipe._id)
            .subscribe(cats => {
                console.log("Loaded", cats)
                this.categories = cats;

                this.tempCategories = this.categories;
                this.dismissLoader(loader, refresher);

            }, err => {
                this.dismissLoader(loader, refresher);
                this.handleError("get categories load page",err)
            });

        // this.zone.run(() => {
        //
        // });
    }

    private handleError(message, reason) {
        console.error(message, reason);
        this.utilService.messageError(message);
    }

    private initCategoryList() {
        this.categories = this.tempCategories;
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
