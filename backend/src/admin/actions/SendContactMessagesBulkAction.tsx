import { useDispatch } from 'react-redux';
import { useFetchClient, useNotification } from '@strapi/strapi/admin';
import { CONTACT_MESSAGE_UID, PaperPlaneIcon, errorMessage, refreshContactMessages } from './contactMessages';

const MAX_BULK = 50;

type BulkProps = {
  model: string;
  documents: { documentId?: string }[];
};

type BulkResponse = {
  data: { results: { documentId: string; sent: boolean; error?: string }[]; sentCount: number; failedCount: number };
};

const plural = (count: number, word: string) => `${count} ${word}${count === 1 ? '' : 's'}`;

/**
 * "Send emails" in the list view's bulk bar: sends the notification email for
 * every selected contact message after a confirmation, marks each delivered
 * one as sent, and reports how many were sent or failed (with the reasons).
 */
const SendContactMessagesBulkAction = ({ model, documents }: BulkProps) => {
  const { post } = useFetchClient();
  const { toggleNotification } = useNotification();
  const dispatch = useDispatch();

  if (model !== CONTACT_MESSAGE_UID) return null;
  const documentIds = documents.map((doc) => doc.documentId).filter((id): id is string => !!id);
  const count = documentIds.length;

  const send = async () => {
    try {
      const { data } = await post<BulkResponse>('/contact-message-delivery/send', { documentIds });
      const { sentCount, failedCount, results } = data.data;
      const reasons = [...new Set(results.filter((r) => !r.sent).map((r) => r.error || 'Unknown error'))].join(' · ');
      if (!failedCount) {
        toggleNotification({ type: 'success', message: `Sent ${plural(sentCount, 'email')}. ${sentCount === 1 ? 'The message is' : 'Those messages are'} now marked as sent.` });
      }
      else if (sentCount) {
        toggleNotification({ type: 'warning', title: `Sent ${sentCount} of ${count} emails`, message: `${plural(failedCount, 'message')} not sent: ${reasons}` });
      }
      else {
        toggleNotification({ type: 'danger', title: 'Emails not sent', message: reasons });
      }
      refreshContactMessages(dispatch, documentIds);
    }
    catch (error) {
      toggleNotification({ type: 'danger', title: 'Emails not sent', message: errorMessage(error) });
    }
  };

  return {
    label: 'Send emails',
    icon: <PaperPlaneIcon />,
    variant: 'secondary' as const,
    disabled: count === 0 || count > MAX_BULK,
    dialog: {
      type: 'dialog' as const,
      title: `Send ${plural(count, 'email')}?`,
      content: `This sends the notification email for ${count === 1 ? 'the selected message' : `the ${count} selected messages`} to the addresses in Contact settings, and marks each delivered message as sent.`,
      confirmLabel: 'Send',
      variant: 'default' as const,
      onConfirm: send,
    },
  };
};

export default SendContactMessagesBulkAction;
