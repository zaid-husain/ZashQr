import { useState, useEffect, useCallback } from 'react';
import type { BrandKit } from '../types/template';
import { getBrandKit, saveBrandKit, getDefaultBrandKit } from '../utils/storage';

export function useBrandKit() {
  const [brandKit, setBrandKitState] = useState<BrandKit>(() => getBrandKit());

  useEffect(() => {
    setBrandKitState(getBrandKit());
  }, []);

  const updateBrandKit = useCallback((updates: Partial<BrandKit>) => {
    setBrandKitState((prev) => {
      const next = { ...prev, ...updates };
      saveBrandKit(next);
      return next;
    });
  }, []);

  const resetBrandKit = useCallback(() => {
    const defaultKit = getDefaultBrandKit();
    setBrandKitState(defaultKit);
    saveBrandKit(defaultKit);
  }, []);

  return {
    brandKit,
    updateBrandKit,
    resetBrandKit
  };
}
