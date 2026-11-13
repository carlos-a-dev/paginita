import type { StrapiApp } from '@strapi/strapi/admin';
import SendContactMessageAction from './actions/SendContactMessageAction';

export default {
  config: {
    locales: [],
  },
  bootstrap(app: StrapiApp) {
    // "Send email" action on contact messages (edit view panel and list rows).
    const contentManager = app.getPlugin('content-manager') as unknown as {
      apis: { addDocumentAction: (actions: (current: unknown[]) => unknown[]) => void };
    };
    contentManager.apis.addDocumentAction((actions) => [...actions, SendContactMessageAction]);
  },
};
