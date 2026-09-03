import { initializeApp } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { getMessaging } from 'firebase-admin/messaging';
import { onDocumentCreated } from 'firebase-functions/v2/firestore';

initializeApp();

export const sendCustomerNotification = onDocumentCreated('notifications/{notificationId}', async (event) => {
  const notification = event.data?.data();
  if (!notification?.userUid) return;

  const userRef = getFirestore().collection('users').doc(notification.userUid);
  const userSnapshot = await userRef.get();
  const tokens = [...new Set((userSnapshot.data()?.fcmTokens || []).filter(Boolean))].slice(0, 500);
  if (!tokens.length) return;

  const title = String(notification.title || 'ZORRA');
  const body = String(notification.body || notification.message || 'You have a new update.');
  const response = await getMessaging().sendEachForMulticast({
    tokens,
    notification: { title, body },
    webpush: {
      fcmOptions: { link: String(notification.url || '/home.html') },
      notification: { tag: String(notification.type || 'zorra-order-update'), requireInteraction: false }
    },
    data: { url: String(notification.url || '/home.html'), notificationId: event.params.notificationId }
  });

  const invalidTokens = [];
  response.responses.forEach((result, index) => {
    const code = result.error?.code || '';
    if (code === 'messaging/registration-token-not-registered' || code === 'messaging/invalid-registration-token') invalidTokens.push(tokens[index]);
  });
  if (invalidTokens.length) await userRef.update({ fcmTokens: FieldValue.arrayRemove(...invalidTokens) });
  await event.data.ref.set({ pushSentAt: new Date().toISOString(), pushSuccessCount: response.successCount, pushFailureCount: response.failureCount }, { merge: true });
});
