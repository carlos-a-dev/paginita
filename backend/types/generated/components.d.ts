import type { Schema, Struct } from '@strapi/strapi';

export interface ComponentCarousel extends Struct.ComponentSchema {
  collectionName: 'components_component_carousels';
  info: {
    description: '';
    displayName: 'Carousel';
    icon: 'picture';
  };
  attributes: {
    animated: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    arrows: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    autoplay: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    class: Schema.Attribute.Text;
    images: Schema.Attribute.Media<'files' | 'images', true> &
      Schema.Attribute.Required;
    infinite: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    navigation: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    swipeable: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    thumbnails: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    vertical: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
  };
}

export interface HomeHero extends Struct.ComponentSchema {
  collectionName: 'components_home_heroes';
  info: {
    displayName: 'Hero';
  };
  attributes: {
    background: Schema.Attribute.Media<'images' | 'files'>;
    callToAction: Schema.Attribute.String;
    link: Schema.Attribute.String;
    message: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface HomeServices extends Struct.ComponentSchema {
  collectionName: 'components_home_services';
  info: {
    description: '';
    displayName: 'Services';
  };
  attributes: {
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedMedia extends Struct.ComponentSchema {
  collectionName: 'components_shared_media';
  info: {
    displayName: 'Media';
    icon: 'file-video';
  };
  attributes: {
    file: Schema.Attribute.Media<'images' | 'files' | 'videos'>;
  };
}

export interface SharedQuote extends Struct.ComponentSchema {
  collectionName: 'components_shared_quotes';
  info: {
    displayName: 'Quote';
    icon: 'indent';
  };
  attributes: {
    body: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface SharedRichText extends Struct.ComponentSchema {
  collectionName: 'components_shared_rich_texts';
  info: {
    description: '';
    displayName: 'Rich text';
    icon: 'align-justify';
  };
  attributes: {
    body: Schema.Attribute.RichText;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    description: '';
    displayName: 'Seo';
    icon: 'allergies';
    name: 'Seo';
  };
  attributes: {
    metaDescription: Schema.Attribute.Text & Schema.Attribute.Required;
    metaTitle: Schema.Attribute.String & Schema.Attribute.Required;
    shareImage: Schema.Attribute.Media<'images'>;
  };
}

export interface SharedSlider extends Struct.ComponentSchema {
  collectionName: 'components_shared_sliders';
  info: {
    description: '';
    displayName: 'Slider';
    icon: 'address-book';
  };
  attributes: {
    files: Schema.Attribute.Media<'images', true>;
  };
}

export interface SharedTheme extends Struct.ComponentSchema {
  collectionName: 'components_shared_themes';
  info: {
    displayName: 'Theme';
  };
  attributes: {
    accent: Schema.Attribute.String &
      Schema.Attribute.CustomField<'plugin::color-picker.color'>;
    dark: Schema.Attribute.String &
      Schema.Attribute.CustomField<'plugin::color-picker.color'>;
    darkPage: Schema.Attribute.String &
      Schema.Attribute.CustomField<'plugin::color-picker.color'>;
    info: Schema.Attribute.String &
      Schema.Attribute.CustomField<'plugin::color-picker.color'>;
    negative: Schema.Attribute.String &
      Schema.Attribute.CustomField<'plugin::color-picker.color'>;
    positive: Schema.Attribute.String &
      Schema.Attribute.CustomField<'plugin::color-picker.color'>;
    primary: Schema.Attribute.String &
      Schema.Attribute.CustomField<'plugin::color-picker.color'>;
    secondary: Schema.Attribute.String &
      Schema.Attribute.CustomField<'plugin::color-picker.color'>;
    warning: Schema.Attribute.String &
      Schema.Attribute.CustomField<'plugin::color-picker.color'>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'component.carousel': ComponentCarousel;
      'home.hero': HomeHero;
      'home.services': HomeServices;
      'shared.media': SharedMedia;
      'shared.quote': SharedQuote;
      'shared.rich-text': SharedRichText;
      'shared.seo': SharedSeo;
      'shared.slider': SharedSlider;
      'shared.theme': SharedTheme;
    }
  }
}
