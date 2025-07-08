# 🚀 AushilfApp - Comprehensive Project Index

## 📋 Quick Reference

### **Project Overview**
- **Purpose:** Mobile app for neighborhood help coordination (help offering/seeking)
- **Target Users:** Elderly, students, helpers with limited digital experience
- **Focus:** Accessibility, daily utility, simple mediation
- **Status:** Production-ready build in progress
- **Current Phase:** getStream integration finalization

### **Tech Stack**
```
Frontend:    React Native + Expo (v51)
State:       Zustand
Routing:     Expo Router (file-based)
Database:    SQLite (local) + Supabase PostgreSQL (cloud)
Auth:        Supabase Auth + OAuth (Google/Apple)
Chat:        getStream.io (v1) - Production Ready
Payments:    Stripe integration
Offline:     SQLite with sync layer
Deployment:  EAS Build + App Store/Play Store
```

---

## 🏗️ Architecture Patterns

### **Directory Structure**
```
aushilfApp/
├── app/                          # Expo Router pages
│   ├── (authenticated)/         # Protected routes
│   │   ├── (aushilfapp)/       # Main app routes
│   │   │   ├── pinnwand/       # Posts/help board
│   │   │   ├── nachrichten/    # Chat functionality
│   │   │   └── anmeldung/      # Registration
│   │   └── (modal)/            # Modal screens
│   ├── (public)/               # Public routes
│   │   └── (onboarding)/       # User onboarding flow
│   └── auth/                   # Auth callbacks
├── components/                  # Reusable components
│   ├── stores/                 # Zustand state management
│   ├── services/               # Business logic & API calls
│   │   ├── StreamChat/         # getStream integration
│   │   ├── Storage/            # SQLite operations
│   │   ├── Auth/               # Authentication services
│   │   └── Chat/               # Chat functionality
│   ├── types/                  # TypeScript definitions
│   ├── provider/               # React Context providers
│   ├── Auth/                   # Authentication components
│   ├── Chat/                   # Chat functionality
│   ├── Pinnwand/               # Posts/help board
│   ├── Profile/                # User profiles
│   ├── Location/               # Location services
│   ├── Header/                 # Header components
│   ├── Animation/              # Animation components
│   ├── Nachrichten/            # Messaging components
│   ├── PostDetails/            # Post detail views
│   ├── Crud/                   # CRUD operations
│   │   └── SQLite/             # Local database operations
│   ├── hooks/                  # Custom React hooks
│   ├── utils/                  # Utility functions
│   └── lib/                    # Pure helper functions
├── supabase/                   # Backend configuration
│   ├── functions/              # Edge functions
│   │   ├── getStreamTokens/    # getStream token generation
│   │   ├── chatDelete/         # Chat deletion
│   │   ├── userBlock/          # User blocking
│   │   ├── userMute/           # User muting
│   │   └── stripeWebhook/      # Payment processing
│   └── migrations/             # Database migrations
├── assets/                     # Static assets
│   ├── images/                 # Image assets
│   ├── fonts/                  # Font files
│   └── animations/             # Lottie animations
├── constants/                  # App constants
└── docs/                       # Documentation
    └── ai/                     # AI-specific documentation
```

---

## 💬 getStream Chat Implementation (Production Ready)

### **Core getStream Services**
```typescript
// components/services/StreamChat/
- StreamChatService.ts          # Main chat service
- chatService.ts                # Chat operations (block, mute, etc.)
- useChannels.ts                # Channel management hook
- lib/extractPartnerData.ts     # Partner data extraction
```

### **getStream Architecture**

#### **Channel Creation & Management**
```typescript
// Unique channel ID generation using cyrb53 hash
const channelId = cyrb53([currentUser.id, postDetails.userId].sort().join('-'));

// Channel metadata structure
const metadata = {
  custom_post_option: post.option,
  custom_post_category: post.category,
  custom_post_id: post.id,
  custom_post_user_id: post.userId,
  custom_post_vorname: post.vorname,
  custom_post_nachname: post.nachname,
  custom_post_profileImage: post.profileImageUrl,
  custom_post_userBio: post.userBio,
  custom_user_vorname: user.vorname,
  custom_user_nachname: user.nachname,
  custom_user_profileImage: user.profileImageUrl,
  custom_user_userBio: user.bio,
  custom_user_id: user.id,
};
```

