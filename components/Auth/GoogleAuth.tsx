import * as Google from 'expo-auth-session/providers/google';
import React, { useEffect } from 'react';

export default function GoogleLogin() {
  const [request, response, promptAsync] = Google.useAuthRequest({
   clientId: '845724938702-b0ijrh45jd36becjv98ah1bfop6t3m61.apps.googleusercontent.com'
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      // Hier können Sie den Token weiterverarbeiten
      console.log(authentication);
    }
  }, [response]);

  return { promptAsync };
}