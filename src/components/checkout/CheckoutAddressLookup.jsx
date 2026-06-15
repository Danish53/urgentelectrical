"use client";

import { useState } from "react";
import {
  formatIdealAddressLabel,
  mapIdealAddressToCheckout,
} from "@/lib/idealPostcodes/mapIdealAddress";
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
 *   isLoggedIn?: boolean,
 *   onOpenSavedAddresses?: () => void,
 *   selectedSiteLabel?: string,
 *   onClearSavedSite?: () => void,
 * }} props
 */
export default function CheckoutAddressLookup({
  details,
  onChange,
  isLoggedIn = false,
  onOpenSavedAddresses,
  selectedSiteLabel = "",
  onClearSavedSite,
}) {
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState("");
  const [lookupSuggestions, setLookupSuggestions] = useState([]);
  /** @type {[Record<string, unknown>[], import("react").Dispatch<import("react").SetStateAction<Record<string, unknown>[]>>]} */
  const [addressOptions, setAddressOptions] = useState([]);
  const [addressPicked, setAddressPicked] = useState(false);

  const showAddressSelect = addressOptions.length > 0 && !addressPicked;

  function patch(fields) {
    onChange({ ...details, ...fields });
  }

  function setField(field, value) {
    patch({ [field]: value });
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
    patch({
      postcode: value.toUpperCase(),
      address: "",
      addressLine2: "",
      city: "",
      county: "",
    });
  }

  async function handleFind() {
    const postcode = String(details.postcode ?? "").trim();
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
    patch(mapIdealAddressToCheckout(match));
    setAddressPicked(true);
    setAddressOptions([]);
  }

  return (
    <div className="home1-checkout-address-block">
      {isLoggedIn ? (
        <div className="home1-checkout-address-head">
          <p className="home1-checkout-address-block-title"></p>
          <button
            type="button"
            className="home1-checkout-address-search-btn"
            onClick={onOpenSavedAddresses}
          >
            <IconSearch className="w-3.5 h-3.5" />
            Search saved addresses
          </button>
        </div>
      ) : null}

      {selectedSiteLabel ? (
        <p className="home1-checkout-address-selected" role="status">
          Using saved address: <strong>{selectedSiteLabel}</strong>
        </p>
      ) : null}

      <div className="home1-checkout-form-grid ">
        <div>
          <label htmlFor="checkout-country" className={labelClass}>
            Country<span className="text-[#d3231f]">*</span>
          </label>
          <input
            id="checkout-country"
            value="United Kingdom (UK)"
            className={`${inputClass} home1-checkout-input--readonly`}
            readOnly
            tabIndex={-1}
            aria-readonly="true"
          />
        </div>
        <div>
          <label htmlFor="checkout-postcode" className={labelClass}>
            Post code<span className="text-[#d3231f]">*</span>
          </label>
          <div className="home1-checkout-postcode-row">
            <input
              id="checkout-postcode"
              value={String(details.postcode ?? "")}
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
          <label htmlFor="checkout-address-select" className={labelClass}>
            Select address<span className="text-[#d3231f]">*</span>
          </label>
          <select
            id="checkout-address-select"
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
          <label htmlFor="checkout-address-line-1" className={labelClass}>
            Address line 1<span className="text-[#d3231f]">*</span>
          </label>
          <input
            id="checkout-address-line-1"
            value={String(details.address ?? "")}
            onChange={(e) => {
              onClearSavedSite?.();
              setField("address", e.target.value);
            }}
            className={inputClass}
            autoComplete="address-line1"
            required
          />
        </div>
        <div>
          <label htmlFor="checkout-address-line-2" className={labelClass}>
            Address line 2
          </label>
          <input
            id="checkout-address-line-2"
            value={String(details.addressLine2 ?? "")}
            onChange={(e) => {
              onClearSavedSite?.();
              setField("addressLine2", e.target.value);
            }}
            className={inputClass}
            autoComplete="address-line2"
            placeholder="Flat / Suite"
          />
        </div>
      </div>

      <div className="home1-checkout-form-grid home1-checkout-form-grid--location">
        <div>
          <label htmlFor="checkout-city" className={labelClass}>
            Town / city
          </label>
          <input
            id="checkout-city"
            value={String(details.city ?? "")}
            onChange={(e) => setField("city", e.target.value)}
            className={inputClass}
            autoComplete="address-level2"
          />
        </div>
        <div>
          <label htmlFor="checkout-county" className={labelClass}>
            County
          </label>
          <input
            id="checkout-county"
            value={String(details.county ?? "")}
            onChange={(e) => setField("county", e.target.value)}
            className={inputClass}
            autoComplete="address-level1"
          />
        </div>
      </div>
    </div>
  );
}
