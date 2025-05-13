//customMessage.tsx
import React, { useContext } from 'react';
import { MessageSimple } from 'stream-chat-expo';
import { FontSizeContext } from '@/components/provider/FontSizeContext';

const CustomMessage = (props: any) => {
  const { fontSize } = useContext(FontSizeContext);
  const defaultFontSize = 18;
  const componentBaseFontSize = 18;
  const maxFontSize = 28;


  const adjustedFontSize = (fontSize / defaultFontSize) * componentBaseFontSize;
  const finalFontSize = Math.min(adjustedFontSize, maxFontSize);

  return (
    <MessageSimple
      {...props}
      messageTextStyle={{ fontSize: 25 }}
    />
  );
};

export default CustomMessage;