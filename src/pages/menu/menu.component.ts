import {Component, NgZone} from '@angular/core';
import {NavController, Platform} from 'ionic-angular';
import {RecipeComponent} from "../recipe/recipe.component";
import {RecipeListComponent} from "../recipe/recipe.list.component";
import {Recipe} from "../recipe/recipe.model";
import {RecipeService} from "../recipe/recipe.service";
import {MainMeal} from "../recipe/main.meal.model";
import {weekDays} from "../constants/week.day.constant";
import {RecipeIngredientShoppingComponent} from "../recipe/recipe.ingredient.shopping.component";

@Component({
    selector: 'menu-component',
    templateUrl: 'menu-component.html'
})
export class MenuComponent{

    public recipes : Recipe [];

   // public weekDays = weekDays;

    mainMeals : MainMeal [];

    constructor(private navCtrl: NavController,
                private recipeService: RecipeService,
                private platform: Platform,
                private zone: NgZone) {
        this.mainMeals = this.recipeService.getMainMealList();
    }

    ionViewDidEnter() {

        this.platform.ready().then(() => {

            this.refreshList();
        });
    }

    private refreshList() {

        this.recipes = [];

        this.recipeService.getList()
            .subscribe(
                recipesA => this.populateList(recipesA),
                err => {
                    this.recipeService.messageError(err);
                }
            );
    }

    selectItem(recipe: Recipe) {

        this.navCtrl.push(RecipeComponent, {recipe});
    }

    addItem() {

        this.recipeService.getList()
            .subscribe(recipes => {

                    if(recipes.length > 0) {

                        this.navCtrl.push(RecipeListComponent);
                    } else {
                        this.navCtrl.push(RecipeComponent);
                    }

                },
                err => console.error("error to get list recipes"))
    }

    private populateList(recipesA: Recipe []) {

        recipesA = recipesA.filter((recipe) => recipe.isInMenuWeek === true);

        this.zone.run(() => {

            this.recipes = recipesA;

            console.log("RECIPES", this.recipes)

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

    pickUpShoppingList(recipe: Recipe) {
        this.navCtrl.push(RecipeIngredientShoppingComponent, {recipe});
    }
}
