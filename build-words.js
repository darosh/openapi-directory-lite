require('fs').writeFileSync('words.txt', require('./search.json').invertedIndex.map(d => d[0]).join(', '));
