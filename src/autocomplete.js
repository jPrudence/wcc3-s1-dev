const Autocomplete = () => ({
  debugMode: false, // boolean
  maxLevenshteinDistance: 8, // number
  maxLenghtMarge: 1.5, // number
  formAutocomplete: null, // htmlElement
  inputSearchElement: null, // htmlElement
  btnSearchElement: null, // htmlElement
  autocompleteResultsListElement: null, // htmlElement
  searchHistoryId: "searchHistory", // string
  searchHistory: [], // Array

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

  retrieveSearchHistoryFromLocalStorage() {
    this.searchHistory =
      JSON.parse(localStorage.getItem(this.searchHistoryId)) || [];
  },

  saveSearchQueryToHistory(query) {
    if (!this.searchHistory.includes(query)) {
      this.searchHistory.push(query);
      localStorage.setItem(
        this.searchHistoryId,
        JSON.stringify(this.searchHistory)
      );
    }
  },

  getSuggestions(query) {
    const suggestions = [];
    const preparedQuery = this.prepareKeyword(query);
    const queryWords = preparedQuery.split(" ");

    for (const searchHistoryItem of this.searchHistory) {
      let preparedHistoryItem = this.prepareKeyword(searchHistoryItem);

      // not suggest history item if * maxLenghtMarge of its length is less than the length of the query
      if (
        searchHistoryItem.length * this.maxLenghtMarge <
        preparedQuery.length
      ) {
        continue;
      }

      if (preparedHistoryItem.includes(preparedQuery)) {
        suggestions.push(preparedHistoryItem);
        continue;
      }

      // Calculate the total Levenshtein distance between the query and existing queries in the search history
      let historyItemWords = preparedHistoryItem.split(" ");
      let totalLevenshteinDistance = 0;

      for (const queryWord of queryWords) {
        let keywordDistance = Infinity;

        for (const historyItemWord of historyItemWords) {
          const levenshteinDistance = calculateLevenshteinDistance(
            queryWord,
            historyItemWord
          );

          this.debugMode &&
            console.log({
              queryWord,
              historyItemWord,
              levenshteinDistance,
              keywordDistance,
            });

          if (levenshteinDistance < keywordDistance) {
            keywordDistance = levenshteinDistance;
          }

          totalLevenshteinDistance += keywordDistance;
        }

        let isAcceptableDistance =
          totalLevenshteinDistance <
          Math.min(
            this.maxLevenshteinDistance,
            preparedQuery.length,
            preparedHistoryItem.length / 2
          );

        if (isAcceptableDistance) {
          this.debugMode &&
            console.log({
              totalLevenshteinDistance,
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

  setEventListenerForAutocompleteResults() {
    this.autocompleteResultsListElement.querySelectorAll("li").forEach((li) => {
      li.addEventListener("click", (e) => {
        const newQuery = e.target.innerText;

        this.inputSearchElement.value = newQuery;

        this.handleAutocomplete(newQuery);

        this.inputSearchElement.focus();
      });
    });
  },

  updateAutocompleteUi(suggestions) {
    const newAutocompleteElements = suggestions.map(function (suggestion) {
      return `<li>${suggestion}</li>`;
    });

    this.autocompleteResultsListElement.innerHTML =
      newAutocompleteElements.join("");

    this.setEventListenerForAutocompleteResults();
  },

  handleAutocomplete(query) {
    const suggestions = this.getSuggestions(query);

    this.updateAutocompleteUi(suggestions);
  },

  handleSubmission(e) {
    e.preventDefault();

    var query = this.inputSearchElement.value;
    this.saveSearchQueryToHistory(query);
  },

  initEventListeners() {
    this.inputSearchElement.addEventListener("input", (e) =>
      this.handleAutocomplete(e.target.value)
    );

    if (this.btnSearchElement) {
      this.btnSearchElement.addEventListener("click", (e) =>
        this.handleSubmission(e)
      );
    }

    this.formAutocomplete.addEventListener("submit", (e) =>
      this.handleSubmission(e)
    );
  },

  init(idFormAutocomplete) {
    if (!idFormAutocomplete) {
      console.error("The id of the form is missing.");
      return;
    }

    this.formAutocomplete = document.getElementById(idFormAutocomplete);

    if (!this.formAutocomplete) {
      console.error("The form element is missing.");
      return;
    }

    this.inputSearchElement =
      this.formAutocomplete.querySelector(".input-search");

    if (!this.inputSearchElement) {
      console.error("The input search element is missing.");
      return;
    }

    this.autocompleteResultsListElement = this.formAutocomplete.querySelector(
      ".autocomplete-results-list"
    );

    if (!this.autocompleteResultsListElement) {
      console.error("The autocomplete results list element is missing.");
      return;
    }

    this.btnSearchElement = this.formAutocomplete.querySelector(".btn-search");

    this.searchHistoryId =
      this.formAutocomplete.dataset.historyId || this.searchHistoryId;

    this.retrieveSearchHistoryFromLocalStorage();

    this.initEventListeners();

    return this;
  },
});

const calculateLevenshteinDistance = (string1, string2) => {
  let previousRow = [];
  let currentRow = [];
  const lengthString1 = string1.length;
  const lengthString2 = string2.length;
  let index1, index2;

  if (lengthString1 == 0) {
    return lengthString2;
  }

  if (lengthString2 == 0) {
    return lengthString1;
  }

  for (index2 = 0; index2 <= lengthString2; index2++) {
    previousRow[index2] = index2;
  }

  for (index1 = 1; index1 <= lengthString1; index1++) {
    for (currentRow = [index1], index2 = 1; index2 <= lengthString2; index2++) {
      currentRow[index2] =
        string1[index1 - 1] === string2[index2 - 1]
          ? previousRow[index2 - 1]
          : Math.min(
              previousRow[index2 - 1],
              previousRow[index2],
              currentRow[index2 - 1]
            ) + 1;
    }
    previousRow = currentRow;
  }

  return previousRow[lengthString2];
};
