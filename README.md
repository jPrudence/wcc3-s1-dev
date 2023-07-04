## Autocomplete Library

The Autocomplete library is a JavaScript library that provides autocomplete functionality for search fields. It suggests search queries based on a search history and allows users to select from the suggestions.

Live demo: [https://dev-s1-ekipa.netlify.app](https://dev-s1-ekipa.netlify.app)

This library was developed for the `Weekly Coding Challenge` 3th edition organized by Teckzara Community.

### Demo with empty search history

Open `index.html` in your web browser to see the Autocomplete library in action.

### Demo with pre-populated search history

The Autocomplete library comes with a demo HTML file called `demo.html`, which you can use to test the functionality. In the demo file, there is an existing search history with the following queries:

- "Macbook 2023"
- "Macbook 2023 Pro Max"
- "anana sy hena"
- "anana sy ovy ary hena"
- "hena sy anana"

You can open the `demo.html` file in your web browser to see the Autocomplete library in action and interact with the search field to test the autocomplete suggestions based on the provided search history.

Live demo: [https://dev-s1-ekipa.netlify.app/demo.html](https://dev-s1-ekipa.netlify.app/demo.html)

### Features

- Auto-suggests search queries based on a search history.
- Uses the Levenshtein distance algorithm to calculate the similarity between search queries.
- Saves search queries to local storage for persistence.

### Usage in your project

To use the Autocomplete library, follow these steps:

1. Include the Autocomplete library in your HTML file:

```html
<link rel="stylesheet" href="./src/jpr-autocomplete.css" />
<script src="./src/jpr-autocomplete.js"></script>
```

2. Initialize the Autocomplete library by calling the `init` method with the ID of the form element that contains the autocomplete functionality:

```javascript
const searchAutocomplete = Autocomplete().init("form-autocomplete");
```

Make sure to replace `"form-autocomplete"` with the actual ID of your form element.

3. Set up the necessary HTML structure:

```html
<form id="form-autocomplete">
  <div class="form-control">
    <input type="text" class="jpr-autocomplete-input-search" placeholder="Rechercher..." />
    <button type="submit" class="jpr-autocomplete-btn-search">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#8b8b8b" d="M21.71 20.29L18 16.61A9 9 0 1 0 16.61 18l3.68 3.68a1 1 0 0 0 1.42 0a1 1 0 0 0 0-1.39ZM11 18a7 7 0 1 1 7-7a7 7 0 0 1-7 7Z"/></svg>
  </div>

  <ul class="jpr-autocomplete-suggestions"></ul>
</form>
```

Ensure that you have an input field with the class `"jpr-autocomplete-input-search"`, an unordered list with the class `"jpr-autocomplete-suggestions"`, and optionally, a button with the class `"jpr-autocomplete-btn-search"` for submitting the form.

4. Customize the library (optional):

You can modify the following properties of the Autocomplete library:

- `debugMode`: Set it to `true` to enable debug logs.
- `maxLevenshteinDistance`: Set the maximum Levenshtein distance allowed for a search query to be considered a suggestion.
- `searchHistoryId`: Change the ID used to store the search history in local storage.

#WCC #WCC3 #WCC_DEV
