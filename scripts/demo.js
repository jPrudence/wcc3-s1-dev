function launchDemo() {
  localStorage.setItem(
    "searchHistory",
    JSON.stringify([
      "Macbook 2023",
      "Macbook 2023 Pro Max",
      "anana sy hena",
      "anana sy ovy ary hena",
      "hena sy anana",
    ])
  );

  Autocomplete.debugMode = true;

  Autocomplete.getSuggestions("Makbook pro 2023 max");
  Autocomplete.getSuggestions("Makbook pro 2023 max max");
  Autocomplete.getSuggestions("Makbook pro 2023");
  Autocomplete.getSuggestions("anana hena");
  Autocomplete.getSuggestions("hena a");
  Autocomplete.getSuggestions("anana");

  Autocomplete.debugMode = false;
}
