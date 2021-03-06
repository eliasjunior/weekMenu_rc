/**
 * Created by eliasmj on 11/08/2016.
 */
import {IngredientService} from "../services/ingredient.service";
import {Component} from "@angular/core";
import {NavParams, LoadingController, AlertController, Platform} from "ionic-angular";
import {Category} from "../model/category.model";
import {Ingredient} from "../model/ingredient.model";
import {UtilService} from "../../services/util.service";

@Component({
    selector: 'ingredient',
    templateUrl: 'ingredient-shopping-list-component.html'
})

export class IngredientShoppingListComponent
{
    categories : Category [] = [];
    tempUnCompleted : Category [] = [];
    completedList: Category [] = [];
    uncompletedList: Category [] = [];
    recipeId: string;
    listLoaded: boolean = false;
    totalLeft: number = 0;

    constructor(public ingredientService: IngredientService,
                public navParams : NavParams,
                public platform: Platform,
                public loadingCtrl: LoadingController,
                public alertCtrl: AlertController,
                public util: UtilService)
    {
        this.recipeId = navParams.get('recipeId');
    }

    ionViewDidLoad() {

        this.refreshList();
    }

    public refreshList() {

        this.categories = [];

        let loader = this.getLoading();

        this.ingredientService.getCategoryAndIngredientShopping()
            .subscribe(cats => {
                console.log("Loaded", cats)
                this.categories = cats;

                this.fillCompleted();
                this.dismissLoader(loader);

            }, err => {
                this.dismissLoader(loader);
                this.util.messageError(err);
            });
    }

    onCheck(ingredient : Ingredient, category: Category, type: string) {

        ingredient.checkedInCartShopping = !ingredient.checkedInCartShopping;
        ingredient.updateCheckDate = new Date();

        if(type === 'incomplete') {

            if(this.catCompleted(category)) {
                this.completedList.push(category);

                let index = this.uncompletedList.findIndex(cat => cat._id === category._id);
                this.uncompletedList.splice(index, 1);
            }
            //performance, for not hold the render
            setTimeout(()=> {
                this.setTotalLeft();
            }, 0);

        } else {

            let index = this.completedList.findIndex(cat => cat._id === category._id);
            this.completedList.splice(index, 1);

            this.uncompletedList.push(category);
        }

        this.sortList();

        //TODO add UPDATE/SAVE HERE
        //this.ingredientService.saveIngredient()
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
                                ing.checkedInCartShopping = false;
                            });

                         //   this.ingredientService.updateMany(cat.ingredients);

                            this.fillCompleted();

                        });
                    }
                }
            ]
        });
        confirm.present();
    }

    getLeft(category : Category): number {
        let catLeft = category.ingredients.filter(ing => ing.checkedInCartShopping === false).length;

        //this.totalLeft += catLeft;
        return catLeft;
    }

    public catCompleted(category: Category) : boolean {
        return category.ingredients.filter(ing => ing.checkedInCartShopping === false).length === 0;
    }

    private setTotalLeft() {
        this.totalLeft = 0;
        this.uncompletedList.forEach(cat => {
            let catLeft = cat.ingredients.filter(ing => ing.checkedInCartShopping === false).length;
            this.totalLeft += catLeft;
        });
    }

    public getTotalLeft() {
        return this.totalLeft;
    }

    public getItems(ev: any) {

        this.initCategoryList();

        // set val to the value of the searchbar
        let val = ev.target.value;

        // if the value is an empty string don't filter the items
        if (val && val.trim() !== '') {
            let cats = [];

            this.uncompletedList.forEach(cat => {
                let filter = cat.ingredients.filter(ing => {
                    return (ing.name.toLowerCase().indexOf(val.toLowerCase()) > - 1);
                });

                if(filter.length > 0) {

                    cats.push(cat);

                    cat.ingredients = filter;
                }
            });

            this.uncompletedList = cats;
        }
    }

    private initCategoryList() {
        this.uncompletedList = this.tempUnCompleted;
    }

    private fillCompleted() {

        this.completedList = [];
        this.uncompletedList = [];

        this.categories.forEach(category => {

            if(this.catCompleted(category)) {
                this.completedList.push(category);
            } else {
                this.uncompletedList.push(category);
            }
        });

        this.setTotalLeft();

        this.sortList();

        this.tempUnCompleted = this.uncompletedList;
    }

    private sortList() {
        //sort by name
        this.uncompletedList.sort(function(a, b){
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
        this.uncompletedList.forEach(category => {
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

    public getUpdateCheck(ingredient){

        if(ingredient.updateCheckDate){
            let myDate: Date = new Date(ingredient.updateCheckDate.toString())

            let formatted = myDate.getDate()
                + "/" + (myDate.getMonth() + 1)
                +"/" + myDate.getFullYear()
                + " " + myDate.getHours()
                + ":" + myDate.getMinutes();

            return formatted;
        } else
            return "";
    }

    private getLoading() {
        let loader = this.loadingCtrl.create({
            content: "Please wait..."
        });

        loader.present();

        return loader;
    }

    private dismissLoader(loader) {
        loader.dismiss();
        console.log("dismiss loading!")
    }

}
