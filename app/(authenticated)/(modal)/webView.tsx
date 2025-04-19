import React from 'react';
import { WebView } from 'react-native-webview';
import { useAuthStore } from '@/components/stores/AuthStore';





export default function WebViewComponent() {

    const { user, isLoading: userLoading, error: userError } = useAuthStore();

      
      const fillFormScript = `
        document.getElementById('f72d3017e-212f-45b6-bb1f-ea3e0fd0a33dd396713fc-f83b-4e5c-88dd-c248805d22ad').value = '${user?.vorname}';
        document.getElementById('f72d3017e-212f-45b6-bb1f-ea3e0fd0a33ddf1b75fa1-e3f5-4bf7-b772-dc6e3dfaa07b').value = '${user?.nachname}';
        document.getElementById('f72d3017e-212f-45b6-bb1f-ea3e0fd0a33dd91fbb44d-9837-432e-98e6-559ad6d0ecbb').value = '${user?.straße}';
        document.getElementById('f72d3017e-212f-45b6-bb1f-ea3e0fd0a33dd7209969f-9740-4283-92cc-48588ac10cf3').value = '${user?.hausnummer}';
        document.getElementById('f72d3017e-212f-45b6-bb1f-ea3e0fd0a33ddbef4188c-0529-488c-b34c-e58fe5ec77f2').value = '${user?.plz}';
        document.getElementById('f72d3017e-212f-45b6-bb1f-ea3e0fd0a33dd539605f0-bb0c-4d14-b332-0fbcee27c1d6').value = '${user?.wohnort}';
        document.getElementById('f72d3017e-212f-45b6-bb1f-ea3e0fd0a33dd9e7fe719-00b9-4cbd-bad0-b703f5ba939b').value = '${user?.email}';
        document.getElementById('f72d3017e-212f-45b6-bb1f-ea3e0fd0a33ddd9b6cd8f-d1c2-43cf-93a8-f4a6fa9d72a0').value = '${user?.telefonnummer}';
        document.getElementById('f72d3017e-212f-45b6-bb1f-ea3e0fd0a33ddfa3d111e-f18a-4389-a795-cb138eec771c').value = '${user?.steuernummer}';
      `;
      
  return (
    <WebView
      source={{
        uri: 'https://www.minijob-zentrale.de/DE/service/formulare/haushaltshilfe-anmelden/_node.html',
      }}
      injectedJavaScript={fillFormScript}
      onMessage={(event) => console.log('Message from WebView:', event.nativeEvent.data)}
      style={{ flex: 1 }}
    />
  );
}
