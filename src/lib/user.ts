const USER_ID_KEY = 'finance_tracker_user_id';

export function getUserId(): string {
  let userId = localStorage.getItem(USER_ID_KEY);

  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem(USER_ID_KEY, userId);
  }

  return userId;
}

export function clearUserId(): void {
  localStorage.removeItem(USER_ID_KEY);
}
