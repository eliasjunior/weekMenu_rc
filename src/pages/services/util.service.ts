import {Injectable} from "@angular/core";
import {IngredientService} from "../ingredient/ingredient.service";
import {RecipeService} from "../recipe/recipe.service";
//import {appConstant} from "../constants/app.constant";

@Injectable()
export class UtilService {
    constructor(
                public recipeService : RecipeService,
                public ingredientService : IngredientService) {

    }

    updateView() {

        // this.createDeleteIngredientIndex();
        // this.createDeleteCatIngredientIndex()
        // this.createDeleteRecipeIndex();


        this.ingredientService.createView();
        this.recipeService.createView();


        // //update the view map when need it
        // this.recipeService.get("dbversion")
        //     .then(response => {
        //
        //         console.log('dbversion FOUND, checking update', response);
        //
        //         if(response.name !== appConstant.VERSION) {
        //
        //             console.log("Update/deleting views");
        //
        //             this.createDeleteIngredientIndex();
        //
        //             this.createDeleteRecipeIndex();
        //
        //             this.updateDbVersion(response);
        //         }
        //     })
        //     .catch(err => {
        //         console.log("If dbversion is not created", err.name)
        //         if(err.name === "not_found") {
        //
        //             let version = new Base("version");
        //
        //             version._id = 'dbversion';
        //             version.name = appConstant.VERSION;
        //
        //             this.recipeService.add(version);
        //
        //             //creating the views
        //             this.ingredientService.createView();
        //             this.recipeService.createView();
        //
        //             console.log("version created")
        //
        //         } else {
        //             console.error("version", err)
        //         }
        //     });
    }

    // private updateDbVersion(response) {
    //     //update version, TODO create proper model
    //     let version = new Base("version");
    //     version.parse(response);
    //     //update version value
    //     version.name = appConstant.VERSION;
    //
    //     this.recipeService.update(version)
    //         .then(response => {
    //             console.log("version updated", response)
    //         }).catch(err => console.error("Err version update", err));
    // }

    // private createDeleteIngredientIndex() {
    //
    //     this.recipeService.deleteViewRecipe(appConstant.INGREDIENT_WEEK_INDEX)
    //         .then(response => {
    //             console.log("Delete success INGREDIENT_WEEK_INDEX", response);
    //
    //            // this.ingredientService.createView();
    //
    //         }).catch(reason => {
    //             console.error("error to delete view", reason);
    //             if(reason.name = "not_found") {
    //             }
    //         });
    // }
    //
    //
    // private createDeleteCatIngredientIndex() {
    //
    //     this.recipeService.deleteViewRecipe(appConstant.CAT_INGREDIENT_INDEX)
    //         .then(response => {
    //             console.log("Delete success CAT_INGREDIENT_INDEX", response);
    //
    //            // this.ingredientService.createView();
    //
    //         }).catch(reason => {
    //         console.error("error to delete view", reason);
    //         if(reason.name = "not_found") {
    //         }
    //     });
    // }
    //
    // private createDeleteRecipeIndex() {
    //
    //     this.recipeService.deleteViewRecipe(appConstant.RECIPE_INDEX)
    //         .then(response => {
    //             console.log("Delete success RECIPE_INDEX", response);
    //
    //             //create view
    //           //  this.recipeService.createView();
    //
    //         }).catch(reason => {
    //             console.error("error to delete view", reason);
    //             if(reason.name = "not_found") {
    //             }
    //          });
    //
    // }
}
