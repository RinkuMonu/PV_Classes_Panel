import { useState } from "react";
import { Settings as SettingsIcon } from "lucide-react";

export default function SettingsPage() {
  const [autoTranslation, setAutoTranslation] = useState(true);
  const [enableInvoiceEmail, setEnableInvoiceEmail] = useState(false);
  const [defaultLanguage, setDefaultLanguage] = useState("en");
  const [defaultCurrency, setDefaultCurrency] = useState("$");
  const [defaultTimezone, setDefaultTimezone] = useState("Indian/Mayotte");
  const [dateFormat, setDateFormat] = useState("D MMM, YYYY");
  const [receiptSize, setReceiptSize] = useState("57-mm");

  return (
    <main className="h-full overflow-y-auto">
      <div className="mx-auto grid px-2 sm:container">
        <div className="flex justify-between">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">
            Settings
          </h1>

          <div className="fixed  right-4 z-50 mr-8">
            <button
              className="inline-flex h-10 items-center justify-center  border border-transparent bg-emerald-500 px-6 py-2 align-bottom text-sm font-medium leading-5 text-white transition-colors duration-150 hover:bg-emerald-600 focus:outline-none active:bg-emerald-600"
              type="submit"
            >
              Update
            </button>
          </div>
        </div>

        <div className="tab-enter tab">
          <div className="mx-auto w-full rounded-lg bg-white p-4 dark:bg-gray-800 dark:text-gray-200 sm:container md:p-6">
            <form>
              <div className="grid grid-cols-12 pr-4 font-sans">
                <div className="col-span-12 md:col-span-12 lg:col-span-12">
                  {/* <div className="mb-1 inline-flex text-base font-semibold text-gray-800 dark:text-gray-400 md:mb-3 md:text-lg">
                    <SettingsIcon className="mr-2 mt-1 h-5 w-5" />
                    Settings
                  </div>
                  
                  <hr className="mb-3 md:mb-12" /> */}

                  <div className="max-h-full w-full flex-grow scrollbar-hide mt-2">
                    {/* Number of images per product */}
                    <div className="mb-6 grid items-center gap-3 sm:grid-cols-12 md:grid-cols-5 md:gap-5 lg:gap-6 xl:gap-6">
                      <label className="mb-1 block text-sm font-semibold text-gray-600 dark:text-gray-400 sm:col-span-2">
                        Number of images per product
                      </label>
                      <div className="sm:col-span-3">
                        <input
                          className="mr-2 block h-12 w-full rounded-md border border-gray-200 bg-gray-100 p-2 px-3 py-1 text-sm leading-5 text-gray-700 focus:border-gray-200 focus:bg-white focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:focus:border-gray-500 dark:focus:bg-gray-700"
                          type="number"
                          name="number_of_image_per_product"
                          placeholder="Number of images per product"
                          autoComplete="new-password"
                          defaultValue="5"
                        />
                      </div>
                    </div>

                    {/* Allow Auto Translation */}
                    <div className="mb-6 grid gap-3 sm:grid-cols-6 md:grid-cols-5 md:gap-5 lg:gap-6 xl:gap-6">
                      <label className="mb-1 block text-sm font-semibold text-gray-600 dark:text-gray-400 sm:col-span-2">
                        Allow Auto Translation
                      </label>
                      <div className="sm:col-span-4 md:col-span-3">
                        <div className="mb-3">
                          <div className="flex flex-wrap items-center">
                            <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-300"></label>
                            <div
                              className="react-switch ml-3 md:ml-0"
                              style={{
                                position: "relative",
                                display: "inline-block",
                                textAlign: "left",
                                opacity: 1,
                                direction: "ltr",
                                borderRadius: "15px",
                                transition: "opacity 0.25s",
                                touchAction: "none",
                                WebkitTapHighlightColor: "rgba(0, 0, 0, 0)",
                                userSelect: "none",
                              }}
                              onClick={() =>
                                setAutoTranslation(!autoTranslation)
                              }
                            >
                              <div
                                className="react-switch-bg"
                                style={{
                                  height: "30px",
                                  width: "80px",
                                  margin: "0px",
                                  position: "relative",
                                  background: autoTranslation
                                    ? "rgb(47, 133, 90)"
                                    : "rgb(229, 62, 62)",
                                  borderRadius: "15px",
                                  cursor: "pointer",
                                  transition: "background 0.25s",
                                }}
                              >
                                <div
                                  style={{
                                    height: "30px",
                                    width: "45px",
                                    position: "relative",
                                    opacity: autoTranslation ? 1 : 0,
                                    pointerEvents: "none",
                                    transition: "opacity 0.25s",
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "center",
                                      alignItems: "center",
                                      height: "100%",
                                      fontSize: "14px",
                                      color: "white",
                                      paddingLeft: "8px",
                                      paddingTop: "1px",
                                    }}
                                  >
                                    Yes
                                  </div>
                                </div>
                                <div
                                  style={{
                                    height: "30px",
                                    width: "45px",
                                    position: "absolute",
                                    opacity: autoTranslation ? 0 : 1,
                                    right: "0px",
                                    top: "0px",
                                    pointerEvents: "none",
                                    transition: "opacity 0.25s",
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "center",
                                      alignItems: "center",
                                      height: "100%",
                                      fontSize: "14px",
                                      color: "white",
                                      paddingRight: "5px",
                                      paddingTop: "1px",
                                    }}
                                  >
                                    No
                                  </div>
                                </div>
                              </div>
                              <div
                                className="react-switch-handle"
                                style={{
                                  height: "28px",
                                  width: "28px",
                                  background: "rgb(255, 255, 255)",
                                  display: "inline-block",
                                  cursor: "pointer",
                                  borderRadius: "50%",
                                  position: "absolute",
                                  transform: autoTranslation
                                    ? "translateX(51px)"
                                    : "translateX(1px)",
                                  top: "1px",
                                  outline: "0px",
                                  border: "0px",
                                  transition:
                                    "background-color 0.25s, transform 0.25s, box-shadow 0.15s",
                                }}
                              ></div>
                              <input
                                type="checkbox"
                                role="switch"
                                aria-checked={autoTranslation}
                                checked={autoTranslation}
                                onChange={() =>
                                  setAutoTranslation(!autoTranslation)
                                }
                                style={{
                                  border: "0px",
                                  clip: "rect(0px, 0px, 0px, 0px)",
                                  height: "1px",
                                  margin: "-1px",
                                  overflow: "hidden",
                                  padding: "0px",
                                  position: "absolute",
                                  width: "1px",
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Translation Secret Key (shown only when autoTranslation is true) */}
                    {autoTranslation && (
                      <div className="mb-6 grid gap-3 sm:grid-cols-6 md:grid-cols-5 md:gap-5 lg:gap-6 xl:gap-6">
                        <label className="mb-1 block text-sm font-semibold text-gray-600 dark:text-gray-400 sm:col-span-2">
                          Translation Secret Key
                          <br />
                          <small className="text-xs font-normal">
                            You can create key from{" "}
                            <a
                              href="#"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 underline hover:text-blue-700"
                            >
                              here
                            </a>
                          </small>
                        </label>
                        <div className="sm:col-span-4 md:col-span-3">
                          <input
                            className="mr-2 block h-12 w-full rounded-md border border-gray-200 bg-gray-100 p-2 px-3 py-1 text-sm leading-5 text-gray-700 focus:border-gray-200 focus:bg-white focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:focus:border-gray-500 dark:focus:bg-gray-700"
                            type="password"
                            name="translation_key"
                            placeholder="Translation Secret Key"
                            autoComplete="new-password"
                            defaultValue="••••••••••"
                          />
                        </div>
                      </div>
                    )}

                    {/* Default language */}
                    <div className="relative mb-6 grid gap-3 sm:grid-cols-6 md:grid-cols-5 md:gap-5 lg:gap-6 xl:gap-6">
                      <label className="mb-1 block text-sm font-semibold text-gray-600 dark:text-gray-400 sm:col-span-2">
                        Default language
                      </label>
                      <div className="sm:col-span-3">
                        <select
                          className="form-select block h-12 w-full rounded-md border border-gray-200 bg-gray-100 px-2 py-1 text-sm leading-5 text-gray-700 focus:border-gray-200 focus:bg-white focus:outline-none focus:shadow-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:focus:border-gray-500 dark:focus:bg-gray-700"
                          name="default_language"
                          value={defaultLanguage}
                          onChange={(e) => setDefaultLanguage(e.target.value)}
                        >
                          <option value="" hidden>
                            Select Language
                          </option>
                          <option value="fr">Français</option>
                          <option value="ur">Urdu</option>
                          <option value="hi">Hindi</option>
                          <option value="ar">Arabic</option>
                          <option value="de">German</option>
                          <option value="en">English</option>
                          <option value="bn">Bangla</option>
                        </select>
                      </div>
                    </div>

                    {/* Default currency */}
                    <div className="mb-6 grid items-center gap-3 sm:grid-cols-12 md:grid-cols-5 md:gap-5 lg:gap-6 xl:gap-6">
                      <label className="mb-1 block text-sm font-semibold text-gray-600 dark:text-gray-400 sm:col-span-2">
                        Default currency
                      </label>
                      <div className="sm:col-span-3">
                        <div className="col-span-8 sm:col-span-4">
                          <select
                            className="form-select block h-12 w-full rounded-md border border-gray-200 bg-gray-100 px-2 py-1 text-sm leading-5 text-gray-700 focus:border-gray-200 focus:bg-white focus:outline-none focus:shadow-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:focus:border-gray-500 dark:focus:bg-gray-700"
                            name="default_currency"
                            value={defaultCurrency}
                            onChange={(e) => setDefaultCurrency(e.target.value)}
                          >
                            <option value="Rp">Rupiah</option>
                            <option value="£">Pound</option>
                            <option value="$">Dollar</option>
                            <option value="€">Euro</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Default time zone */}
                    <div className="mb-6 grid items-center gap-3 sm:grid-cols-12 md:grid-cols-5 md:gap-5 lg:gap-6 xl:gap-6">
                      <label className="mb-1 block text-sm font-semibold text-gray-600 dark:text-gray-400 sm:col-span-2">
                        Default time zone
                      </label>
                      <div className="sm:col-span-3">
                        <select
                          className="form-select block h-12 w-full rounded-md border border-gray-200 bg-gray-100 px-2 py-1 text-sm leading-5 text-gray-700 focus:border-gray-200 focus:bg-white focus:outline-none focus:shadow-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:focus:border-gray-500 dark:focus:bg-gray-700"
                          name="default_time_zone"
                          value={defaultTimezone}
                          onChange={(e) => setDefaultTimezone(e.target.value)}
                        >
                          <option value="" hidden>
                            Default Time Zone
                          </option>
                          <option value="Pacific/Midway">
                            Pacific/Midway (GMT-11:00)
                          </option>
                          <option value="Pacific/Niue">
                            Pacific/Niue (GMT-11:00)
                          </option>
                          <option value="Indian/Mayotte">
                            Indian/Mayotte (GMT+03:00)
                          </option>
                          {/* Other timezone options would go here */}
                        </select>
                      </div>
                    </div>

                    {/* Default Date Format */}
                    <div className="mb-6 grid items-center gap-3 sm:grid-cols-12 md:grid-cols-5 md:gap-5 lg:gap-6 xl:gap-6">
                      <label className="mb-1 block text-sm font-semibold text-gray-600 dark:text-gray-400 sm:col-span-2">
                        Default Date Format
                      </label>
                      <div className="sm:col-span-3">
                        <select
                          className="form-select block h-12 w-full rounded-md border border-gray-200 bg-gray-100 px-2 py-1 text-sm leading-5 text-gray-700 focus:border-gray-200 focus:bg-white focus:outline-none focus:shadow-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:focus:border-gray-500 dark:focus:bg-gray-700"
                          name="default_date_format"
                          value={dateFormat}
                          onChange={(e) => setDateFormat(e.target.value)}
                        >
                          <option value="" hidden>
                            Default Date Format
                          </option>
                          <option value="MMM D, YYYY">MM/DD/YYYY</option>
                          <option value="D MMM, YYYY">DD/MM/YYYY</option>
                          <option value="YYYY,MMM D">YYYY/MM/DD</option>
                        </select>
                      </div>
                    </div>

                    {/* Receipt size (width) */}
                    <div className="relative mb-6 grid gap-3 sm:grid-cols-12 md:grid-cols-5 md:gap-5 lg:gap-6 xl:gap-6">
                      <label className="mb-1 block text-sm font-semibold text-gray-600 dark:text-gray-400 sm:col-span-2">
                        Receipt size (width)
                      </label>
                      <div className="sm:col-span-3">
                        <select
                          className="form-select h-12 block w-full rounded-md border border-gray-200 bg-gray-100 px-2 py-1 text-sm leading-5 text-gray-700 focus:border-gray-200 focus:bg-white focus:outline-none focus:shadow-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:focus:border-gray-500 dark:focus:bg-gray-700"
                          name="receipt_size"
                          value={receiptSize}
                          onChange={(e) => setReceiptSize(e.target.value)}
                        >
                          <option value="57-mm">57 mm</option>
                          <option value="80-mm">80 mm</option>
                          <option value="3-1/8">3 1/8"</option>
                          <option value="2-1/4">2 1/4"</option>
                          <option value="A4">A4</option>
                        </select>
                      </div>
                    </div>

                    {/* Enable Invoice Send to Customer by email */}
                    <div className="relative mb-6 grid gap-3 sm:grid-cols-12 md:grid-cols-5 md:gap-5 lg:gap-6 xl:gap-6">
                      <label className="mb-1 block text-sm font-semibold text-gray-600 dark:text-gray-400 sm:col-span-2">
                        Enable Invoice Send to Customer by email
                      </label>
                      <div className="sm:col-span-3">
                        <div className="mb-3">
                          <div className="flex flex-wrap items-center">
                            <label className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-300"></label>
                            <div
                              className="react-switch ml-3 md:ml-0"
                              style={{
                                position: "relative",
                                display: "inline-block",
                                textAlign: "left",
                                opacity: 1,
                                direction: "ltr",
                                borderRadius: "15px",
                                transition: "opacity 0.25s",
                                touchAction: "none",
                                WebkitTapHighlightColor: "rgba(0, 0, 0, 0)",
                                userSelect: "none",
                              }}
                              onClick={() =>
                                setEnableInvoiceEmail(!enableInvoiceEmail)
                              }
                            >
                              <div
                                className="react-switch-bg"
                                style={{
                                  height: "30px",
                                  width: "80px",
                                  margin: "0px",
                                  position: "relative",
                                  background: enableInvoiceEmail
                                    ? "rgb(47, 133, 90)"
                                    : "rgb(229, 62, 62)",
                                  borderRadius: "15px",
                                  cursor: "pointer",
                                  transition: "background 0.25s",
                                }}
                              >
                                <div
                                  style={{
                                    height: "30px",
                                    width: "45px",
                                    position: "relative",
                                    opacity: enableInvoiceEmail ? 1 : 0,
                                    pointerEvents: "none",
                                    transition: "opacity 0.25s",
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "center",
                                      alignItems: "center",
                                      height: "100%",
                                      fontSize: "14px",
                                      color: "white",
                                      paddingLeft: "8px",
                                      paddingTop: "1px",
                                    }}
                                  >
                                    Yes
                                  </div>
                                </div>
                                <div
                                  style={{
                                    height: "30px",
                                    width: "45px",
                                    position: "absolute",
                                    opacity: enableInvoiceEmail ? 0 : 1,
                                    right: "0px",
                                    top: "0px",
                                    pointerEvents: "none",
                                    transition: "opacity 0.25s",
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "center",
                                      alignItems: "center",
                                      height: "100%",
                                      fontSize: "14px",
                                      color: "white",
                                      paddingRight: "5px",
                                      paddingTop: "1px",
                                    }}
                                  >
                                    No
                                  </div>
                                </div>
                              </div>
                              <div
                                className="react-switch-handle"
                                style={{
                                  height: "28px",
                                  width: "28px",
                                  background: "rgb(255, 255, 255)",
                                  display: "inline-block",
                                  cursor: "pointer",
                                  borderRadius: "50%",
                                  position: "absolute",
                                  transform: enableInvoiceEmail
                                    ? "translateX(51px)"
                                    : "translateX(1px)",
                                  top: "1px",
                                  outline: "0px",
                                  border: "0px",
                                  transition:
                                    "background-color 0.25s, transform 0.25s, box-shadow 0.15s",
                                }}
                              ></div>
                              <input
                                type="checkbox"
                                role="switch"
                                aria-checked={enableInvoiceEmail}
                                checked={enableInvoiceEmail}
                                onChange={() =>
                                  setEnableInvoiceEmail(!enableInvoiceEmail)
                                }
                                style={{
                                  border: "0px",
                                  clip: "rect(0px, 0px, 0px, 0px)",
                                  height: "1px",
                                  margin: "-1px",
                                  overflow: "hidden",
                                  padding: "0px",
                                  position: "absolute",
                                  width: "1px",
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* From Email (shown only when enableInvoiceEmail is true) */}
                    {enableInvoiceEmail && (
                      <div className="mb-6 grid items-center gap-3 sm:grid-cols-12 md:grid-cols-5 md:gap-5 lg:gap-6 xl:gap-6">
                        <label className="mb-1 block text-sm font-semibold text-gray-600 dark:text-gray-400 sm:col-span-2">
                          From Email
                        </label>
                        <div className="sm:col-span-3">
                          <input
                            className="mr-2 h-12 block w-full rounded-md border border-gray-200 bg-gray-100 p-2 px-3 py-1 text-sm leading-5 text-gray-700 focus:border-gray-200 focus:bg-white focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:focus:border-gray-500 dark:focus:bg-gray-700"
                            type="email"
                            name="from_email"
                            placeholder="Enter from email on custom invoice"
                          />
                        </div>
                      </div>
                    )}

                    {/* Shop name */}
                    <div className="mb-6 grid items-center gap-3 sm:grid-cols-12 md:grid-cols-5 md:gap-5 lg:gap-6 xl:gap-6">
                      <label className="mb-1 block text-sm font-semibold text-gray-600 dark:text-gray-400 sm:col-span-2">
                        Shop name
                      </label>
                      <div className="sm:col-span-3">
                        <input
                          className="mr-2 block h-12 w-full rounded-md border border-gray-200 bg-gray-100 p-2 px-3 py-1 text-sm leading-5 text-gray-700 focus:border-gray-200 focus:bg-white focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:focus:border-gray-500 dark:focus:bg-gray-700"
                          type="text"
                          name="shop_name"
                          placeholder="Shop name"
                          autoComplete="new-password"
                          defaultValue="KachaBazar"
                        />
                      </div>
                    </div>

                    {/* Company Name */}
                    <div className="mb-6 grid items-center gap-3 sm:grid-cols-12 md:grid-cols-5 md:gap-5 lg:gap-6 xl:gap-6">
                      <label className="mb-1 block text-sm font-semibold text-gray-600 dark:text-gray-400 sm:col-span-2">
                        Company Name
                      </label>
                      <div className="sm:col-span-3">
                        <input
                          className="mr-2 block h-12 w-full rounded-md border border-gray-200 bg-gray-100 p-2 px-3 py-1 text-sm leading-5 text-gray-700 focus:border-gray-200 focus:bg-white focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:focus:border-gray-500 dark:focus:bg-gray-700"
                          type="text"
                          name="company_name"
                          placeholder="Company Name"
                          autoComplete="new-password"
                          defaultValue="HtmlLover ltd"
                        />
                      </div>
                    </div>

                    {/* Vat Number */}
                    <div className="mb-6 grid items-center gap-3 sm:grid-cols-12 md:grid-cols-5 md:gap-5 lg:gap-6 xl:gap-6">
                      <label className="mb-1 block text-sm font-semibold text-gray-600 dark:text-gray-400 sm:col-span-2">
                        Vat Number
                      </label>
                      <div className="sm:col-span-3">
                        <input
                          className="mr-2 block h-12 w-full rounded-md border border-gray-200 bg-gray-100 p-2 px-3 py-1 text-sm leading-5 text-gray-700 focus:border-gray-200 focus:bg-white focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:focus:border-gray-500 dark:focus:bg-gray-700"
                          type="text"
                          name="vat_number"
                          placeholder="Vat Number"
                          autoComplete="new-password"
                          defaultValue="47589"
                        />
                      </div>
                    </div>

                    {/* Address */}
                    <div className="mb-6 grid items-center gap-3 sm:grid-cols-12 md:grid-cols-5 md:gap-5 lg:gap-6 xl:gap-6">
                      <label className="mb-1 block text-sm font-semibold text-gray-600 dark:text-gray-400 sm:col-span-2">
                        Address
                      </label>
                      <div className="sm:col-span-3">
                        <input
                          className="mr-2 block h-12 w-full rounded-md border border-gray-200 bg-gray-100 p-2 px-3 py-1 text-sm leading-5 text-gray-700 focus:border-gray-200 focus:bg-white focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:focus:border-gray-500 dark:focus:bg-gray-700"
                          type="text"
                          name="address"
                          placeholder="Address"
                          autoComplete="new-password"
                          defaultValue="59 Station Rd, Purls Bridge, United Kingdom"
                        />
                      </div>
                    </div>

                    {/* Post Code */}
                    <div className="mb-6 grid items-center gap-3 sm:grid-cols-12 md:grid-cols-5 md:gap-5 lg:gap-6 xl:gap-6">
                      <label className="mb-1 block text-sm font-semibold text-gray-600 dark:text-gray-400 sm:col-span-2">
                        Post Code
                      </label>
                      <div className="sm:col-span-3">
                        <input
                          className="mr-2 block h-12 w-full rounded-md border border-gray-200 bg-gray-100 p-2 px-3 py-1 text-sm leading-5 text-gray-700 focus:border-gray-200 focus:bg-white focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:focus:border-gray-500 dark:focus:bg-gray-700"
                          type="text"
                          name="post_code"
                          placeholder="Post Code"
                          autoComplete="new-password"
                          defaultValue="2030"
                        />
                      </div>
                    </div>

                    {/* Contact */}
                    <div className="mb-6 grid items-center gap-3 sm:grid-cols-12 md:grid-cols-5 md:gap-5 lg:gap-6 xl:gap-6">
                      <label className="mb-1 block text-sm font-semibold text-gray-600 dark:text-gray-400 sm:col-span-2">
                        Contact
                      </label>
                      <div className="sm:col-span-3">
                        <input
                          className="mr-2 block h-12 w-full rounded-md border border-gray-200 bg-gray-100 p-2 px-3 py-1 text-sm leading-5 text-gray-700 focus:border-gray-200 focus:bg-white focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:focus:border-gray-500 dark:focus:bg-gray-700"
                          type="text"
                          name="contact"
                          placeholder="Contact Number"
                          autoComplete="new-password"
                          defaultValue="019579034"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="mb-6 grid items-center gap-3 sm:grid-cols-12 md:grid-cols-5 md:gap-5 lg:gap-6 xl:gap-6">
                      <label className="mb-1 block text-sm font-semibold text-gray-600 dark:text-gray-400 sm:col-span-2">
                        Email
                      </label>
                      <div className="sm:col-span-3">
                        <input
                          className="mr-2 block h-12 w-full rounded-md border border-gray-200 bg-gray-100 p-2 px-3 py-1 text-sm leading-5 text-gray-700 focus:border-gray-200 focus:bg-white focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:focus:border-gray-500 dark:focus:bg-gray-700"
                          type="text"
                          name="email"
                          placeholder="Email"
                          autoComplete="new-password"
                          defaultValue="kachabazar@gmail.com"
                        />
                      </div>
                    </div>

                    {/* Web site */}
                    <div className="mb-6 grid items-center gap-3 sm:grid-cols-12 md:grid-cols-5 md:gap-5 lg:gap-6 xl:gap-6">
                      <label className="mb-1 block text-sm font-semibold text-gray-600 dark:text-gray-400 sm:col-span-2">
                        Web site
                      </label>
                      <div className="sm:col-span-3">
                        <input
                          className="mr-2 block h-12 w-full rounded-md border border-gray-200 bg-gray-100 p-2 px-3 py-1 text-sm leading-5 text-gray-700 focus:border-gray-200 focus:bg-white focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:focus:border-gray-500 dark:focus:bg-gray-700"
                          type="text"
                          name="website"
                          placeholder="Web Site"
                          autoComplete="new-password"
                          defaultValue="kachabazar-admin.vercel.app"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
