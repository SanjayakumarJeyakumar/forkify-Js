// modal.js
import { AJAX } from './helper.js';
import { API_URL, RES_PER_PAGE, KEY } from './config.js';
import { makePerfectString } from './helper.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultPerPage: RES_PER_PAGE,
  },
  bookmark: [],
};

const createRecipeObject = function (data) {
  let { recipe } = data.data;
  return {
    cookingTime: recipe.cooking_time,
    id: recipe.id,
    title: recipe.title,
    image: recipe.image_url,
    ingredients: recipe.ingredients,
    publisher: recipe.publisher,
    servings: recipe.servings,
    sourceUrl: recipe.source_url,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
    state.recipe = createRecipeObject(data);
    state.recipe.bookmarked = state.bookmark.some(bmk => bmk.id === id);
  } catch (err) {
    throw err;
  }
};

export const loadSearchRecipe = async function (query) {
  try {
    query = makePerfectString(query);
    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    state.search.results = data.data.recipes.map(rec => ({
      id: rec.id,
      image: rec.image_url,
      publisher: rec.publisher,
      title: rec.title,
      ...(rec.key && { key: rec.key }),
    }));
  } catch (err) {
    throw err;
  }
};

export const getSearchRecipePage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultPerPage;
  const end = page * state.search.resultPerPage;
  return state.search.results.slice(start, end);
};

export const updateServing = function (newServing) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServing) / state.recipe.servings;
  });
  state.recipe.servings = newServing;
};

const setBookmarkToLocalStorage = function () {
  localStorage.setItem('bookmark', JSON.stringify(state.bookmark));
};

export const addBookMark = function (recipe) {
  if (state.bookmark.some(bmk => bmk.id === recipe.id)) return;
  state.bookmark.push(recipe);
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  setBookmarkToLocalStorage();
};

export const deleteBookMark = function (id) {
  const index = state.bookmark.findIndex(bmk => bmk.id === id);
  if (index !== -1) state.bookmark.splice(index, 1);
  if (id === state.recipe.id) state.recipe.bookmarked = false;
  setBookmarkToLocalStorage();
};

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(
        ([key, value]) => key.startsWith('ingredient') && value.trim() !== ''
      )
      .map(([_, value]) => {
        const ingArr = value.split(',').map(el => el.trim());
        if (ingArr.length !== 3 || !ingArr[2])
          throw new Error(
            'Wrong ingredient format. Use: quantity,unit,description'
          );
        return {
          quantity: ingArr[0] ? +ingArr[0] : null,
          unit: ingArr[1],
          description: ingArr[2],
        };
      });

    const recipe = {
      cooking_time: +newRecipe.cookingTime,
      title: newRecipe.title,
      image_url: newRecipe.image,
      ingredients,
      publisher: newRecipe.publisher,
      servings: +newRecipe.servings,
      source_url: newRecipe.sourceUrl,
    };

    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookMark(state.recipe);
  } catch (err) {
    throw err;
  }
};

const init = function () {
  const storage = localStorage.getItem('bookmark');
  if (storage) state.bookmark = JSON.parse(storage);
};
init();

export const clearBookmarks = function () {
  localStorage.removeItem('bookmark');
  state.bookmark = [];
};