#### **Initial Message System**
```typescript
// Automatic initial message creation
const initialText = formatInitialMessage(postDetails);
const initialMessageExists = messages.some(msg => msg.text === initialText);

if (!initialMessageExists) {
  await channel.sendMessage({
    text: initialText,
    user_id: currentUser.id,
    custom_type: 'initial',
    ...metadata,
    initial: true,
  });
}
```

#### **Real-time Event Handling**
```typescript
// Event types handled
- channel.created
- channel.updated
- channel.deleted
- message.new

// Automatic channel reordering on new messages
updatedAllChannels = updatedAllChannels.filter(channel => channel.cid !== eventChannel.cid);
updatedAllChannels = [eventChannel, ...updatedAllChannels];
```

### **getStream Token Management**
```typescript
// Supabase Edge Function: getStreamTokens
- JWT verification with Supabase
- HMAC-SHA256 token generation
- User-specific token creation
- Secure token distribution
```

### **Chat Operations (Production Ready)**
```typescript
// Available operations in chatService.ts
- deleteChannel()              # Delete chat channel
- blockUser()                  # Block user
- unblockUser()               # Unblock user
- getBlockedUsers()           # List blocked users
- muteUser()                  # Mute user
- unmuteUser()                # Unmute user
- getMutedUsers()             # List muted users
```

---

## 🔧 Core Components & Patterns

### **State Management (Zustand Stores)**
```typescript
// Key stores in components/stores/
- AuthStore.ts              # Authentication state + getStream client
- useStreamChatStore.ts     # Chat channels (getStream)
- useActiveChatStore.ts     # Active chat messages (getStream)
- useMuteStore.ts          # Mute functionality
- postStore.ts             # Posts data
- locationStore.ts         # Location data
- OnboardingContext.ts     # Onboarding flow
- selectedUserStore.ts     # Selected user data
- danksagungStores.ts      # Thank you messages
```

### **Service Layer Architecture**
```typescript
// Business logic in components/services/
- StreamChat/              # getStream integration (Production Ready)
  ├── StreamChatService.ts # Main chat service
  ├── chatService.ts       # Chat operations
  ├── useChannels.ts       # Channel management
  └── lib/                 # Helper functions
- Storage/                 # SQLite operations
- Auth/                    # Authentication services
- Chat/                    # Legacy chat functionality
- PushNotifications/       # Push notification handling
- stripe/                  # Payment processing
- token/                   # Token management
```

### **Type Definitions**
```typescript
// Core types in components/types/
- auth.ts                  # Authentication types
- stream.ts                # getStream/Chat types
- post.ts                  # Post types
- chat.ts                  # Chat types
- location.ts              # Location types
- components.ts            # Component props
- Danksagungen.ts          # Thank you types
- checkbox.ts              # Checkbox types
```

---

## 🗄️ Database Schema

### **SQLite Tables (Local)**
```sql
-- Core tables in components/Crud/SQLite/
- channels_fetched         # getStream channels
- messages_fetched         # getStream messages
- posts_fetched           # Posts/help offers
- users_fetched           # User data
- danksagungen_fetched    # Thank you messages
```

### **Supabase Tables (Cloud)**
```sql
-- Remote database structure
- users                    # User profiles
- posts                    # Help posts
- channels                 # Chat channels (legacy)
- messages                 # Chat messages (legacy)
- danksagungen             # Thank you messages
```

---

## 🔐 Authentication Flow

### **OAuth Providers**
- Google OAuth
- Apple Sign-In
- Email/Password

### **Token Management**
- Supabase Access/Refresh tokens
- getStream tokens (via Edge Function)
- Secure storage via expo-secure-store

### **getStream Authentication**
```typescript
// Token generation flow
1. User authenticates with Supabase
2. App requests getStream token from Edge Function
3. Edge Function verifies JWT with Supabase
4. Edge Function generates getStream token
5. App initializes getStream client with token
```

---

## 💬 Chat Architecture (Production Ready)

### **getStream Implementation**
```typescript
// Chat components in components/Chat/
- ChatScreen.tsx           # Main chat interface
- ChatList.tsx             # Channel list
- ChatRoom.tsx             # Individual chat
- MessageBubble.tsx        # Message display
- ChatInput.tsx            # Message input
- NachrichtenMenu.tsx      # Chat menu options
```

### **Sync Strategy**
```typescript
// Sync services in components/services/Storage/
- useChannelSync           # Channel synchronization
- useMessageSync           # Message synchronization
- useChatListeners         # Real-time listeners
- useChatLifecycle         # Lifecycle management
```

