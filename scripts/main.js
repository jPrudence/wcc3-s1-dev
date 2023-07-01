const Autocomplete = {
  debugMode: false,
  maxLevenshteinDistance: 8,

  prepareKeyword(keyword) {
    const specialCharacterList = ".?!;:()[]{}/|_-+=*&^%$#@~`<''\"\\";

    // Clear special characters
    specialCharacterList.split("").forEach((char) => {
      keyword = keyword.replace(new RegExp(`\\${char}`, "g"), "");
    });

    // Remove multiple spaces
    keyword = keyword.replace(/\s+/g, " ").trim();

    return keyword.toLowerCase();
  },

  getSearchHistoryFromLocalStorage() {
    return JSON.parse(localStorage.getItem("searchHistory")) || [];
  },

  saveSearchQueryToHistory(query) {
    const searchHistory = this.getSearchHistoryFromLocalStorage();

    if (!searchHistory.includes(query)) {
      searchHistory.push(query);
      localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    }
  },

  getSuggestions(query) {
    const suggestions = [];
    const searchHistory = this.getSearchHistoryFromLocalStorage();
    const preparedQuery = this.prepareKeyword(query);
    const queryWords = preparedQuery.split(" ");

    for (const searchHistoryItem of searchHistory) {
      let preparedHistoryItem = this.prepareKeyword(searchHistoryItem);

      if (preparedHistoryItem.includes(preparedQuery)) {
        suggestions.push(preparedHistoryItem);
        continue;
      }

      let historyItemWords = preparedHistoryItem.split(" ");
      let totalDistance = 0;

      for (const queryWord of queryWords) {
        let keywordDistance = Infinity;

        for (const historyItemWord of historyItemWords) {
          const levenshteinDistance = calculateLevenshteinDistance(
            queryWord,
            historyItemWord
          );

          if (levenshteinDistance < keywordDistance) {
            keywordDistance = levenshteinDistance;
          }

          totalDistance += keywordDistance;
        }

        let isAcceptableDistance =
          totalDistance <
          Math.min(
            this.maxLevenshteinDistance,
            preparedQuery.length,
            preparedHistoryItem.length
          );

        if (isAcceptableDistance) {
          this.debugMode &&
            console.log({
              totalDistance,
              preparedHistoryItem,
              preparedQuery,
            });

          suggestions.push(preparedHistoryItem);
          break;
        }
      }
    }

    this.debugMode && console.log({ suggestions });

    return suggestions;
  },

  updateSuggestionsListUi(suggestions) {
    const newSuggestionElements = suggestions.map(function (suggestion) {
      return `<li><span class="autocomplete-results-list-match">${suggestion}</span></li>`;
    });

    document.getElementById("autocomplete-results-list").innerHTML =
      newSuggestionElements.join("");
  },

  handleAutocomplete(query) {
    const suggestions = this.getSuggestions(query);

    this.updateSuggestionsListUi(suggestions);
  },

  handleSubmission(e) {
    e.preventDefault();

    var query = document.getElementById("input-search").value;
    this.saveSearchQueryToHistory(query);
  },

  initEventListeners() {
    document
      .getElementById("input-search")
      .addEventListener("input", (e) =>
        this.handleAutocomplete(e.target.value)
      );

    document
      .getElementById("btn-search")
      .addEventListener("click", (e) => this.handleSubmission(e));

    document
      .getElementById("form-autocomplete")
      .addEventListener("submit", (e) => this.handleSubmission(e));
  },

  init() {
    this.initEventListeners();
  },
};

Autocomplete.init();
