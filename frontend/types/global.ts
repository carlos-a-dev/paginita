import type { MediaImage } from './mediaImage';
import type { Seo } from './seo';

export type Global = {
    id: number;
    documentId: string;
    siteName: string;
    siteDescription: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    favicon: MediaImage;
    defaultSeo: Seo;
    siteLogo: MediaImage;
};