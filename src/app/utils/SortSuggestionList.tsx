const SortSuggestionList = (array: string[], letter: string) => {
  let startsWithLetter = array.filter((item) =>
    item.toLowerCase().startsWith(letter),
  );
  let hasLetter = array.filter(
    (item) => !item.toLowerCase().startsWith(letter),
  );

  return [...startsWithLetter, ...hasLetter];
};
export default SortSuggestionList;
