const Autocomplete = () => ({
  debugMode: false, // boolean
  maxLevenshteinDistance: 8, // number
  maxLenghtMarge: 1, // number
  formAutocomplete: null, // htmlElement
  inputSearchElement: null, // htmlElement
  previewElement: null, // htmlElement
  btnSearchElement: null, // htmlElement
  autocompleteSuggestionsElement: null, // htmlElement
  searchHistoryId: "searchHistory", // string
  searchHistory: [], // Array
  currentSuggestions: [], // Array
  currentQuery: "", // string
  historyIcon: `<svg xmlns="http://www.w3.org/2000/svg" width="14" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M4.929 17.657a1 1 0 0 0 0 1.414c3.905 3.905 10.237 3.905 14.142 0c3.905-3.905 3.905-10.237 0-14.142c-3.905-3.905-10.237-3.905-14.142 0A9.962 9.962 0 0 0 2.049 11H1a1 1 0 0 0-.707 1.707l2 2l.002.002a.997.997 0 0 0 1.413-.003l2-1.999A1 1 0 0 0 5 11h-.938a8 8 0 1 1 2.28 6.657a1 1 0 0 0-1.413 0ZM10 8a1 1 0 1 1 2 0v4h4a1 1 0 1 1 0 2h-5a1 1 0 0 1-1-1V8Z" clip-rule="evenodd"/></svg>`, // string
  searchCallback: (query) => {
    console.log("Search query: ", query);
  }, // function

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

  saveSearchQueryToHistory() {
    if (
      this.currentQuery.length &&
      !this.searchHistory.includes(this.currentQuery)
    ) {
      this.searchHistory.push(this.currentQuery);

      localStorage.setItem(
        this.searchHistoryId,
        JSON.stringify(this.searchHistory)
      );
    }
  },

  getSuggestions() {
    const newSuggestions = [];
    const preparedQuery = this.prepareKeyword(this.currentQuery);
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
        newSuggestions.push(preparedHistoryItem);
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

          newSuggestions.push(preparedHistoryItem);
          break;
        }
      }
    }

    this.debugMode && console.log({ newSuggestions });

    return newSuggestions.sort((a, b) => a.length - b.length);
  },

  setEventListenerForAutocompleteSuggestions() {
    this.autocompleteSuggestionsElement.querySelectorAll("li").forEach((li) => {
      li.addEventListener("click", (e) => {
        const newQuery = e.target.innerText;

        this.inputSearchElement.value = newQuery;

        this.handleNewSearchQuery();
        this.searchCallback(newQuery);
      });
    });
  },

  highlightSimilarWordInSuggestion(suggestion, query) {
    const regex = new RegExp(query, "i");
    const similarWord = suggestion.match(regex);

    if (!similarWord) {
      return suggestion;
    }

    return suggestion.replace(
      regex,
      `<span class="jpr-autocomplete-suggestion-similar">${similarWord[0]}</span>`
    );
  },

  updateAutocompleteUi() {
    const newAutocompleteElements = this.currentSuggestions.map(
      (suggestion) => {
        hihglightedSuggestion = this.highlightSimilarWordInSuggestion(
          suggestion,
          this.currentQuery
        );

        return `<li><span class="jpr-autocomplete-suggestion-icon">${this.historyIcon}</span><span class="jpr-autocomplete-suggestion-value">${hihglightedSuggestion}</span></li>`;
      }
    );

    this.autocompleteSuggestionsElement.innerHTML =
      newAutocompleteElements.join("");

    this.setEventListenerForAutocompleteSuggestions();
  },

  updateAutocompletePreviewUi() {
    const similarSuggestion = this.currentSuggestions.find((suggestion) =>
      suggestion.startsWith(this.currentQuery)
    );

    if (similarSuggestion) {
      this.previewElement.innerText = similarSuggestion;
    } else {
      this.previewElement.innerText = "";
    }
  },

  handleNewSearchQuery() {
    this.syncQueryWithInputValue();

    if (!this.currentQuery) {
      this.autocompleteSuggestionsElement.innerHTML = "";
      this.previewElement.innerText = "";
      return;
    }

    this.currentSuggestions = this.getSuggestions();

    this.updateAutocompleteUi();
    this.updateAutocompletePreviewUi();
  },

  syncQueryWithInputValue() {
    this.currentQuery = this.inputSearchElement.value;
  },

  handleSubmission(e) {
    e.preventDefault();

    this.syncQueryWithInputValue();
    this.saveSearchQueryToHistory();
  },

  selectFirstSuggestion() {
    if (this.currentSuggestions.length) {
      const firstSuggestion = this.currentSuggestions[0];

      if (firstSuggestion.length > this.currentQuery.length) {
        this.inputSearchElement.value = firstSuggestion;
        this.handleNewSearchQuery();
      }
    }
  },

  initEventListeners() {
    this.inputSearchElement.addEventListener("keydown", (e) => {
      if (e.key === "Tab") {
        e.preventDefault();

        this.selectFirstSuggestion();
      }
    });

    this.inputSearchElement.addEventListener("input", (e) =>
      this.handleNewSearchQuery()
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

  addAutocompletePreviewElement() {
    const autocompletePreviewElement = `<span class="jpr-autocomplete-preview"></span>`;
    this.inputSearchElement.insertAdjacentHTML(
      "afterend",
      autocompletePreviewElement
    );

    this.previewElement = this.formAutocomplete.querySelector(
      ".jpr-autocomplete-preview"
    );
  },

  init(idFormAutocomplete, customSearchCallback) {
    if (!idFormAutocomplete) {
      console.error("The id of the form is missing.");
      return;
    }

    this.formAutocomplete = document.getElementById(idFormAutocomplete);

    if (!this.formAutocomplete) {
      console.error("The form element is missing.");
      return;
    }

    this.inputSearchElement = this.formAutocomplete.querySelector(
      ".jpr-autocomplete-input-search"
    );

    if (!this.inputSearchElement) {
      console.error("The input search element is missing.");
      return;
    }

    this.autocompleteSuggestionsElement = this.formAutocomplete.querySelector(
      ".jpr-autocomplete-suggestions"
    );

    if (!this.autocompleteSuggestionsElement) {
      console.error("The autocomplete suggestions element is missing.");
      return;
    }

    this.btnSearchElement = this.formAutocomplete.querySelector(
      ".jpr-autocomplete-btn-search"
    );

    this.searchHistoryId =
      this.formAutocomplete.dataset.historyId || this.searchHistoryId;

    this.searchCallback = customSearchCallback || this.searchCallback;

    this.retrieveSearchHistoryFromLocalStorage();

    this.initEventListeners();

    this.addAutocompletePreviewElement();

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
