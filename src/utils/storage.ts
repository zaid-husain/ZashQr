import type { TemplateDocument, BrandKit } from '../types/template';

const MY_TEMPLATES_KEY = 'qr_my_templates_v1';
const FAVORITES_KEY = 'qr_favorite_templates_v1';
const RECENT_KEY = 'qr_recent_templates_v1';
const BRAND_KIT_KEY = 'qr_brand_kit_v1';
const EDITOR_DRAFT_KEY = 'qr_editor_draft_v1';

export const getMyTemplates = (): TemplateDocument[] => {
  try {
    const raw = localStorage.getItem(MY_TEMPLATES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to load my templates:', e);
    return [];
  }
};

export const saveMyTemplate = (template: TemplateDocument): TemplateDocument => {
  try {
    const templates = getMyTemplates();
    const existingIndex = templates.findIndex(t => t.id === template.id);
    const updated: TemplateDocument = {
      ...template,
      isCustom: true,
      updatedAt: Date.now()
    };

    let newTemplates: TemplateDocument[];
    if (existingIndex >= 0) {
      newTemplates = [...templates];
      newTemplates[existingIndex] = updated;
    } else {
      newTemplates = [updated, ...templates];
    }

    localStorage.setItem(MY_TEMPLATES_KEY, JSON.stringify(newTemplates));
    return updated;
  } catch (e) {
    console.error('Failed to save my template:', e);
    return template;
  }
};

export const deleteMyTemplate = (id: string): boolean => {
  try {
    const templates = getMyTemplates().filter(t => t.id !== id);
    localStorage.setItem(MY_TEMPLATES_KEY, JSON.stringify(templates));
    return true;
  } catch (e) {
    console.error('Failed to delete template:', e);
    return false;
  }
};

export const getFavoriteIds = (): string[] => {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const toggleFavoriteId = (id: string): boolean => {
  try {
    const favorites = new Set(getFavoriteIds());
    const isNowFavorite = !favorites.has(id);
    if (isNowFavorite) {
      favorites.add(id);
    } else {
      favorites.delete(id);
    }
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(Array.from(favorites)));
    return isNowFavorite;
  } catch (e) {
    console.error('Failed to toggle favorite:', e);
    return false;
  }
};

export const getRecentTemplateIds = (): string[] => {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const addRecentTemplateId = (id: string): void => {
  try {
    const recents = getRecentTemplateIds().filter(existing => existing !== id);
    recents.unshift(id);
    localStorage.setItem(RECENT_KEY, JSON.stringify(recents.slice(0, 20)));
  } catch (e) {
    console.error('Failed to update recent templates:', e);
  }
};

export const getDefaultBrandKit = (): BrandKit => ({
  id: 'default-brand-kit',
  name: 'My Brand',
  primaryColor: '#2563eb', // Modern indigo
  secondaryColor: '#0f172a', // Deep slate
  accentColor: '#f59e0b', // Amber
  textColor: '#0f172a',
  backgroundColor: '#ffffff',
  fontFamily: 'Inter',
  logoUrl: undefined
});

export const getBrandKit = (): BrandKit => {
  try {
    const raw = localStorage.getItem(BRAND_KIT_KEY);
    return raw ? JSON.parse(raw) : getDefaultBrandKit();
  } catch {
    return getDefaultBrandKit();
  }
};

export const saveBrandKit = (brandKit: BrandKit): void => {
  try {
    localStorage.setItem(BRAND_KIT_KEY, JSON.stringify(brandKit));
  } catch (e) {
    console.error('Failed to save brand kit:', e);
  }
};

export const getEditorDraft = (): TemplateDocument | null => {
  try {
    const raw = localStorage.getItem(EDITOR_DRAFT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const saveEditorDraft = (template: TemplateDocument): void => {
  try {
    localStorage.setItem(EDITOR_DRAFT_KEY, JSON.stringify(template));
  } catch (e) {
    console.error('Failed to save editor draft:', e);
  }
};

export const clearEditorDraft = (): void => {
  try {
    localStorage.removeItem(EDITOR_DRAFT_KEY);
  } catch (e) {
    console.error('Failed to clear editor draft:', e);
  }
};
