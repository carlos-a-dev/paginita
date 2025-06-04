import type { Schema, Struct } from '@strapi/strapi';

export interface FHero extends Struct.ComponentSchema {
  collectionName: 'components_f_heroes';
  info: {
    displayName: 'Hero';
  };
  attributes: {
    background: Schema.Attribute.Media<'images'>;
    callToAction: Schema.Attribute.String;
    link: Schema.Attribute.String;
    message: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface FServiceList extends Struct.ComponentSchema {
  collectionName: 'components_f_service_lists';
  info: {
    displayName: 'ServiceList';
  };
  attributes: {
    lazy: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<false>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedNavLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_nav_links';
  info: {
    displayName: 'NavLink';
    icon: 'link';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    url: Schema.Attribute.String & Schema.Attribute.Required;
    visible: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<true>;
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

export interface SharedService extends Struct.ComponentSchema {
  collectionName: 'components_shared_services';
  info: {
    displayName: 'Service';
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    icon: Schema.Attribute.String &
      Schema.Attribute.CustomField<'plugin::material-symbols.icon'>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    visible: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<true>;
  };
}

export interface SharedSocialNetwork extends Struct.ComponentSchema {
  collectionName: 'components_shared_social_networks';
  info: {
    displayName: 'SocialNetwork';
    icon: 'twitter';
  };
  attributes: {
    icon: Schema.Attribute.String & Schema.Attribute.Required;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    url: Schema.Attribute.String & Schema.Attribute.Required;
    visible: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<true>;
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
      'f.hero': FHero;
      'f.service-list': FServiceList;
      'shared.nav-link': SharedNavLink;
      'shared.seo': SharedSeo;
      'shared.service': SharedService;
      'shared.social-network': SharedSocialNetwork;
      'shared.theme': SharedTheme;
    }
  }
}
