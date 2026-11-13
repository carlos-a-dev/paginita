import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useFetchClient, useNotification } from '@strapi/strapi/admin';
import { CONTACT_MESSAGE_UID, PaperPlaneIcon, errorMessage, refreshContactMessages } from './contactMessages';

const UID = CONTACT_MESSAGE_UID;

type ActionProps = {
  model: string;
  documentId?: string;
  document?: { sent?: boolean | null } | null;
};

/**
 * "Send email" for contact messages: sends the notification email again
 * (e.g. after a delivery failure) and marks the message as sent. Shown in the
 * edit view's side panel and in each row's menu in the list view.
 */
const SendContactMessageAction = ({ model, documentId, document }: ActionProps) => {
  const { post } = useFetchClient();
  const { toggleNotification } = useNotification();
  const dispatch = useDispatch();
  const [sending, setSending] = useState(false);

  if (model !== UID || !documentId) return null;

  return {
    label: document?.sent ? 'Resend email' : 'Send email',
    icon: <PaperPlaneIcon />,
    position: ['panel', 'table-row'] as ('panel' | 'table-row')[],
    disabled: sending,
    loading: sending,
    onClick: async () => {
      setSending(true);
      try {
        await post(`/contact-message-delivery/${documentId}/send`);
        toggleNotification({ type: 'success', message: 'Email sent. The message is now marked as sent.' });
        refreshContactMessages(dispatch, [documentId]);
        return true;
      } catch (error) {
        toggleNotification({ type: 'danger', title: 'Email not sent', message: errorMessage(error) });
        return false;
      } finally {
        setSending(false);
      }
    },
  };
};

SendContactMessageAction.position = ['panel', 'table-row'] as ('panel' | 'table-row')[];

export default SendContactMessageAction;