### **Production Features**
- **Real-time messaging** with getStream
- **Message read receipts**
- **User blocking/muting**
- **Channel deletion**
- **Offline message queuing**
- **Push notifications**
- **Message persistence**

---

## 📱 Key Features

### **Core Functionality**
1. **Pinnwand (Posts)** - Location-based help posts
2. **Chat System** - 1:1 messaging with getStream (Production Ready)
3. **User Profiles** - Profile management
4. **Location Services** - GPS-based filtering
5. **Onboarding** - Multi-step user setup
6. **Offline Support** - SQLite local storage
7. **Push Notifications** - Real-time alerts
8. **Stripe Integration** - Payment processing

### **Categories**
- Garten (Garden)
- Haushalt (Household)
- Bildung (Education)
- Gastro (Gastronomy)
- Soziales (Social)
- Handwerk (Crafts)

---

## 🚀 Production Deployment

### **Build Configuration (eas.json)**
```json
{
  "development": {
    "developmentClient": true,
    "distribution": "internal"
  },
  "preview": {
    "distribution": "internal"
  },
  "production": {
    "distribution": "store"
  }
}
```

### **Environment Variables**
```typescript
// Development
ENVIRONMENT: "development"
SUPABASE_FUNCTIONS_URL: "https://rorjehxddmuelbakcyqo.functions.supabase.co"
STRIPE_PUBLISHABLE_KEY: "pk_test_..."

// Production
ENVIRONMENT: "production"
SUPABASE_FUNCTIONS_URL: "https://rorjehxddmuelbakcyqo.functions.supabase.co"
STRIPE_PUBLISHABLE_KEY: "pk_live_..."
```

### **Deployment Pipeline**
1. **Development** - Local testing with development client
2. **Preview** - Internal distribution for testing
3. **Production** - App Store/Play Store distribution

### **Supabase Edge Functions (Production Ready)**
```typescript
// Active functions in supabase/functions/
- getStreamTokens/          # getStream token generation
- chatDelete/              # Chat deletion
- userBlock/               # User blocking
- userUnblock/             # User unblocking
- userMute/                # User muting
- userUnmute/              # User unmuting
- listBannedUsers/         # List blocked users
- listMutedUsers/          # List muted users
- createStripeSession/     # Payment session creation
- stripeWebhook/           # Payment webhook handling
```

---

## 🛠️ Development Patterns

### **Component Structure**
```typescript
// Standard component pattern
const ComponentName: React.FC<Props> = ({ prop1, prop2 }) => {
  // Hooks
  const { state } = useStore();
  
  // Effects
  useEffect(() => {
    // Side effects
  }, []);
  
  // Handlers
  const handleAction = () => {
    // Action logic
  };
  
  // Render
  return (
    <View>
      {/* JSX */}
    </View>
  );
};
```

### **Store Pattern (Zustand)**
```typescript
// Standard store pattern
interface StoreState {
  data: any[];
  loading: boolean;
  error: string | null;
  actions: {
    setData: (data: any[]) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
  };
}

const useStore = create<StoreState>((set) => ({
  data: [],
  loading: false,
  error: null,
  actions: {
    setData: (data) => set({ data }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
  },
}));
```

### **Service Pattern**
```typescript
// Standard service pattern
export class ServiceName {
  static async methodName(params: any): Promise<any> {
    try {
      // Implementation
      return result;
    } catch (error) {
      console.error('Service error:', error);
      throw error;
    }
  }
}
```

---

## 🚨 Common Issues & Solutions

### **getStream Specific Issues**
- **Token expiration:** Automatic token refresh via Edge Function
- **Connection drops:** Automatic reconnection handling
- **Message sync:** Real-time event listeners
- **Channel ordering:** Automatic reordering on new messages

### **TypeScript Errors**
- **Missing props:** Check component prop interfaces
- **Type mismatches:** Verify type definitions in `components/types/`
- **Import errors:** Ensure correct import paths with `@/` alias

### **State Management**
- **Race conditions:** Use SQLite transactions with mutex
- **Sync issues:** Check `useChannelSync` and `useMessageSync`
- **Memory leaks:** Proper cleanup in useEffect

### **Performance**
- **FlatList optimization:** Use `getItemLayout` and `keyExtractor`
- **Image loading:** Implement lazy loading and caching
- **Memory management:** Clean up listeners and subscriptions

---

## 📚 Key Files Reference

### **Configuration Files**
- `app.config.js` - Expo configuration
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `supabase/config.toml` - Supabase configuration
- `eas.json` - EAS Build configuration

