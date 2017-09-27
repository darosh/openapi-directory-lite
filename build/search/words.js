require('fs').writeFileSync('./search/words.txt', require('../../search/index.json').invertedIndex.map(d => d[0]).join(', '));
