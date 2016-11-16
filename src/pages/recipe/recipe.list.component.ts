/**
 * Created by eliasmj on 08/08/2016.
 */
import {RecipeService} from "./recipe.service";
import {Component} from "@angular/core";
import {NavController, LoadingController, ModalController} from "ionic-angular";
import {RecipeComponent} from "./recipe.component";
import {MenuHistory, Recipe} from "./recipe.model";
import {weekDays} from "../constants/week.day.constant";
import {IngredientComponent} from "../ingredient/Ingredient.component";
import {RecipeIngredientShoppingComponent} from "./recipe.ingredient.shopping.component";
import {ModalSelectDays} from "./modal/modal.select.days";


@Component({
  templateUrl: 'recipe-list-component.html'
})
export class RecipeListComponent {

    public recipes : Recipe [];
    public recipesTemp : Recipe [];
    listLoaded: boolean = false;
    public weekDays = weekDays;

    constructor(private recipeService: RecipeService,
                public navCtrl: NavController,
                private loadingCtrl: LoadingController,
                public modalCtrl: ModalController
    ) {
    }

    ionViewDidEnter() {
        this.refreshList();
    }

    private refreshList() {

        let loader = this.loadingCtrl.create({
            content: "Please wait..."
        });

        loader.present();

        this.recipes = [];

        this.recipeService.getList()
            .subscribe(recipes => {

                recipes.forEach(recipeResp => {

                    let recipe = new Recipe();
                    recipe.parseRecipe(recipeResp);

                    this.recipes.push(recipe);
                });

                //console.log("Recipe List", this.recipes)
                },
                err => console.error("get recipe list", err),
                () =>
                {
                    loader.dismiss();
                    this.listLoaded = true;
                    this.recipesTemp = this.recipes;
                });
    }

    addRecipe() {
        this.navCtrl.push(RecipeComponent);
    }

    editIngredient(ingredientId) {
        this.navCtrl.push(IngredientComponent, {ingredientId : ingredientId});
    }

    public updateRecipe(recipe, action) {
        //action going change
        //need to put timeout to get the updated value.
        setTimeout(()=> {

            recipe.checked = !recipe.checked;

            if(!recipe.checked) {
                recipe.weekDay = null;

            } else {

                let menuHistory = new MenuHistory();
                menuHistory.dateCreated = new Date().toDateString();
                recipe.menus.push(menuHistory);
            }

            this.recipeService.update(recipe)
                .then(response => console.log("Recipe Updated", response))
                .catch(reason => console.error(reason));

        }, 0);

    }

    public openModalDays(recipe: Recipe) {

        let modal = this.modalCtrl.create(ModalSelectDays);

        modal.onDidDismiss(result => {

            if(result) {

                recipe.weekDay = result;

                //*** I need to get before delete category
                this.recipeService.update(recipe)
                    .then(response => console.log("Recipe Updated", response))
                    .catch(reason => console.error(reason));

            }
        });

        modal.present();
    }

    public pickShopping(recipe: Recipe) {
        this.pickUpIngredientToShop(recipe);
    }

    getItems(ev: any) {

        // set val to the value of the searchbar
        let val = ev.target.value;

        this.initRecipe();

        // if the value is an empty string don't filter the items
        if (val && val.trim() != '') {

            this.recipes = this.recipes.filter(rec => {
                return rec.name.toLowerCase().indexOf(val.toLowerCase()) > -1
            });
        }
    }

    private initRecipe() {
        this.recipes = this.recipesTemp;
    }

    private pickUpIngredientToShop(recipe: Recipe) {

        this.navCtrl.push(RecipeIngredientShoppingComponent, {recipe : recipe});

    }
}
