"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Created by eliasmj on 08/08/2016.
 */
var recipe_model_1 = require("./recipe.model");
var main_meal_model_1 = require("./main.meal.model");
var core_1 = require("@angular/core");
require('rxjs/add/operator/map');
require('rxjs/add/observable/timer');
require('rxjs/add/observable/fromPromise');
var base_service_1 = require("../services/base.service");
var RecipeService = (function (_super) {
    __extends(RecipeService, _super);
    function RecipeService(recipeApiService) {
        _super.call(this);
        this.recipeApiService = recipeApiService;
    }
    RecipeService.prototype.getRecipe = function (id) {
        return this.recipeApiService.get(id)
            .map(this.convertDocToRecipes)
            .catch(this.errorHandler);
    };
    RecipeService.prototype.getList = function () {
        return this.recipeApiService.geRecipeDocs()
            .map(this.convertDocsToRecipes)
            .catch(this.errorHandler);
    };
    RecipeService.prototype.getMainMealList = function () {
        return [
            new main_meal_model_1.MainMeal("fish", new main_meal_model_1.MealDetail('Fish', 'fish.png')),
            new main_meal_model_1.MainMeal("meat", new main_meal_model_1.MealDetail('Meat', 'meat-1.png')),
            new main_meal_model_1.MainMeal("poultry", new main_meal_model_1.MealDetail('Poultry', 'chicken-3.png')),
            new main_meal_model_1.MainMeal("veg", new main_meal_model_1.MealDetail('Vegetarian', 'veg-5.png')),
            new main_meal_model_1.MainMeal("pasta", new main_meal_model_1.MealDetail('Pasta', 'pasta-1.png')),
            new main_meal_model_1.MainMeal("side", new main_meal_model_1.MealDetail('Side', 'veg-5.png')),
            new main_meal_model_1.MainMeal("groceries", new main_meal_model_1.MealDetail('Groceries', 'groceries-1.png')),
            new main_meal_model_1.MainMeal("other", new main_meal_model_1.MealDetail('Other', 'images.png'))
        ];
    };
    RecipeService.prototype.saveRecipe = function (recipe) {
        return this.recipeApiService.saveRecipe(recipe);
    };
    RecipeService.prototype.convertDocsToRecipes = function (docs) {
        var recipes = [];
        //need to get the week's menu separated
        docs.forEach(function (doc) {
            var recipe = new recipe_model_1.Recipe();
            recipe.parseRecipe(doc);
            recipes.push(recipe);
        });
        return recipes;
    };
    RecipeService.prototype.convertDocToRecipes = function (doc) {
        var recipe = new recipe_model_1.Recipe();
        recipe.parseRecipe(doc);
        return recipe;
    };
    //TODO need to test and call
    RecipeService.prototype.deleteRecipe = function (id) {
        var newRecipes = this.recipes.filter(function (recipe) { return recipe.name !== id; });
        console.log("Deleted filter", newRecipes);
        this.recipes = newRecipes;
    };
    RecipeService = __decorate([
        core_1.Injectable()
    ], RecipeService);
    return RecipeService;
}(base_service_1.BaseService));
exports.RecipeService = RecipeService;
