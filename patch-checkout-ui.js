import fs from 'fs';
let code = fs.readFileSync('src/components/CheckoutView.tsx', 'utf-8');

// I will just replace the entire block from "Delivery Destination State *" to the end of that grid,
// and the following fields. It's safer to use regex or string replace for exactly the blocks.

code = code.replace(
  '                      <div>\n                        <label className="text-[10px] uppercase font-mono font-bold text-gray-400 block mb-1">Delivery Destination State *</label>',
  '                      {isShippingRequested && (\n                        <div className="col-span-1 sm:col-span-2">\n                          <label className="text-[10px] uppercase font-mono font-bold text-gray-400 block mb-1">Delivery Destination State *</label>'
);

code = code.replace(
  '                          </select>\n                        </div>\n                      </div>\n                    </div>\n                    {/* Full street Address */}\n                    <div>',
  '                          </select>\n                        </div>\n                      </div>\n                      )}\n                    </div>\n                    \n                    {isShippingRequested && (\n                      <>\n                    {/* Full street Address */}\n                    <div>'
);

code = code.replace(
  '                        </select>\n                      </div>\n                    </div>\n\n                    {/* Secure Payments Options */}',
  '                        </select>\n                      </div>\n                    </div>\n                    </>\n                    )}\n\n                    {/* Secure Payments Options */}'
);

fs.writeFileSync('src/components/CheckoutView.tsx', code);
