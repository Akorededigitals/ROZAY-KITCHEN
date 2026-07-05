import fs from 'fs';
let code = fs.readFileSync('src/components/ProductCatalog.tsx', 'utf-8');

code = code.replace(/const \[sortBy, setSortBy\] = useState\("newest"\);\n/g, '');
code = code.replace(/const \[priceFilter, setPriceFilter\] = useState\("all"\);\n/g, '');
code = code.replace(/setPriceFilter\("all"\); /g, '');

code = code.replace(
  '  useEffect(() => {\n    setCurrentPage(1);\n  }, [selectedCategory, searchQuery, sortBy, priceFilter]);',
  '  useEffect(() => {\n    setCurrentPage(1);\n  }, [selectedCategory, searchQuery]);'
);

code = code.replace(
  `    let matchesPrice = true;
    if (priceFilter === "under-50k") matchesPrice = product.price < 50000;
    else if (priceFilter === "50k-100k") matchesPrice = product.price >= 50000 && product.price <= 100000;
    else if (priceFilter === "over-100k") matchesPrice = product.price > 100000;

    return matchesCategory && matchesSearch && matchesPrice;
  });

  if (sortBy === "price-low-high") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-high-low") {
    filteredProducts.sort((a, b) => b.price - a.price);
  }`,
  `    return matchesCategory && matchesSearch;
  });`
);

// Remove UI
const filtersUIRegex = /\{\/\* Filters and Sort \*\/\}.*?\{\/\* Category Pills Slider \*\/\}/s;
code = code.replace(filtersUIRegex, '{/* Category Pills Slider */}');

fs.writeFileSync('src/components/ProductCatalog.tsx', code);
