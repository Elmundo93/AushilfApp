import React, { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ChannelList } from 'stream-chat-expo';
import { useRouter } from 'expo-router';
import { ChannelSort, ChannelFilters, Channel } from 'stream-chat';
import ChannelPreview from '../../../components/Channel/ChannelPreview';
import { User } from '../../../components/types/auth';


const ChannelListScreen = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);





  const memoizedFilters = useMemo<ChannelFilters>(() => ({
    members: { $in: [user?.id || ''] },
    type: 'messaging',
  }), [user?.id]);

  const sort: ChannelSort = { last_updated: -1 };
  const options = {
    state: true,
    watch: true,
  };


  const handleSelectChannel = (channel: Channel) => {
    router.push(`/nachrichten/channel/${channel.cid}`);
  };

  return (
    <View style={styles.container}>
      
      <ChannelList
        filters={memoizedFilters}
        onSelect={handleSelectChannel}
        options={options}
        sort={sort}
        Preview={(props) => <ChannelPreview {...props} onSelect={handleSelectChannel} />}
      />
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
});

export default ChannelListScreen;