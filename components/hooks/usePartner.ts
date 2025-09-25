// components/hooks/usePartner.ts
import { useEffect, useState } from 'react';
import { getPartnerForChannel, type Partner } from '@/components/services/partnerService';
import { useAuthStore } from '@/components/stores/AuthStore';

export function usePartner(channel: { member_a: string; member_b: string } | null) {
  const user = useAuthStore(s => s.user);
  const [partner, setPartner] = useState<Partner | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!channel || !user?.id) return;
      const p = await getPartnerForChannel(channel, user.id);
      if (mounted) setPartner(p);
    })();
    return () => { mounted = false; };
  }, [channel?.member_a, channel?.member_b, user?.id]);

  return partner;
}