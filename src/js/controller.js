// controller.js
import * as modal from './modal.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    recipeView.renderSpinner();

    resultsView.update(modal.getSearchRecipePage());
    bookmarksView.update(modal.state.bookmark);

    await modal.loadRecipe(id);

    recipeView.render(modal.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSerachRecipe = async function () {
  try {
    resultsView.renderSpinner();

    const query = searchView.getQuery();
    if (!query) return;

    await modal.loadSearchRecipe(query);

    resultsView.render(modal.getSearchRecipePage(1));
    paginationView.render(modal.state.search);
  } catch (err) {
    resultsView.renderError();
  }
};

const controlPagination = function (page) {
  resultsView.render(modal.getSearchRecipePage(page));
  paginationView.render(modal.state.search);
};

const controlUpdateServing = function (newServing) {
  modal.updateServing(newServing);
  recipeView.update(modal.state.recipe);
};

const controlAddDeleteBookMark = function () {
  if (!modal.state.recipe.bookmarked) {
    modal.addBookMark(modal.state.recipe);
  } else {
    modal.deleteBookMark(modal.state.recipe.id);
  }
  recipeView.update(modal.state.recipe);
  bookmarksView.render(modal.state.bookmark);
};

const controlBookMark = function () {
  bookmarksView.render(modal.state.bookmark);
};

const controlAddRecipe = async function (data) {
  try {
    addRecipeView.renderSpinner();

    await modal.uploadRecipe(data);

    recipeView.render(modal.state.recipe);
    addRecipeView.renderMessage();
    bookmarksView.render(modal.state.bookmark);

    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);

    window.history.pushState(null, '', `#${modal.state.recipe.id}`);
  } catch (err) {
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateServing(controlUpdateServing);
  recipeView.addHandlerBookmark(controlAddDeleteBookMark);
  searchView.addHandlerSearch(controlSerachRecipe);
  paginationView.addHandlerPagination(controlPagination);
  bookmarksView.addHandlerRender(controlBookMark);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
