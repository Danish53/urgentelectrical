"use client";

import { useState } from "react";
import { formatIdealAddressLabel } from "@/lib/idealPostcodes/mapIdealAddress";
import {
  mapIdealAddressToCheckoutVariant,
  readCheckoutAddress,
  writeCheckoutAddress,
} from "@/lib/checkout/checkoutAddressFields";
import { fetchAddressesByPostcode } from "@/services/idealPostcodesApiService";
import ButtonSpinner from "@/components/ui/ButtonSpinner";

const labelClass = "home1-checkout-label";
const inputClass = "home1-checkout-input";

function IconSearch({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
    </svg>
  );
}

/**
 * @param {{
 *   details: Record<string, unknown>,
 *   onChange: (next: Record<string, unknown>) => void,
 *   variant?: import("@/lib/checkout/checkoutAddressFields").CheckoutAddressVariant,
 *   sectionTitle?: string,
 *   isLoggedIn?: boolean,
 *   onOpenSavedAddresses?: () => void,
 *   selectedSiteLabel?: string,
 *   onClearSavedSite?: () => void,
 * }} props
 */
export default function CheckoutAddressLookup({
  details,
  onChange,
  variant = "billing",
  sectionTitle = "Billing Address",
  isLoggedIn = false,
  onOpenSavedAddresses,
  selectedSiteLabel = "",
  onClearSavedSite,
}) {
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState("");
  const [lookupSuggestions, setLookupSuggestions] = useState([]);
  const [addressOptions, setAddressOptions] = useState([]);
  const [addressPicked, setAddressPicked] = useState(false);

  const idPrefix = variant === "site" ? "checkout-site" : "checkout-billing";
  const values = readCheckoutAddress(details, variant);
  const showAddressSelect = addressOptions.length > 0 && !addressPicked;
  const showSavedSearch = variant === "site" && isLoggedIn;

  function patchAddress(valuesPatch) {
    onChange(writeCheckoutAddress(details, variant, valuesPatch));
  }

  function resetLookup() {
    setLookupError("");
    setLookupSuggestions([]);
    setAddressOptions([]);
    setAddressPicked(false);
  }

  function handlePostcodeChange(value) {
    onClearSavedSite?.();
    resetLookup();
    patchAddress({
      postcode: value.toUpperCase(),
      address: "",
      addressLine2: "",
      city: "",
      county: "",
    });
  }

  async function handleFind() {
    const postcode = values.postcode.trim();
    if (!postcode) {
      setLookupError("Please enter a postcode.");
      return;
    }

    setLookupLoading(true);
    setLookupError("");
    setLookupSuggestions([]);
    setAddressOptions([]);
    setAddressPicked(false);

    try {
      const { addresses } = await fetchAddressesByPostcode(postcode);
      if (!addresses.length) {
        setLookupError("No addresses found for this postcode.");
        return;
      }
      setAddressOptions(addresses);
    } catch (err) {
      setLookupError(err instanceof Error ? err.message : "Could not find addresses.");
      if (err instanceof Error && "suggestions" in err && Array.isArray(err.suggestions)) {
        setLookupSuggestions(err.suggestions);
      }
    } finally {
      setLookupLoading(false);
    }
  }

  function handleSelectAddress(udprn) {
    if (!udprn) return;

    const match = addressOptions.find((item) => String(item.udprn ?? "") === udprn);
    if (!match) return;

    onClearSavedSite?.();
    const mapped = mapIdealAddressToCheckoutVariant(match, variant);
    onChange({ ...details, ...mapped });
    setAddressPicked(true);
    setAddressOptions([]);
  }

  return (
    <section className="home1-checkout-address-card home1-card">
      <header className="home1-checkout-address-card-head">
        <h3 className="home1-checkout-address-section-title">{sectionTitle}</h3>
        {showSavedSearch ? (
          <button
            type="button"
            className="home1-checkout-address-search-btn"
            onClick={onOpenSavedAddresses}
          >
            <IconSearch className="w-3.5 h-3.5" />
            Search saved addresses
          </button>
        ) : null}
      </header>

      {selectedSiteLabel ? (
        <p className="home1-checkout-address-selected" role="status">
          Using saved address: <strong>{selectedSiteLabel}</strong>
        </p>
      ) : null}

      <div className="home1-checkout-address-block">
        <div className="home1-checkout-form-grid ">
          <div>
            <label htmlFor={`${idPrefix}-country`} className={labelClass}>
              Country<span className="text-[#d3231f]">*</span>
            </label>
            <input
              id={`${idPrefix}-country`}
              value="United Kingdom (UK)"
              className={`${inputClass} home1-checkout-input--readonly`}
              readOnly
              tabIndex={-1}
              aria-readonly="true"
            />
          </div>
          <div>
            <label htmlFor={`${idPrefix}-postcode`} className={labelClass}>
              Post code<span className="text-[#d3231f]">*</span>
            </label>
            <div className="home1-checkout-postcode-row">
              <input
                id={`${idPrefix}-postcode`}
                value={values.postcode}
                onChange={(e) => handlePostcodeChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleFind();
                  }
                }}
                className={inputClass}
                autoComplete="postal-code"
                required
              />
              <button
                type="button"
                className="home1-checkout-postcode-find"
                onClick={handleFind}
                disabled={lookupLoading}
                aria-busy={lookupLoading}
              >
                {lookupLoading ? (
                  <>
                    <ButtonSpinner className="h-4 w-4 text-white" />
                    <span>Finding…</span>
                  </>
                ) : (
                  <>
                    <IconSearch />
                    <span>Find</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {lookupError ? (
          <p className="home1-checkout-address-lookup-error" role="alert">
            {lookupError}
            {lookupSuggestions.length ? (
              <span className="home1-checkout-address-lookup-suggestions">
                {" "}
                Did you mean:{" "}
                {lookupSuggestions.map((suggestion, index) => (
                  <button
                    key={suggestion}
                    type="button"
                    className="home1-checkout-address-suggestion"
                    onClick={() => {
                      handlePostcodeChange(suggestion);
                      setLookupError("");
                      setLookupSuggestions([]);
                    }}
                  >
                    {suggestion}
                    {index < lookupSuggestions.length - 1 ? ", " : ""}
                  </button>
                ))}
              </span>
            ) : null}
          </p>
        ) : null}

        {showAddressSelect ? (
          <div className="home1-checkout-address-select-wrap">
            <label htmlFor={`${idPrefix}-address-select`} className={labelClass}>
              Select address<span className="text-[#d3231f]">*</span>
            </label>
            <select
              id={`${idPrefix}-address-select`}
              className={`${inputClass} home1-checkout-address-select`}
              defaultValue=""
              onChange={(e) => handleSelectAddress(e.target.value)}
              required
            >
              <option value="" disabled>
                Select an address…
              </option>
              {addressOptions.map((address) => {
                const key = String(address.udprn ?? formatIdealAddressLabel(address));
                return (
                  <option key={key} value={String(address.udprn ?? "")}>
                    {formatIdealAddressLabel(address)}
                  </option>
                );
              })}
            </select>
          </div>
        ) : null}

        <div className="home1-checkout-form-grid">
          <div>
            <label htmlFor={`${idPrefix}-line-1`} className={labelClass}>
              Address line 1<span className="text-[#d3231f]">*</span>
            </label>
            <input
              id={`${idPrefix}-line-1`}
              value={values.address}
              onChange={(e) => {
                onClearSavedSite?.();
                patchAddress({ address: e.target.value });
              }}
              className={inputClass}
              autoComplete="address-line1"
              required
            />
          </div>
          <div>
            <label htmlFor={`${idPrefix}-line-2`} className={labelClass}>
              Address line 2
            </label>
            <input
              id={`${idPrefix}-line-2`}
              value={values.addressLine2}
              onChange={(e) => {
                onClearSavedSite?.();
                patchAddress({ addressLine2: e.target.value });
              }}
              className={inputClass}
              autoComplete="address-line2"
              placeholder="Flat / Suite"
            />
          </div>
        </div>

        <div className="home1-checkout-form-grid home1-checkout-form-grid--location">
          <div>
            <label htmlFor={`${idPrefix}-city`} className={labelClass}>
              Town / city
            </label>
            <input
              id={`${idPrefix}-city`}
              value={values.city}
              onChange={(e) => patchAddress({ city: e.target.value })}
              className={inputClass}
              autoComplete="address-level2"
            />
          </div>
          <div>
            <label htmlFor={`${idPrefix}-county`} className={labelClass}>
              County
            </label>
            <input
              id={`${idPrefix}-county`}
              value={values.county}
              onChange={(e) => patchAddress({ county: e.target.value })}
              className={inputClass}
              autoComplete="address-level1"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
