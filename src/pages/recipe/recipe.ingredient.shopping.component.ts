import {Component} from "@angular/core";
import {NavParams, LoadingController} from "ionic-angular";
import {Recipe} from "./recipe.model";
import {RecipeService} from "./recipe.service";
import {Category} from "../ingredient/category.model";
import {IngredientService} from "../ingredient/ingredient.service";

@Component({
    templateUrl: 'recipe-ingredient-shopping-component.html'
})
export class RecipeIngredientShoppingComponent {

    public categories : Category[];
    public recipe: Recipe;
    public shopping;

    constructor(
        public recipeService: RecipeService,
        private loadingCtrl: LoadingController,
        public ingredientService: IngredientService,
        private params: NavParams
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

        this.recipeService.getViewRecipeIngredient(this.recipe._id)
            .then(response =>
            {
                console.log("getViewRecipeIngredient VIEW", response);
                this.displayList(loader);
                response.rows.forEach(row => {
                    //ideally the query not return row.doc unefined
                    if(row.doc) {
                        this.ingredientService
                            .addRowToCategories(this.ingredientService.parseCategory(row),
                                this.ingredientService.parseIngredient(row),
                                this.categories);
                    } else {
                        console.warn("Row.doc undefined", row)
                    }

                });
            })
            .catch(reason => {
                this.displayList(loader);
                console.error("Error view", reason)
            });
    }

    private displayList(loader) {
        loader.dismiss();
    }

    updateShopping(ingredient) {

        if(ingredient.shopping) {
            ingredient.checked = false;
        }

        this.ingredientService.update(ingredient)
            .then(response => console.log("Recipe Updated", response))
            .catch(reason => console.error(reason));
    }

    selectAll() {

        this.categories.forEach(cat => {
            cat.ingredients.forEach(ing => {
                ing.shopping = this.shopping;

                if(ing.shopping) {
                    ing.checked = false;
                }

            });

           this.ingredientService.updateMany(cat.ingredients);
        })
    }
}
