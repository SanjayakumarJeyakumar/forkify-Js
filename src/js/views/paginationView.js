import View from './view.js';
import icon from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  _generateMarkup() {
    const curPage = this._data.page;
    const numPage = Math.ceil(
      this._data.results.length / this._data.resultPerPage
    );

    if (curPage === 1 && numPage > 1) {
      //page 1 and have other page
      return this._generateMarkupRightButton(curPage);
    }
    if (curPage === numPage && curPage !== 1) {
      //last page
      return this._generateMarkupLeftButton(curPage);
    }
    if (curPage < numPage) {
      //middle page
      return `${this._generateMarkupLeftButton(curPage)}
      ${this._generateMarkupRightButton(curPage)}`;
    }
    return ''; //page 1 and have no other page
  }

  _generateMarkupLeftButton(page) {
    return `
        <button data-goto="${
          page - 1
        }"  class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icon}#icon-arrow-left"></use>
            </svg>
            <span>Page ${page - 1}</span>
          </button>
        `;
  }
  _generateMarkupRightButton(page) {
    return `
          <button data-goto="${
            page + 1
          }" class="btn--inline pagination__btn--next">
            <span>Page ${page + 1}</span>
            <svg class="search__icon">
              <use href="${icon}#icon-arrow-right"></use>
            </svg>
          </button> 
        `;
  }

  addHandlerPagination(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }
}

export default new PaginationView();
