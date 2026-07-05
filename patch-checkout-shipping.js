import fs from 'fs';
let code = fs.readFileSync('src/components/CheckoutView.tsx', 'utf-8');

if (!code.includes('isShippingRequested')) {
  code = code.replace(
    'const [deliveryMethod, setDeliveryMethod] = useState("island");',
    'const [deliveryMethod, setDeliveryMethod] = useState("island");\n  const [isShippingRequested, setIsShippingRequested] = useState(false);'
  );
  
  code = code.replace(
    'const getDeliveryFee = () => {\n    switch (deliveryMethod) {',
    'const getDeliveryFee = () => {\n    if (!isShippingRequested) return 0;\n    switch (deliveryMethod) {'
  );

  code = code.replace(
    'const getDeliveryLabel = () => {\n    switch (deliveryMethod) {',
    'const getDeliveryLabel = () => {\n    if (!isShippingRequested) return "Self-Pickup in Idumota Showroom";\n    switch (deliveryMethod) {'
  );
  
  code = code.replace(
    '<div>\n                        <label className="text-[10px] uppercase font-mono font-bold text-gray-400 block mb-1">Delivery Destination State *</label>',
    `<div className="col-span-1 sm:col-span-2 pt-2">
                        <label className="flex items-center gap-3 cursor-pointer bg-stone-50 p-4 rounded-xl border border-gray-200 hover:border-brand-300 transition-all">
                          <input 
                            type="checkbox" 
                            checked={isShippingRequested}
                            onChange={(e) => setIsShippingRequested(e.target.checked)}
                            className="w-5 h-5 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                          />
                          <div>
                            <span className="block text-sm font-bold text-gray-900">Request Home Delivery / Shipping</span>
                            <span className="block text-xs text-gray-500 mt-0.5">Check this box if you want us to deliver to your address (Logistics fee applies).</span>
                          </div>
                        </label>
                      </div>

                      {isShippingRequested && (
                        <>
                      <div>
                        <label className="text-[10px] uppercase font-mono font-bold text-gray-400 block mb-1">Delivery Destination State *</label>`
  );

  code = code.replace(
    '                      {/* Delivery Logistics selector */}\n                      <div>\n                        <label className="text-[10px] uppercase font-mono font-bold text-gray-400 block mb-1">Courier Logistics Channel *</label>\n                        <select\n                          value={deliveryMethod}\n                          onChange={(e) => setDeliveryMethod(e.target.value)}\n                          className="w-full text-xs px-3.5 py-3.5 bg-stone-50 border border-gray-200 focus:bg-white rounded-xl focus:outline-none"\n                        >\n                          {state === "Lagos" ? (\n                            <>\n                              <option value="island">Lagos Island Flat Courier Delivery (+₦3,500)</option>\n                              <option value="mainland">Lagos Mainland Hub Logistics (+₦5,000)</option>\n                              <option value="pickup">Self-Pickup in Idumota Showroom (FREE)</option>\n                            </>\n                          ) : (\n                            <option value="states">Inter-State Carrier Parcel Hub (+₦12,000)</option>\n                          )}\n                        </select>\n                      </div>\n                    </div>',
    '                      {/* Delivery Logistics selector */}\n                      <div>\n                        <label className="text-[10px] uppercase font-mono font-bold text-gray-400 block mb-1">Courier Logistics Channel *</label>\n                        <select\n                          value={deliveryMethod}\n                          onChange={(e) => setDeliveryMethod(e.target.value)}\n                          className="w-full text-xs px-3.5 py-3.5 bg-stone-50 border border-gray-200 focus:bg-white rounded-xl focus:outline-none"\n                        >\n                          {state === "Lagos" ? (\n                            <>\n                              <option value="island">Lagos Island Flat Courier Delivery (+₦3,500)</option>\n                              <option value="mainland">Lagos Mainland Hub Logistics (+₦5,000)</option>\n                            </>\n                          ) : (\n                            <option value="states">Inter-State Carrier Parcel Hub (+₦12,000)</option>\n                          )}\n                        </select>\n                      </div>\n                    </div>\n                    </>\n                    )}'
  );
  
  // Make address fields not required if !isShippingRequested
  code = code.replace(/<input\n                          type="text"\n                          required/g, '<input\n                          type="text"\n                          required={isShippingRequested}');

  fs.writeFileSync('src/components/CheckoutView.tsx', code);
}
