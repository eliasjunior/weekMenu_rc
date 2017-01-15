/**
 * Created by eliasmj on 08/08/2016.
 */
import {Component} from "@angular/core";
import {Ingredient} from "../ingredient.model";
import {Category} from "../category.model";
import {IngredientService} from "../services/ingredient.service";
import {NavParams, ActionSheetController} from "ionic-angular";
import {QuantityType} from "../../constants/quantity.type.constant";
import {IngredientRecipeAttributes} from "../ingredient.recipe.model";

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

    recipeId: string;

    attribute: IngredientRecipeAttributes;

    labelQdyList: string [] = [QuantityType.L, QuantityType.KG, QuantityType.UNIT];

    constructor(public  ingredientService : IngredientService,
                private navParams: NavParams,
                private actionSheetCtrl: ActionSheetController
    ) {


        this.recipeId = navParams.get('recipeId');
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

        this.categories = [];

        //for the select list.
        this.ingredientService.getCategories()
            .subscribe(cats => {
                    this.categories = cats;

                    let tempCat = this.categories.find(cat => cat._id === this.ingredient._creator);
                    if(tempCat) {
                        this.currentCategory = tempCat;
                    } else {
                        console.log("category not found");
                    }

                    if (this.ingredient._id) {

                        this.ingredientService.getIngredientRecipeAttributes(this.ingredient._id, this.recipeId)
                            .subscribe(attributes => {

                                this.attribute = attributes;

                            }, err => {
                                this.ingredientService.messageError(err)
                            });

                    } else {
                        this.createQuantity();
                    }

                },
                err => console.error("Error to getCategories")
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


        if (this.ingredient._creator === 'addNew')  {
            this.showNewCat = true;
            this.currentCategory = new Category();

        } else {

            this.currentCategory = this.categories.filter(cat => {
                return cat._id === this.ingredient._creator
            })[0];

        }
    }

    deleteIngredient() {
        // this.ingredientService._delete(this.ingredient)
        //     .then(response =>
        //     {
        //         this.ingredient = new Ingredient();
        //         this.currentCategory = new Category();
        //         console.log("deleted!", response)
        //     })
        //     .catch(err => console.error("Error deleting", err));
    }

    //Ingredient 1 x N cat
    saveIngredientCategory(){

        if(this.recipeId) {
            this.currentCategory.recipeId = this.recipeId;
        }

        if(this.ingredient._creator === 'addNew') {
            this.currentCategory.name = this.newCatName;

            this.ingredientService.saveCategory(this.currentCategory)
                .subscribe((doc) => {
                    this.saveIngredientAndAttributes(doc);
                }, err => {
                    this.ingredientService.messageError(err)
                });

        } else {
            //TODO fix api missing update ingredient to push array
            this.ingredientService.saveCategory(this.currentCategory)
                .subscribe(() => {
                    this.saveIngredientAndAttributes(this.currentCategory);

                }, err => {
                    this.ingredientService.messageError(err)
                });
        }

    }

    getMin() {
        return 0;
    }

    getMax() {

        if(this.attribute.labelQuantity === QuantityType.KG) {
            return 2000;
        } else {
            return 10;
        }
    }

    getStep() {

        if(this.attribute.labelQuantity === QuantityType.KG) {
            return 100;
        } else {
            return 1;
        }
    }

    private saveIngredientAndAttributes(doc) {

        console.log("Category Saved!", doc)
        console.log("Ingredient instance", this.ingredient)

        this.ingredient._creator = doc._id;
        this.attribute.recipeId = this.recipeId;
        this.attribute.ingredientId = this.ingredient._id;

        console.log("attribute instance", this.attribute)

        this.ingredientService.saveIngredient(this.ingredient, this.attribute)
            .subscribe(result => {

                console.log("Ingredient saved", result)

            }, err => {
                this.ingredientService.messageError(err)
            } )
    }

    private createQuantity(){
        this.attribute = new IngredientRecipeAttributes();
        this.attribute.labelQuantity = QuantityType.KG,
        this.attribute.recipeId = this.recipeId;
        this.attribute.quantity = this.getMin();
    }

}
