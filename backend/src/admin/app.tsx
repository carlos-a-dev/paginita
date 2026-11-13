import type { StrapiApp } from '@strapi/strapi/admin';
import SendContactMessageAction from './actions/SendContactMessageAction';
import SendContactMessagesBulkAction from './actions/SendContactMessagesBulkAction';

export default {
  config: {
    locales: [],
  },
  bootstrap(app: StrapiApp) {
    // "Send email" action on contact messages (edit view panel and list rows).
    const contentManager = app.getPlugin('content-manager') as unknown as {
      apis: {
        addDocumentAction: (actions: (current: unknown[]) => unknown[]) => void;
        addBulkAction: (actions: (current: unknown[]) => unknown[]) => void;
      };
    };
    contentManager.apis.addDocumentAction((actions) => [...actions, SendContactMessageAction]);
    // "Send emails" for the selected rows in the contact messages list.
    contentManager.apis.addBulkAction((actions) => [...actions, SendContactMessagesBulkAction]);
  },
};
