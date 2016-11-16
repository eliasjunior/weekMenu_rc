/**
 * Created by eliasmj on 11/08/2016.
 */

import {IngredientService} from "./ingredient.service";
import {Component, NgZone} from "@angular/core";
import {NavParams, LoadingController, AlertController, Platform} from "ionic-angular";
import {Category} from "./category.model";
import {Ingredient} from "./ingredient.model";

@Component({
    selector: 'ingredient',
    templateUrl: 'ingredient-shopping-list-component.html'
})

export class IngredientShoppingListComponent
{
    categories : Category [] = [];
    completedList: Category [] = [];
    incompletedList: Category [] = [];
    recipeId: string;
    listLoaded: boolean = false;
    totalLeft: number = 0;

    constructor(private ingredientService: IngredientService,
                private navParams : NavParams,
                private platform: Platform,
                private loadingCtrl: LoadingController,
                private alertCtrl: AlertController,
                private zone : NgZone)
    {
        this.recipeId = navParams.get('recipeId');
    }

    ionViewDidEnter() {

        this.platform.ready().then(() => {

            this.refreshList();

        });
    }

    onCheck(ingredient : Ingredient, category: Category, type: string) {

        ingredient.checked = !ingredient.checked;
        ingredient.updateCheck = new Date();

        if(type === 'incomplete') {

            if(this.catCompleted(category)) {
                this.completedList.push(category);

                let index = this.incompletedList.findIndex(cat => cat._id === category._id);
                this.incompletedList.splice(index, 1);
            }
            //performance, for not hold the render
            setTimeout(()=> {
                this.setTotalLeft();
            }, 0);

        } else {

            let index = this.completedList.findIndex(cat => cat._id === category._id);
            this.completedList.splice(index, 1);

            this.incompletedList.push(category);
        }

        this.sortList();

        this.ingredientService.update(ingredient);
    }

    resetIngredient() {

        let confirm = this.alertCtrl.create({
            title: 'Are you sure to reset the list ?',
            message: 'if yes it will reset the check buttons',
            buttons: [
                {
                    text: 'No',
                    handler: () => {
                        console.log('Dismiss');
                    }
                },
                {
                    text: 'Yes',
                    handler: () => {

                        this.categories.forEach(cat => {

                            cat.ingredients.forEach(ing => {
                                ing.checked = false;
                            });

                            this.ingredientService.updateMany(cat.ingredients);

                            this.fillCompleted();

                        });
                    }
                }
            ]
        });
        confirm.present();
    }

    getLeft(category : Category): number {
        let catLeft = category.ingredients.filter(ing => ing.checked === false).length;

        //this.totalLeft += catLeft;

        return catLeft;
    }

    catCompleted(category: Category) : boolean {
        return category.ingredients.filter(ing => ing.checked === false).length === 0;
    }

    private displayList(loader) {
        loader.dismiss();
        this.listLoaded = true;
    }

    private setTotalLeft() {
        this.totalLeft = 0;
        this.incompletedList.forEach(cat => {
            let catLeft = cat.ingredients.filter(ing => ing.checked === false).length;
            this.totalLeft += catLeft;
        });
    }

    public getTotalLeft() {
        return this.totalLeft;
    }

    private fillCompleted() {

        this.completedList = [];
        this.incompletedList = [];

        this.categories.forEach(category => {

            if(this.catCompleted(category)) {
                this.completedList.push(category);
            } else {
                this.incompletedList.push(category);
            }
        });

        this.setTotalLeft();

        this.sortList();
    }

    private sortList() {
        //sort by name
        this.incompletedList.sort(function(a, b){
            // console.log(a,'<', b)
            if(a.name < b.name) {
                return -1
            }

            if(a.name > b.name) {
                return 1
            }
            return 0;
        });

        //sort ingredient
        this.incompletedList.forEach(category => {
            category.ingredients.sort( (a,b) => {
                // console.log(a,'<', b)
                if(a.name.toUpperCase() < b.name.toUpperCase()) {
                    return -1
                }

                if(a.name.toUpperCase() > b.name.toUpperCase()) {
                    return 1
                }
                return 0;
            })
        });

        this.completedList.sort(function(a, b){
            // console.log(a,'<', b)
            if(a.name < b.name) {
                return -1
            }

            if(a.name > b.name) {
                return 1
            }
            return 0;
        });

        //sort ingredient
        this.completedList.forEach(category => {
            category.ingredients.sort( (a,b) => {
                // console.log(a,'<', b)
                if(a.name.toUpperCase() < b.name.toUpperCase()) {
                    return -1
                }

                if(a.name.toUpperCase() > b.name.toUpperCase()) {
                    return 1
                }
                return 0;
            })
        })
    }

    private refreshList() {

        this.categories = [];

        let loader = this.loadingCtrl.create({
            content: "Please wait..."
        });

        loader.present();

        this.ingredientService.getViewRecipeWeekIngredient(null)
            .then(categories => {

                //It needs zone when came from menu footer button
                this.zone.run(() => {

                    this.categories = categories;

                    this.fillCompleted();

                    this.displayList(loader);
                });
            })
            .catch(reason => {
                this.displayList(loader);
                console.error("problem get view", reason);
            });
    }
}
