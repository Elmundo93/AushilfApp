export function formatRelativeDate(ts?: number) {
                  if (!ts) return undefined;
                  const d = new Date(ts);
                  const today = new Date();
                  const isSameDay = d.toDateString() === today.toDateString();
                  if (isSameDay) return 'Heute';
                  const yesterday = new Date(today);
                  yesterday.setDate(today.getDate() - 1);
                  if (d.toDateString() === yesterday.toDateString()) return 'Gestern';
                  return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit' });
                }