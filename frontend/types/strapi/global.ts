import type { MediaImage } from './mediaImage';
import type { Seo } from './seo';

export type GlobalResponse = {
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
    quasarTheme: {
        primary: string;
        secondary: string;
        accent: string;
        dark: string;
        darkPage: string;
        positive: string;
        negative: string;
        info: string;
        warning: string;
    };
};