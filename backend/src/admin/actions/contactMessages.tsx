import type { useDispatch } from 'react-redux';

export const CONTACT_MESSAGE_UID = 'api::contact-message.contact-message';

export function PaperPlaneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 2 11 13" />
      <path d="M22 2 15 22l-4-9-9-4 20-7z" />
    </svg>
  );
}

// Strapi's fetch client throws with the response body on HTTP errors.
export function errorMessage(error: unknown): string {
  const e = error as { response?: { data?: { error?: { message?: string } } }; message?: string };
  return e?.response?.data?.error?.message || e?.message || 'Unknown error';
}

// Content Manager caches documents with RTK Query ("adminApi"); invalidating
// these tags refetches the list and the given documents so "sent" updates.
export function refreshContactMessages(dispatch: ReturnType<typeof useDispatch>, documentIds: string[]) {
  dispatch({
    type: 'adminApi/invalidateTags',
    payload: [
      { type: 'Document', id: `${CONTACT_MESSAGE_UID}_LIST` },
      ...documentIds.map((id) => ({ type: 'Document', id: `${CONTACT_MESSAGE_UID}_${id}` })),
    ],
  });
}
