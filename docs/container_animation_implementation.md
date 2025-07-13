# Container Animation Implementation Guide

## Übersicht

Die Container-Animation wurde in das `OnboardingLayout` integriert und kann in allen Onboarding-Schritten verwendet werden. Dies sorgt für eine konsistente und professionelle Benutzererfahrung.

## 🎯 **Implementierungsoptionen**

### **Option 1: Automatische Animation (Empfohlen)**
Das `OnboardingLayout` hat bereits die Animation integriert. Alle Schritte verwenden automatisch die Container-Animation.

```tsx
<OnboardingLayout
  currentStep={currentStep}
  steps={steps}
  headerTitle="Dein Titel"
  backRoute={'/previous-step'}
>
  {/* Dein Content wird automatisch animiert */}
  <View style={styles.content}>
    {/* ... */}
  </View>
</OnboardingLayout>
```

### **Option 2: AnimatedContainer für spezielle Effekte**
Für zusätzliche Animationen in einzelnen Komponenten:

```tsx
import { AnimatedContainer } from '@/components/Animation/AnimatedContainer';

<AnimatedContainer 
  delay={200}
  duration={800}
  scale={0.9}
>
  <BlurView style={styles.formCard}>
    {/* Dein Content */}
  </BlurView>
</AnimatedContainer>
```

### **Option 3: useContainerAnimation Hook**
Für vollständige Kontrolle über Animationen:

```tsx
import { useContainerAnimation } from '@/components/hooks/useContainerAnimation';

const { animatedStyle } = useContainerAnimation({
  enabled: true,
  delay: 100,
  duration: 600,
  scale: 0.95,
  translateY: 20,
});

<Animated.View style={[styles.container, animatedStyle]}>
  {/* Dein Content */}
</Animated.View>
```

## 🚀 **Schnellstart für neue Onboarding-Schritte**

### **1. Standard-Implementation:**
```tsx
import React from 'react';
import { View } from 'react-native';
import { OnboardingLayout } from '@/components/Onboarding/OnboardingLayout';

export default function NewOnboardingStep() {
  const steps = ['intro', 'userinfo', 'userinfo2', 'intent', 'about', 'profileImage', 'password', 'conclusion'];
  const currentStep = steps.findIndex((step) => pathname.includes(step));

  return (
    <OnboardingLayout
      currentStep={currentStep}
      steps={steps}
      headerTitle="Dein Titel"
      backRoute={'/previous-step'}
    >
      {/* Dein Content - wird automatisch animiert */}
      <View style={styles.content}>
        {/* ... */}
      </View>
    </OnboardingLayout>
  );
}
```

### **2. Mit zusätzlicher Container-Animation:**
```tsx
import { AnimatedContainer } from '@/components/Animation/AnimatedContainer';

<OnboardingLayout>
  <AnimatedContainer delay={300} duration={1000}>
    <BlurView style={styles.formCard}>
      {/* Dein Content */}
    </BlurView>
  </AnimatedContainer>
</OnboardingLayout>
```

## 🎨 **Animation-Timeline**

1. **0ms:** Container startet mit Opacity 0, Scale 0.95
2. **0ms:** Container-Animation beginnt sofort (600ms duration)
3. **100ms:** Content-Animation beginnt (Header + Children, 600ms duration)
4. **700ms:** Alle Animationen abgeschlossen

## ⚙️ **Konfigurationsoptionen**

### **OnboardingLayout Props:**
- `enableContainerAnimation?: boolean` - Aktiviert/Deaktiviert Animation (Standard: true)

### **AnimatedContainer Props:**
- `enabled?: boolean` - Aktiviert/Deaktiviert Animation
- `delay?: number` - Verzögerung in ms (Standard: 0)
- `duration?: number` - Dauer in ms (Standard: 600)
- `scale?: number` - Start-Scale (Standard: 0.95)
- `translateY?: number` - Start-Y-Position (Standard: 20)

### **useContainerAnimation Hook:**
```tsx
const { animatedStyle, opacity, scale, translateY } = useContainerAnimation({
  enabled: true,
  delay: 0,
  duration: 600,
  scale: 0.95,
  translateY: 20,
});
```

## 📱 **Performance-Optimierungen**

- ✅ `useNativeDriver: true` für alle Animationen
- ✅ `useRef` für Animation-Werte
- ✅ Keine Animationen bei `enabled: false`
- ✅ Optimierte Timing-Funktionen

## 🔧 **Troubleshooting**

### **Animation funktioniert nicht:**
1. Prüfe `enableContainerAnimation` Prop
2. Stelle sicher, dass `OnboardingLayout` verwendet wird
3. Prüfe Console für Fehler

### **Animation zu schnell/langsam:**
- Passe `delay` und `duration` Props an
- Verwende `useContainerAnimation` für vollständige Kontrolle

### **Performance-Probleme:**
- Reduziere Anzahl gleichzeitiger Animationen
- Verwende `enabled: false` bei komplexen Layouts
- Prüfe `useNativeDriver: true`

## 📋 **Checkliste für neue Schritte**

- [ ] `OnboardingLayout` verwenden
- [ ] Korrekte `currentStep` und `steps` Array
- [ ] `backRoute` definieren
- [ ] `headerTitle` setzen
- [ ] Optional: `AnimatedContainer` für zusätzliche Effekte
- [ ] Performance testen
- [ ] Animation-Timing anpassen falls nötig

## 🎯 **Best Practices**

1. **Konsistenz:** Verwende immer `OnboardingLayout`
2. **Performance:** Minimale zusätzliche Animationen
3. **UX:** Smooth, nicht zu schnell oder langsam
4. **Wartbarkeit:** Verwende die vorgefertigten Komponenten
5. **Testing:** Teste auf verschiedenen Geräten 