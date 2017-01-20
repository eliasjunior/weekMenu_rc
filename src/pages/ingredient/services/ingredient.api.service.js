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
var core_1 = require("@angular/core");
var base_api_service_1 = require("../../services/base.api.service");
var rxjs_1 = require("rxjs");
var IngredientApiService = (function (_super) {
    __extends(IngredientApiService, _super);
    function IngredientApiService(http) {
        _super.call(this);
        this.http = http;
        this.categories = [];
    }
    // private recipes : Recipe[];
    IngredientApiService.prototype.getListDocs = function () {
        var _this = this;
        if (!this.categories) {
            return this.http
                .get(this.host + "/category")
                .map(this.extractData)
                .catch(this.handleError);
        }
        else {
            return rxjs_1.Observable.create(function (observer) {
                observer.next(_this.categories);
                observer.complete();
            });
        }
    };
    IngredientApiService.prototype.getIngredient = function (id) {
        return this.http
            .get(this.host + "/ingredient/" + id)
            .map(this.extractData)
            .catch(this.handleError);
    };
    IngredientApiService.prototype.getCategory = function (id) {
        return this.http
            .get(this.host + "/category/" + id)
            .map(this.extractData)
            .catch(this.handleError);
    };
    IngredientApiService.prototype.getCatgories = function () {
        return this.http
            .get(this.host + "/category")
            .map(this.extractData)
            .catch(this.handleError);
    };
    IngredientApiService.prototype.getIngredientRecipe = function (ingredientId, recipeId) {
        return this.http
            .get(this.host + "/ingredient/recipe/" + ingredientId + "/" + recipeId)
            .map(this.extractData)
            .catch(this.handleError);
    };
    IngredientApiService = __decorate([
        core_1.Injectable()
    ], IngredientApiService);
    return IngredientApiService;
}(base_api_service_1.BaseApiService));
exports.IngredientApiService = IngredientApiService;
