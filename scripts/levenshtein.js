function calculateLevenshteinDistance(string1, string2) {
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
}
