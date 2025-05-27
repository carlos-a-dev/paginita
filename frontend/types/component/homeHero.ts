import type { MediaImage } from "../strapi/mediaImage";

export type HomeHeroProps = {
    __component: string;
    id: number;
    title: string;
    message: string;
    callToAction: string;
    link: string;
    background: MediaImage;
}