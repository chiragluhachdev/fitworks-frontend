"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { MapPin, ChevronDown, X, Search, Check } from "lucide-react";

export interface LocationCity {
  city: string;
  count: number;
}

export interface LocationState {
  state: string;
  count: number;
  cities: LocationCity[];
}

export interface LocationSelection {
  state: string | null;
  city: string | null;
}

/**
 * Filter a list by state, then by city within it.
 *
 * Two linked menus rather than one long list: there are 20-odd states and 70-odd
 * cities, and a single city dropdown is a scroll through places you have no
 * interest in. Picking a state narrows the second menu to the cities that
 * actually have people in them.
 *
 * Counts sit against every option, because the useful question is usually
 * "where are they?" rather than "are there any in Nashik?".
 */
export default function LocationFilter({
  locations,
  value,
  onChange,
}: {
  locations: LocationState[];
  value: LocationSelection;
  onChange: (next: LocationSelection) => void;
}) {
  const [open, setOpen] = useState<null | "state" | "city">(null);
  const [query, setQuery] = useState("");
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(null);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    document.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Reset the search box each time a menu opens — a stale query makes the
  // list look empty for no visible reason.
  useEffect(() => {
    setQuery("");
  }, [open]);

  const selectedState = locations.find((s) => s.state === value.state) || null;

  /** With no state chosen, the city list is every city we know, flattened. */
  const cityOptions = useMemo(() => {
    if (selectedState) return selectedState.cities;
    const merged = new Map<string, number>();
    for (const s of locations) {
      for (const c of s.cities) merged.set(c.city, (merged.get(c.city) || 0) + c.count);
    }
    return Array.from(merged.entries())
      .map(([city, count]) => ({ city, count }))
      .sort((a, b) => b.count - a.count);
  }, [locations, selectedState]);

  const match = (text: string) => text.toLowerCase().includes(query.trim().toLowerCase());
  const visibleStates = locations.filter((s) => match(s.state));
  const visibleCities = cityOptions.filter((c) => match(c.city));

  const total = locations.reduce((sum, s) => sum + s.count, 0);
  const active = !!(value.state || value.city);

  const Trigger = ({
    kind,
    label,
    placeholder,
  }: {
    kind: "state" | "city";
    label: string | null;
    placeholder: string;
  }) => (
    <button
      type="button"
      onClick={() => setOpen(open === kind ? null : kind)}
      aria-expanded={open === kind}
      className={`inline-flex items-center gap-2 h-10 pl-3 pr-2.5 rounded-xl text-[13px] font-semibold whitespace-nowrap transition-colors cursor-pointer ring-1 ${
        label
          ? "bg-[#FFF1F2] text-[#E92E3D] ring-red-200"
          : "bg-white text-gray-600 ring-gray-200 hover:ring-gray-300"
      }`}
    >
      {kind === "state" && <MapPin className={`w-3.5 h-3.5 ${label ? "" : "text-gray-400"}`} />}
      {label || placeholder}
      <ChevronDown
        className={`w-3.5 h-3.5 shrink-0 transition-transform ${open === kind ? "rotate-180" : ""} ${
          label ? "" : "text-gray-400"
        }`}
      />
    </button>
  );

  const Menu = ({
    kind,
    options,
    allLabel,
    allCount,
    selected,
    onPick,
  }: {
    kind: "state" | "city";
    options: { label: string; count: number }[];
    allLabel: string;
    allCount: number;
    selected: string | null;
    onPick: (next: string | null) => void;
  }) =>
    open !== kind ? null : (
      <div className="absolute left-0 top-[46px] z-30 w-[268px] bg-white rounded-2xl ring-1 ring-gray-200/80 shadow-[0_20px_50px_-16px_rgba(16,24,40,0.28)] overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
        <div className="relative border-b border-gray-100">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${kind}s`}
            className="w-full h-11 pl-9 pr-3 text-[13px] text-gray-900 placeholder:text-gray-400 outline-none"
          />
        </div>

        <ul className="max-h-[288px] overflow-y-auto py-1.5">
          <li>
            <button
              onClick={() => {
                onPick(null);
                setOpen(null);
              }}
              className="w-full flex items-center justify-between gap-3 px-3.5 py-2 text-left hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <span className={`text-[13px] ${selected ? "text-gray-700" : "font-bold text-gray-900"}`}>
                {allLabel}
              </span>
              <span className="flex items-center gap-2 shrink-0">
                <span className="text-[11.5px] font-semibold text-gray-400 tabular-nums">{allCount}</span>
                {!selected && <Check className="w-3.5 h-3.5 text-[#E92E3D]" />}
              </span>
            </button>
          </li>

          {options.length === 0 && (
            <li className="px-3.5 py-6 text-center text-[12.5px] text-gray-400">
              Nothing matches “{query}”.
            </li>
          )}

          {options.map((o) => {
            const on = selected === o.label;
            return (
              <li key={o.label}>
                <button
                  onClick={() => {
                    onPick(o.label);
                    setOpen(null);
                  }}
                  className="w-full flex items-center justify-between gap-3 px-3.5 py-2 text-left hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <span
                    className={`text-[13px] truncate ${on ? "font-bold text-[#E92E3D]" : "text-gray-700"}`}
                  >
                    {o.label}
                  </span>
                  <span className="flex items-center gap-2 shrink-0">
                    <span className="text-[11.5px] font-semibold text-gray-400 tabular-nums">{o.count}</span>
                    {on && <Check className="w-3.5 h-3.5 text-[#E92E3D]" />}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    );

  return (
    <div ref={wrapRef} className="flex items-center gap-2 flex-wrap">
      <div className="relative">
        <Trigger kind="state" label={value.state} placeholder="All states" />
        <Menu
          kind="state"
          allLabel="All states"
          allCount={total}
          selected={value.state}
          options={visibleStates.map((s) => ({ label: s.state, count: s.count }))}
          // Changing state clears the city — a city from the old state would
          // filter everything out and look like a bug.
          onPick={(state) => onChange({ state, city: null })}
        />
      </div>

      <div className="relative">
        <Trigger
          kind="city"
          label={value.city}
          placeholder={selectedState ? `All of ${selectedState.state}` : "All cities"}
        />
        <Menu
          kind="city"
          allLabel={selectedState ? `All of ${selectedState.state}` : "All cities"}
          allCount={selectedState ? selectedState.count : total}
          selected={value.city}
          options={visibleCities.map((c) => ({ label: c.city, count: c.count }))}
          onPick={(city) => onChange({ ...value, city })}
        />
      </div>

      {active && (
        <button
          onClick={() => onChange({ state: null, city: null })}
          className="inline-flex items-center gap-1.5 h-10 px-3 rounded-xl text-[12.5px] font-bold text-gray-500 hover:text-[#E92E3D] hover:bg-[#FFF1F2] transition-colors cursor-pointer"
        >
          <X className="w-3.5 h-3.5" /> Clear
        </button>
      )}
    </div>
  );
}
