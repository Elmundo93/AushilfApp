export function parseCid(cid: string) {
                const [type, id] = String(cid).split(':');
                if (!type || !id) throw new Error(`Invalid CID: ${cid}`);
                return { type, id };
              }
              export function buildCid(channelId: string, type = 'direct') {
                return `${type}:${channelId}`;
              }