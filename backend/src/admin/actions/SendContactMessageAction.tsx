import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useFetchClient, useNotification } from '@strapi/strapi/admin';

const UID = 'api::contact-message.contact-message';

type ActionProps = {
  model: string;
  documentId?: string;
  document?: { sent?: boolean | null } | null;
};

function PaperPlaneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 2 11 13" />
      <path d="M22 2 15 22l-4-9-9-4 20-7z" />
    </svg>
  );
}

// Strapi's fetch client throws with the response body on HTTP errors.
function errorMessage(error: unknown): string {
  const e = error as { response?: { data?: { error?: { message?: string } } }; message?: string };
  return e?.response?.data?.error?.message || e?.message || 'Unknown error';
}

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
        // Refresh this message and the list so "sent" shows the new value.
        dispatch({
          type: 'adminApi/invalidateTags',
          payload: [
            { type: 'Document', id: `${UID}_${documentId}` },
            { type: 'Document', id: `${UID}_LIST` },
          ],
        });
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
