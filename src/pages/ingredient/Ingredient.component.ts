/**
 * Created by eliasmj on 08/08/2016.
 */
import {Component} from "@angular/core";
import {Ingredient, Quantity} from "./ingredient.model";
import {Category} from "./category.model";
import {IngredientService} from "./ingredient.service";
import {NavController, NavParams, ActionSheetController} from "ionic-angular";
import {QuantityType} from "../constants/quantity.type.constant";


@Component({
    selector: 'page-ingredient-component',
    templateUrl : 'ingredient-component.html'
})
export class IngredientComponent
{

    ingredient : Ingredient;

    currentCategory: Category;

    //study ngModel
    newCatName : string;

    showNewCat: Boolean = false ;

    listCategory : Category [];

    recipeId: string;

    quantity: Quantity = new Quantity();

    typeQtdList: string [] = [QuantityType.L, QuantityType.KG, QuantityType.UNIT];

    constructor(private  ingredientService : IngredientService,
                private navCtrl : NavController,
                private navParams: NavParams,
                private actionSheetCtrl: ActionSheetController
    ) {
        this.ingredient = new Ingredient();
        this.currentCategory = new Category();

        this.recipeId = navParams.get('recipeId');

    }

    ionViewLoaded() {

        let ingredientId = this.navParams.get('ingredientId');

        if (ingredientId) {
            this.ingredientService.get(ingredientId)
                .then(ingredientResp => {

                    this.ingredient.parseIngredient(ingredientResp);

                    //get the qtd from the recipe
                    this.quantity = this.ingredient.quantities
                        .find(quantityIN => quantityIN.recipeId === this.recipeId);

                    if(!this.quantity) {
                        this.createQuantity();
                    }

                    this.populateCategory(this.ingredient.categoryId)

                }).catch(err => console.error(err));

        } else {
            this.createQuantity()
        }
    }

    ionViewDidEnter() {

        this.listCategory = [];

        //for the select list.
        this.ingredientService.getCategories()
            .subscribe(catListResp => {

                    let fakeCheckTypeArray = catListResp as Category[];

                    fakeCheckTypeArray.forEach(cat => {
                        let category = new Category();
                        category.parseCategory(cat);

                        this.listCategory.push(category)
                    });
                },
                err => console.error("Error to get list recipe")
            );
    }

    actionIngredient() {

        let actionSheet = this.actionSheetCtrl.create({
            title: 'Ingredient actions',
            buttons: [
                {
                    text: 'Save',
                    role: 'save',
                    handler: () => {
                        this.saveIngredientCategory();
                        console.log('Destructive clicked');
                    }
                },
                {
                    text: 'Delete',
                    handler: () => {
                        this.deleteIngredient()
                    }
                },
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                }
            ]
        });
        actionSheet.present();
    }


    onChangeCat() {

        if (this.ingredient.categoryId === 'addNew')  {
            this.showNewCat = true;
            this.currentCategory = new Category();

        } else {
            this.populateCategory(this.ingredient.categoryId);
        }
    }

    deleteIngredient() {
        this.ingredientService._delete(this.ingredient)
            .then(response =>
            {
                this.ingredient = new Ingredient();
                this.currentCategory = new Category();
                console.log("deleted!", response)
            })
            .catch(err => console.error("Error deleting", err));
    }

    //Ingredient 1 x N cat
    saveIngredientCategory(){

        //save the quantity related to the recipe
        this.setQuantity();

        if(this.ingredient.categoryId === 'addNew') {
            this.currentCategory.name = this.newCatName;
        }

        //TODO gonna change.
        //this.currentCategory.setRecipeIds(this.recipeId);
        //this.ingredient.currentCategory.recipe_ids.push(this.recipeId);

        if(this.ingredient.categoryId !== 'addNew') {

            this.ingredientService.updateCategory(this.currentCategory)
                .then(response => this.updateCategorySuccess(response))
                .catch(reason => this.handleError("updateCategory error", reason));

        } else {

            this.ingredientService.insertCategory(this.currentCategory)
                .then(response => this.insertCatSuccess(response))
                .catch(reason => this.handleError("insertCategory error", reason));
        }

    }

    getMin() {
        return 0;
    }

    getMax() {

        if(this.quantity.typeQuantity === QuantityType.KG) {
            return 2000;
        } else {
            return 10;
        }
    }

    getStep() {

        if(this.quantity.typeQuantity === QuantityType.KG) {
            return 100;
        } else {
            return 1;
        }
    }

    private setQuantity() {

        if(this.recipeId) {

            this.quantity.name =  this.quantity.recipeId + ":" +this.quantity.qtd.toString();
            if(!this.quantity._id) {
                this.quantity._id = this.ingredient._id + ":"+ this.recipeId
            }

            let qdtIndex = this.ingredient.quantities.findIndex(quantityIN => {
                return quantityIN.recipeId === this.quantity.recipeId
            });

            //if there is quantity in the quantities array of the ingredient, update it
            if(qdtIndex !== -1 ) {

                this.ingredient.quantities[qdtIndex] = this.quantity;

            } else {

                this.ingredient.quantities.push(this.quantity);
            }

        } else {
            console.warn("recipeId undefined ingredient needs a recipe");
            this.ingredientService.messageError("recipeId undefined ingredient needs a recipe");
        }
    }

    //only insert ingredient
    private setRecipe() {

        if(this.recipeId) {
          //  let index = this.ingredient.recipe_ids.findIndex(id => id === this.recipeId);
            this.ingredient.recipe_ids.push(this.recipeId);
        }

    }

    private updateCategorySuccess(response) {

        console.log("Cat Updated!!@", response);

        if(this.ingredient._id) {
            //TODO add validation save
             this.updateIngredient();

        } else {
            //TODO add validation save

            this.currentCategory._rev = response.rev

            this.insertIngredient();
        }
    }

    private insertCatSuccess(response) {
        console.log("Cat Inserted!*", response)

        this.currentCategory._id = response.id;
        this.currentCategory._rev = response.rev;

        //TODO add validation save
        this.insertIngredient();
    }

    private successSaveIng(response) {

        this.ingredientService.message("Ingredient successfully saved!");

        //come from recipe list
        //*** do not navigate um the actionSheetCtrl it crashes the next page sometimes
        //this.navCtrl.push(IngredientListComponent, {recipeId: this.recipeId});
    }

    private handleError(message, reason) {

        console.error(message, reason);
        this.ingredientService.messageError(message);
    }

    private createQuantity(){
        this.quantity = new Quantity(this.getMin(), QuantityType.KG, this.recipeId);
        this.quantity.recipeId = this.recipeId;
    }

    private insertIngredient() {

        this.setRecipe();

        this.ingredientService.insertIngredient(this.ingredient, this.currentCategory)
            .then(response => this.successSaveIng(response))
            .catch(reason => this.handleError("insertIngredient error", reason));
    }

    private updateIngredient() {

        this.ingredientService.updateIngredient(this.ingredient)
            .then(response => this.successSaveIng(response))
            .catch(reason => this.handleError("updateIngredient error", reason));
    }

    private populateCategory(categoryId) {
        this.ingredientService.get(categoryId)
            .then(categoryResp =>  this.currentCategory.parseCategory(categoryResp))
            .catch(reason => this.handleError("get error", reason));
    }
}
