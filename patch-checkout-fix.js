import fs from 'fs';
let code = fs.readFileSync('src/components/CheckoutView.tsx', 'utf-8');

// I need to find the exact structure and fix the tags.
// Let's just restore from my knowledge or a simpler search/replace.

// The issue is:
// {isShippingRequested && (
//   <>
// <div> (Delivery Destination State)
//   ...
// </div>
// </div> (End of grid grid-cols-1 sm:grid-cols-2)
//
// {/* Full street Address */}
// ...
// {/* Delivery Logistics selector */}
// ...
// </>)

code = code.replace(
  '                      {isShippingRequested && (\n                        <>\n                      <div>\n                        <label className="text-[10px] uppercase font-mono font-bold text-gray-400 block mb-1">Delivery Destination State *</label>',
  '                      <div>\n                        <label className="text-[10px] uppercase font-mono font-bold text-gray-400 block mb-1">Delivery Destination State *</label>'
);

code = code.replace(
  '                      </div>\n                    </div>\n                    </>\n                    )}',
  '                      </div>\n                    </div>'
);

fs.writeFileSync('src/components/CheckoutView.tsx', code);
