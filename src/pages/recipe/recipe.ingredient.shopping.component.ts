import {Component} from "@angular/core";
import {NavParams, LoadingController} from "ionic-angular";
import {Recipe} from "./recipe.model";
import {RecipeService} from "./recipe.service";
import {Category} from "../ingredient/category.model";
import {IngredientService} from "../ingredient/services/ingredient.service";
import {Ingredient} from "../ingredient/ingredient.model";
import {UtilService} from "../services/util.service";

@Component({
    templateUrl: 'recipe-ingredient-shopping-component.html'
})
export class RecipeIngredientShoppingComponent {

    public categories : Category[];
    public recipe: Recipe;
    public isSelectedAll;

    constructor(
        public recipeService: RecipeService,
        private loadingCtrl: LoadingController,
        public ingredientService: IngredientService,
        private params: NavParams,
        private utilService: UtilService
    )
    {
        //clean the array
        this.categories = [];
        this.recipe = this.params.get('recipe');

    }

    ionViewDidLoad() {
        this.refreshListIngredients();
    }

    private refreshListIngredients() {

        let loader = this.loadingCtrl.create({
            content: "Please wait..."
        });
        loader.present();

        this.recipeService.getRecipeAttributes(this.recipe._id)
            .subscribe(response => {

                console.log("response ", response)
                this.categories = response.categories;
                console.log("Cate deep", this.categories)

            }, reason => {
                this.utilService.messageError(reason);
            }, () => this.displayList(loader));
    }

    private displayList(loader) {
        loader.dismiss();
    }

    updateShopping(ingredient: Ingredient) {

        //TODO need to update the item inside the array and in the 'table/collection'
        if(ingredient.attributes && ingredient.attributes[0].itemSelectedForShopping) {
            //TODO I dont know why is this
            //ingredient.isInMenuWeek = false;
        }

        this.ingredientService.saveAttributeIngredient(ingredient.attributes[0])
            .subscribe(() => {
                console.log("update successfully")
            }, err =>  this.utilService.messageError(err));
    }

    selectAll() {

        let attributeList = [];
        this.categories.forEach(cat => {
            cat.ingredients.forEach(ing => {
                ing.attributes[0].itemSelectedForShopping = this.isSelectedAll;
                attributeList.push(ing.attributes[0]);

                //TODO need to check this
                if(ing.attributes[0].itemSelectedForShopping ) {
                    ing.checkedInCartShopping = false;
                }

            });

        });

        this.ingredientService.saveManyAttribute(attributeList)
            .subscribe(() => {
                console.log("update successfully")
            }, err =>  this.utilService.messageError(err));
    }
}