### **Entry Points**
- `app/_layout.tsx` - Root layout
- `app/(authenticated)/_layout.tsx` - Protected layout
- `app/(public)/_layout.tsx` - Public layout

### **Core Providers**
- `components/provider/AuthProvider.tsx` - Authentication context
- `components/provider/ChatProvider.tsx` - Chat context
- `components/provider/SQLiteProviderWrapper.tsx` - Database context

### **getStream Core Files**
- `components/services/StreamChat/StreamChatService.ts` - Main chat service
- `components/services/StreamChat/chatService.ts` - Chat operations
- `components/services/StreamChat/useChannels.ts` - Channel management
- `supabase/functions/getStreamTokens/index.ts` - Token generation

---

## 🎯 Development Workflow

### **Adding New Features**
1. **Define types** in `components/types/`
2. **Create store** in `components/stores/`
3. **Implement service** in `components/services/`
4. **Build components** in appropriate feature directory
5. **Add routes** in `app/` directory
6. **Update documentation** in `docs/ai/`

### **Database Changes**
1. **Update SQLite schema** in `components/Crud/SQLite/DBSetup/`
2. **Create Supabase migration** in `supabase/migrations/`
3. **Update type definitions** in `components/types/`
4. **Test sync functionality**

### **getStream Integration**
1. **Update channel metadata** in `StreamChatService.ts`
2. **Add new operations** in `chatService.ts`
3. **Update event handlers** in `useChannels.ts`
4. **Test real-time functionality**

### **Testing Strategy**
- **Unit tests:** Jest with `__tests__/` directories
- **Integration tests:** Test service layer
- **E2E tests:** Test complete user flows
- **getStream tests:** Test real-time messaging

---

## 🔍 Quick Debugging

### **Common Debug Points**
- **Chat issues:** Check `useStreamChatStore` and `useActiveChatStore`
- **Auth issues:** Verify `AuthStore` and Supabase tokens
- **getStream issues:** Check token generation and client initialization
- **Sync issues:** Check SQLite transactions and network status
- **UI issues:** Verify component props and styling

### **getStream Debugging**
```typescript
// Check client initialization
const client = useAuthStore.getState().streamChatClient;
console.log('Client status:', client?.userID);

// Check channel events
client?.on('message.new', (event) => {
  console.log('New message:', event);
});

// Check token validity
const token = await SecureStore.getItemAsync('streamToken');
console.log('Token exists:', !!token);
```

### **Logging Strategy**
- **Console logs:** Use structured logging
- **Error boundaries:** Catch and log errors
- **Performance monitoring:** Track key metrics
- **getStream events:** Monitor real-time events

---

## 📖 Documentation Structure

### **AI Documentation (`docs/ai/`)**
- `README.md` - Project overview
- `app_overview.md` - Application architecture
- `chat_architecture.md` - Chat system design
- `auth_flow.md` - Authentication flow
- `onboarding_flow.md` - User onboarding
- `data_provider.md` - Data layer
- `edge_functions.md` - Supabase functions
- `sqlite_structure.md` - Database schema
- `project_index.md` - This comprehensive index

---

## 🎨 UI/UX Patterns

### **Design System**
- **Colors:** Defined in `constants/Colors.ts`
- **Typography:** Responsive font sizing with `FontSizeContext`
- **Components:** Reusable components in `components/`
- **Animations:** Lottie animations in `assets/animations/`

### **Accessibility**
- **Screen readers:** Proper labeling and navigation
- **Font scaling:** Responsive text sizing
- **Color contrast:** High contrast mode support
- **Touch targets:** Adequate button sizes

---

## 🚀 Production Readiness Checklist

### **getStream Integration**
- [x] Token generation via Edge Function
- [x] Real-time messaging implementation
- [x] Channel creation and management
- [x] Message persistence
- [x] User blocking/muting
- [x] Push notifications
- [x] Offline support

### **Deployment**
- [x] EAS Build configuration
- [x] Environment variables setup
- [x] Supabase Edge Functions
- [x] App Store/Play Store preparation
- [ ] Production testing
- [ ] Performance optimization
- [ ] Security audit

### **Quality Assurance**
- [ ] Error handling
- [ ] Loading states
- [ ] Offline functionality
- [ ] Real-time sync
- [ ] User experience testing
- [ ] Performance monitoring

---

This index serves as a comprehensive reference for all development work on the aushilfApp project, with special focus on the production-ready getStream implementation. It should be updated as the project evolves to maintain accuracy and productivity optimization. 