import { useState, useEffect, useCallback } from "react";
import { fetchRegions, fetchMunicipalities, fetchAvailableYears } from "../api/monitoring";

export function useFilters() {
  const [regions, setRegions] = useState([]);
  const [municipalities, setMunicipalities] = useState([]);
  const [availableYears, setAvailableYears] = useState([]);
  const [selectedRegionId, setSelectedRegionId] = useState(null);
  const [selectedMoId, setSelectedMoId] = useState(null);
  const [startYear, setStartYear] = useState(2020);
  const [endYear, setEndYear] = useState(2024);
  const [isLoadingFilters, setIsLoadingFilters] = useState(true);
  const [isLoadingMunicipalities, setIsLoadingMunicipalities] = useState(false);
  const [filterError, setFilterError] = useState(null);

  // Load regions and years once on mount
  useEffect(() => {
    let cancelled = false;
    setIsLoadingFilters(true);
    Promise.all([fetchRegions(), fetchAvailableYears()])
      .then(([regs, years]) => {
        if (cancelled) return;
        setRegions(regs);
        setAvailableYears(years);
        if (years.length > 0) {
          const last = years[years.length - 1];
          const secondLast = years.length > 4 ? years[years.length - 5] : years[0];
          setStartYear(secondLast);
          setEndYear(last);
        }
      })
      .catch((err) => {
        if (!cancelled) setFilterError(err.message);
      })
      .finally(() => {
        if (!cancelled) setIsLoadingFilters(false);
      });
    return () => { cancelled = true; };
  }, []);

  // Reload municipalities when region changes
  useEffect(() => {
    if (!selectedRegionId) {
      setMunicipalities([]);
      setSelectedMoId(null);
      return;
    }
    let cancelled = false;
    setIsLoadingMunicipalities(true);
    setSelectedMoId(null);
    fetchMunicipalities(selectedRegionId)
      .then((mos) => {
        if (cancelled) return;
        setMunicipalities(mos);
      })
      .catch((err) => {
        if (!cancelled) setFilterError(err.message);
      })
      .finally(() => {
        if (!cancelled) setIsLoadingMunicipalities(false);
      });
    return () => { cancelled = true; };
  }, [selectedRegionId]);

  const isYearRangeValid = startYear <= endYear;

  const handleRegionChange = useCallback((regionId) => {
    setSelectedRegionId(regionId ? Number(regionId) : null);
  }, []);

  const handleMoChange = useCallback((moId) => {
    setSelectedMoId(moId ? Number(moId) : null);
  }, []);

  return {
    regions,
    municipalities,
    availableYears,
    selectedRegionId,
    selectedMoId,
    startYear,
    endYear,
    isLoadingFilters,
    isLoadingMunicipalities,
    filterError,
    isYearRangeValid,
    setStartYear,
    setEndYear,
    handleRegionChange,
    handleMoChange,
  };
}
