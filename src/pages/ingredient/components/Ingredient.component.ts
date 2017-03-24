/**
 * Created by eliasmj on 08/08/2016.
 */
import {Component} from "@angular/core";
import {Ingredient} from "../model/ingredient.model";
import {Category} from "../model/category.model";
import {IngredientService} from "../services/ingredient.service";
import {NavParams, ActionSheetController, LoadingController} from "ionic-angular";
import {QuantityType} from "../../constants/quantity.type.constant";
import {IngredientRecipeAttributes} from "../model/ingredient.recipe.model";
import {UtilService} from "../../services/util.service";
import {Recipe} from "../../recipe/model/recipe.model";

@Component({
    selector: 'page-ingredient-component',
    templateUrl : 'ingredient-component.html'
})
export class IngredientComponent {

    ingredient : Ingredient;

    currentCategory: Category;

    //study ngModel
    newCatName : string;

    showNewCat: Boolean = false ;

    categories : Category [];

    recipe: Recipe;

    attribute: IngredientRecipeAttributes;

    labelQdyList: string [] = [QuantityType.L, QuantityType.KG, QuantityType.UNIT];

    constructor(public  ingredientService : IngredientService,
                private navParams: NavParams,
                private actionSheetCtrl: ActionSheetController,
                private utilService: UtilService,
                private loadingCtrl: LoadingController,
    ) {

        this.recipe = navParams.get('recipe');
        this.ingredient = navParams.get("ingredient");
        this.currentCategory = navParams.get("category");

        if(!this.ingredient) {
            this.ingredient = new Ingredient();
        }

        if(!this.currentCategory) {
            this.currentCategory = new Category();
        } else {
            this.ingredient._creator = this.currentCategory._id;
        }

        this.attribute = new IngredientRecipeAttributes();
    }

    ionViewDidEnter() {

        this.refreshList();

    }

    // actionIngredient() {
    //
    //     let actionSheet = this.actionSheetCtrl.create({
    //         title: 'Ingredient actions',
    //         buttons: [
    //             {
    //                 text: 'Save',
    //                 role: 'save',
    //                 handler: () => {
    //                     this.saveIngredientCategory();
    //                     console.log('Destructive clicked');
    //                 }
    //             },
    //             {
    //                 text: 'Delete',
    //                 handler: () => {
    //                     this.deleteIngredient()
    //                 }
    //             },
    //             {
    //                 text: 'Cancel',
    //                 role: 'cancel',
    //                 handler: () => {
    //                     console.log('Cancel clicked');
    //                 }
    //             }
    //         ]
    //     });
    //     actionSheet.present();
    // }


    onChangeCat() {

        if (this.ingredient._creator === 'addNew')  {
            this.showNewCat = true;
            this.currentCategory = new Category();

        } else {

            this.currentCategory = this.categories.filter(cat => {
                return cat._id === this.ingredient._creator
            })[0];

        }
    }

    public deleteIngredient() {
        this.utilService.message("Feature not ready!");
    }

    //Ingredient 1 x N cat
    public saveIngredientCategory(){

        let loader = this.getLoading();

        if(this.recipe) {
            this.currentCategory.recipeId = this.recipe._id;
        }

        if(this.ingredient._creator === 'addNew') {
            this.currentCategory.name = this.newCatName;

            this.ingredientService.saveCategory(this.currentCategory)
                .subscribe((doc) => {
                    this.saveIngredientAndAttributes(doc);
                    this.dismissLoader(loader);
                }, err => {
                    this.utilService.messageError(err);
                    this.dismissLoader(loader);
                });

        } else {
            //TODO fix api missing update ingredient to push array
            this.ingredientService.saveCategory(this.currentCategory)
                .subscribe(() => {
                    this.saveIngredientAndAttributes(this.currentCategory);
                    this.dismissLoader(loader);

                }, err => {
                    this.utilService.messageError(err);
                    this.dismissLoader(loader);
                });
        }
    }

    public getMin() {
        return 0;
    }

    public getMax() {

        if(this.attribute.labelQuantity === QuantityType.KG) {
            return 2000;
        } else {
            return 10;
        }
    }

    public getStep() {

        if(this.attribute.labelQuantity === QuantityType.KG) {
            return 100;
        } else {
            return 1;
        }
    }

    public createNewItem() {
        this.currentCategory = new Category();
        this.ingredient = new Ingredient();
        this.attribute = new IngredientRecipeAttributes();

        this.refreshList();
    }

    private saveIngredientAndAttributes(doc) {

        console.log("Category Saved!", doc)
        console.log("Ingredient instance", this.ingredient)

        this.ingredient._creator = doc._id;
        this.attribute.recipeId = this.recipe._id;
        this.attribute.ingredientId = this.ingredient._id;

        console.log("attribute instance", this.attribute)

        this.ingredientService.saveIngredient(this.ingredient, this.attribute)
            .subscribe(result => {

                console.log("Ingredient saved", result)

            }, err => {
                this.utilService.messageError(err)
            } )
    }

    private handleError(message, reason) {
        console.error(message, reason);
        this.utilService.messageError(message);
    }

    private createQuantity(){
        this.attribute = new IngredientRecipeAttributes();
        this.attribute.labelQuantity = QuantityType.KG,
        this.attribute.recipeId = this.recipe._id;
        this.attribute.quantity = this.getMin();
    }

    private successGetCats(loader, cats) {

        this.categories = cats;

        let tempCat = this.categories.find(cat => cat._id === this.ingredient._creator);
        if(tempCat) {
            this.currentCategory = tempCat;
        } else {
            console.log("category not found");
        }

        if (this.ingredient._id) {

            this.ingredientService.getIngredientRecipeAttributes(this.ingredient._id, this.recipe._id)
                .subscribe(attributes => {

                    this.attribute = attributes;

                }, err => {
                    this.utilService.messageError(err)
                });

        } else {
            this.createQuantity();
        }

        this.dismissLoader(loader);
    }

    private refreshList() {
        this.categories = [];

        let loader = this.getLoading();

        //for the select list.
        this.ingredientService.getCategories()
            .subscribe(
                this.successGetCats.bind(this, loader),
                err => {
                    this.handleError("get categories load page",err);
                    this.dismissLoader(loader);
                }
            );
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
