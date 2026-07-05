import fs from 'fs';
let code = fs.readFileSync('src/components/CheckoutView.tsx', 'utf-8');

const oldBlock = `                      {isShippingRequested && (
                        <div className="col-span-1 sm:col-span-2">
                          <label className="text-[10px] uppercase font-mono font-bold text-gray-400 block mb-1">Delivery Destination State *</label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                          <select
                            value={state}
                            onChange={(e) => {
                              setState(e.target.value);
                              if (e.target.value !== "Lagos" && e.target.value !== "Lagos State") {
                                setDeliveryMethod("states");
                              }
                            }}
                            className="w-full text-xs pl-10 pr-3.5 py-3.5 bg-stone-50 border border-gray-200 focus:bg-white rounded-xl focus:outline-none"
                          >
                            <option value="Lagos">Lagos State</option>
                            <option value="Abuja">Abuja FCT</option>
                            <option value="Ogun">Ogun State</option>
                            <option value="Oyo">Oyo State</option>
                            <option value="Rivers">Rivers State</option>
                            <option value="Kano">Kano State</option>
                            <option value="Enugu">Enugu State</option>
                            <option value="Delta">Delta State</option>
                            <option value="Other">Other States</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    {/* Full street Address */}
                    <div>
                      <label className="text-[10px] uppercase font-mono font-bold text-gray-400 block mb-1">Full Detailed Street Address *</label>
                      <input
                        type="text"
                        required
                        placeholder="House Number, Street Name, Estate/Town Landmark information"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full text-xs px-3.5 py-3.5 bg-stone-50 border border-gray-200 focus:bg-white rounded-xl focus:outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] uppercase font-mono font-bold text-gray-400 block mb-1">City / Town *</label>
                        <input
                          type="text"
                          required={isShippingRequested}
                          placeholder="e.g. Ikeja, Lekki Phase 1, Ibadan"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full text-xs px-3.5 py-3.5 bg-stone-50 border border-gray-200 focus:bg-white rounded-xl focus:outline-none"
                        />
                      </div>
                      {/* Delivery Logistics selector */}
                      <div>
                        <label className="text-[10px] uppercase font-mono font-bold text-gray-400 block mb-1">Courier Logistics Channel *</label>
                        <select
                          value={deliveryMethod}
                          onChange={(e) => setDeliveryMethod(e.target.value)}
                          className="w-full text-xs px-3.5 py-3.5 bg-stone-50 border border-gray-200 focus:bg-white rounded-xl focus:outline-none"
                        >
                          {state === "Lagos" ? (
                            <>
                              <option value="island">Lagos Island Flat Courier Delivery (+₦3,500)</option>
                              <option value="mainland">Lagos Mainland Hub Logistics (+₦5,000)</option>
                            </>
                          ) : (
                            <option value="states">Inter-State Carrier Parcel Hub (+₦12,000)</option>
                          )}
                        </select>
                      </div>
                    </div>`;

const newBlock = `                      {isShippingRequested && (
                        <div className="col-span-1 sm:col-span-2">
                          <label className="text-[10px] uppercase font-mono font-bold text-gray-400 block mb-1">Delivery Destination State *</label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                            <select
                              value={state}
                              onChange={(e) => {
                                setState(e.target.value);
                                if (e.target.value !== "Lagos" && e.target.value !== "Lagos State") {
                                  setDeliveryMethod("states");
                                }
                              }}
                              className="w-full text-xs pl-10 pr-3.5 py-3.5 bg-stone-50 border border-gray-200 focus:bg-white rounded-xl focus:outline-none"
                            >
                              <option value="Lagos">Lagos State</option>
                              <option value="Abuja">Abuja FCT</option>
                              <option value="Ogun">Ogun State</option>
                              <option value="Oyo">Oyo State</option>
                              <option value="Rivers">Rivers State</option>
                              <option value="Kano">Kano State</option>
                              <option value="Enugu">Enugu State</option>
                              <option value="Delta">Delta State</option>
                              <option value="Other">Other States</option>
                            </select>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {isShippingRequested && (
                      <>
                        {/* Full street Address */}
                        <div>
                          <label className="text-[10px] uppercase font-mono font-bold text-gray-400 block mb-1">Full Detailed Street Address *</label>
                          <input
                            type="text"
                            required
                            placeholder="House Number, Street Name, Estate/Town Landmark information"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full text-xs px-3.5 py-3.5 bg-stone-50 border border-gray-200 focus:bg-white rounded-xl focus:outline-none"
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10px] uppercase font-mono font-bold text-gray-400 block mb-1">City / Town *</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Ikeja, Lekki Phase 1, Ibadan"
                              value={city}
                              onChange={(e) => setCity(e.target.value)}
                              className="w-full text-xs px-3.5 py-3.5 bg-stone-50 border border-gray-200 focus:bg-white rounded-xl focus:outline-none"
                            />
                          </div>
                          {/* Delivery Logistics selector */}
                          <div>
                            <label className="text-[10px] uppercase font-mono font-bold text-gray-400 block mb-1">Courier Logistics Channel *</label>
                            <select
                              value={deliveryMethod}
                              onChange={(e) => setDeliveryMethod(e.target.value)}
                              className="w-full text-xs px-3.5 py-3.5 bg-stone-50 border border-gray-200 focus:bg-white rounded-xl focus:outline-none"
                            >
                              {state === "Lagos" ? (
                                <>
                                  <option value="island">Lagos Island Flat Courier Delivery (+₦3,500)</option>
                                  <option value="mainland">Lagos Mainland Hub Logistics (+₦5,000)</option>
                                </>
                              ) : (
                                <option value="states">Inter-State Carrier Parcel Hub (+₦12,000)</option>
                              )}
                            </select>
                          </div>
                        </div>
                      </>
                    )}`;

code = code.replace(oldBlock, newBlock);
fs.writeFileSync('src/components/CheckoutView.tsx', code);
