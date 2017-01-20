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
var rxjs_1 = require("rxjs");
var http_1 = require("@angular/http");
var base_api_service_1 = require("../services/base.api.service");
var RecipeApiService = (function (_super) {
    __extends(RecipeApiService, _super);
    function RecipeApiService(http) {
        _super.call(this);
        this.http = http;
    }
    // private recipes : Recipe[];
    RecipeApiService.prototype.geRecipeDocs = function () {
        var _this = this;
        if (!this.recipes) {
            return this.http
                .get(this.host + "/recipe")
                .map(this.extractData)
                .catch(this.handleError);
        }
        else {
            return rxjs_1.Observable.create(function (observer) {
                observer.next(_this.recipes);
                observer.complete();
            });
        }
    };
    RecipeApiService.prototype.get = function (id) {
        return this.http
            .get(this.host + "/recipe/" + id)
            .map(this.extractData)
            .catch(this.handleError);
    };
    RecipeApiService.prototype.saveRecipe = function (recipe) {
        //add date to the recipes
        recipe.menus = [];
        if (recipe._id) {
            return this.http
                .put(this.host + "/recipe", recipe, this.getHeadersOption())
                .map(this.extractData)
                .catch(this.handleError);
        }
        else {
            return this.http
                .post(this.host + "/recipe", recipe, this.getHeadersOption())
                .map(this.extractData)
                .catch(this.handleError);
        }
    };
    RecipeApiService.prototype.getHeadersOption = function () {
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        return options;
    };
    RecipeApiService = __decorate([
        core_1.Injectable()
    ], RecipeApiService);
    return RecipeApiService;
}(base_api_service_1.BaseApiService));
exports.RecipeApiService = RecipeApiService;
