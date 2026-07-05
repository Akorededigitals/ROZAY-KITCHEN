import fs from 'fs';
let code = fs.readFileSync('src/components/ProductCatalog.tsx', 'utf-8');

const filtersUI = `
        {/* Filters and Sort */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <select
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-xl bg-white text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-brand-500 w-full sm:w-auto"
            >
              <option value="all">All Prices</option>
              <option value="under-50k">Under ₦50,000</option>
              <option value="50k-100k">₦50,000 - ₦100,000</option>
              <option value="over-100k">Over ₦100,000</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-xl bg-white text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-brand-500 w-full sm:w-auto"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price-low-high">Price: Low to High</option>
              <option value="price-high-low">Price: High to Low</option>
            </select>
          </div>
        </div>
`;

code = code.replace('{/* Category Pills Slider */}', filtersUI + '\n        {/* Category Pills Slider */}');

const paginationUI = `
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-12">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-200 rounded-xl bg-white text-sm font-medium text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-stone-50 transition-colors"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600 font-medium px-4">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-200 rounded-xl bg-white text-sm font-medium text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-stone-50 transition-colors"
            >
              Next
            </button>
          </div>
        )}
`;

code = code.replace('</AnimatePresence>\n      </div>', '</AnimatePresence>\n' + paginationUI + '\n      </div>');

fs.writeFileSync('src/components/ProductCatalog.tsx', code);
