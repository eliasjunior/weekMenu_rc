import {Component, NgZone} from "@angular/core";
import {NavController, LoadingController, Loading} from "ionic-angular";
import {RecipeComponent} from "../recipe/components/recipe.component";
import {RecipeListComponent} from "../recipe/components/recipe.list.component";
import {Recipe} from "../recipe/model/recipe.model";
import {RecipeService} from "../recipe/services/recipe.service";
import {MainMeal} from "../recipe/model/main.meal.model";
import {RecipeIngredientShoppingComponent} from "../recipe/components/recipe.ingredient.shopping.component";
import {UtilService} from "../services/util.service";

@Component({
    selector: 'menu-component',
    templateUrl: 'menu-component.html'
})
export class MenuComponent{

    public recipes : Recipe [];
    public mainMeals : MainMeal [];
    private loading : Loading;

    constructor(private navCtrl: NavController,
                private recipeService: RecipeService,
                private zone: NgZone,
                private utilService: UtilService,
                private loadingCtrl: LoadingController) {
        this.mainMeals = this.recipeService.getMainMealList();
    }

    ionViewDidLoad() {
        this.getLoading();
        this.refreshList(null);
    }

    public refreshList(refresher) {

        this.recipes = [];

        this.recipeService.getList()
            .subscribe(
                recipeList =>{
                    this.populateList(recipeList);
                    this.dismissLoader(refresher);
                },
                err => {
                    this.utilService.messageError(err);
                    this.dismissLoader(refresher);
                }
            );
    }

    public selectItem(recipe: Recipe) {

        this.navCtrl.push(RecipeComponent, {recipe});
    }

    public addItem() {

        this.recipeService.getList()
            .subscribe(
                recipes => {

                    if(recipes.length > 0) {

                        this.navCtrl.push(RecipeListComponent);
                    } else {
                        this.navCtrl.push(RecipeComponent);
                    }

                },
                err => console.error("error to get list recipes")
            );
    }

    public removeFromMenu(recipe: Recipe) {

        recipe.isInMenuWeek = false;
        recipe.weekDay = null;

        this.recipeService.saveRecipe(recipe)
            .subscribe(
                () => {
                    this.utilService.message("Removed From Menu List");
                    this.refreshList(null);
                },
                reason => {
                    this.utilService.messageError(reason);
                }
            );
    }

    public pickUpShoppingList(recipe: Recipe) {
        this.navCtrl.push(RecipeIngredientShoppingComponent, {recipe});
    }

    private populateList(recipesA: Recipe []) {

        recipesA = recipesA.filter((recipe) => recipe.isInMenuWeek === true);

        this.zone.run(() => {

            this.recipes = recipesA;

            //console.log("RECIPES", this.recipes)

            //sort by week day
            this.recipes.sort(function(a, b){

                // console.log(a,'<', b)
                if(a.getDayValue() < b.getDayValue()) {
                    return -1
                }

                if(a.getDayValue() > b.getDayValue()) {
                    return 1
                }
                return 0;
            });

            //get the mainMeal details, because in recipe has only the key

            this.recipes.forEach(recipe => {
                if(recipe.mainMealValue) {
                    recipe.populateMainMeal(this.mainMeals);
                }
            });

        });
    }

    private getLoading() {
        this.loading = this.utilService.triggerLoading(this.loadingCtrl);
    }

    private dismissLoader(refresher) {
        this.utilService.dismissLoader(this.loading, refresher);
    }
}
