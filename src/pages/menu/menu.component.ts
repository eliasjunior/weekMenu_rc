import {Component, NgZone} from '@angular/core';
import {NavController, Platform} from 'ionic-angular';
import {RecipeComponent} from "../recipe/recipe.component";
import {RecipeListComponent} from "../recipe/recipe.list.component";
import {Recipe} from "../recipe/recipe.model";
import {RecipeService} from "../recipe/recipe.service";
import {MainMeal} from "../recipe/main.meal.model";
import {weekDays} from "../constants/week.day.constant";

@Component({
    selector: 'menu-component',
    templateUrl: 'menu-component.html'
})
export class MenuComponent{

    public recipes : Recipe [];

    public weekDays = weekDays;

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

        this.recipeService.getListMenu()
            .subscribe(
                recipesA => this.populateList(recipesA),
                err => this.handleError("Error to get list recipe", err),
                () => this.finalCall()
            );

        //TODO ***** TEST REMOVE THIS AFTER DONE
        this.recipeService.getViewRecipeIngredient('Random stuff')
            .then(response => {
                console.log("Response from view LENGTH", response.rows.length)

                //ANTOHER
                this.recipeService.find();

                //**TEST PLUGIN
               // this.recipeService.getIndexes();
            })
            .catch(reason => {
                console.error("problem get view", reason)
            })




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

    private populateList(recipesA: any) {

        this.zone.run(() => {

            this.recipes = recipesA as Recipe [];

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
                recipe.populateMainMeail(this.mainMeals);
            });

        });
    }

    private finalCall() {
        //console.log("Finally print query, " +this.recipes.length+" recipes" )
    }

    private handleError(message,err) {
        console.error(message, err);
    }
}
