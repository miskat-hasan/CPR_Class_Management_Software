// src/hooks/useDefaultCountry.js
"use client";

import { useEffect } from "react";

export const DEFAULT_COUNTRY_NAME = "United States";

// Pulls the id of the default country out of the getAllCountry() payload
// (country list items look like { id, name }).
export const getDefaultCountryId = countryData => {
  const countries = countryData?.data ?? [];
  return countries.find(c => c?.name === DEFAULT_COUNTRY_NAME)?.id;
};

/**
 * Keeps a form's country field defaulted to "United States".
 *
 * Once the country list has loaded, the field is set to the United States id
 * whenever it currently has no value (initial render, form reset, etc.).
 *
 * @param {object} params
 * @param {object} params.form          react-hook-form instance (useForm())
 * @param {object} params.countryData   getAllCountry() query data
 * @param {boolean} params.countryLoading
 * @param {string}  [params.fieldName="country"] field to keep defaulted
 */
export const useDefaultCountry = ({
  form,
  countryData,
  countryLoading,
  fieldName = "country",
}) => {
  const usId = getDefaultCountryId(countryData);
  const currentValue = form.watch(fieldName);

  useEffect(() => {
    if (countryLoading || usId == null) return;
    if (currentValue === "" || currentValue == null) {
      form.setValue(fieldName, String(usId));
    }
  }, [form, fieldName, countryLoading, usId, currentValue]);
};
