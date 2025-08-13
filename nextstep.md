# Rumoro App - Next Steps & Development Roadmap

## Table of Contents
1. [Frontend Remaining Work](#frontend-remaining-work)
2. [Backend Development with Django](#backend-development-with-django)
3. [API Specification](#api-specification)
4. [Database Schema](#database-schema)
5. [Deployment & DevOps](#deployment--devops)
6. [Timeline & Priorities](#timeline--priorities)

---

## Frontend Remaining Work

### 1. State Management Implementation

#### 1.1 Redux Toolkit Setup
```typescript
// Required packages to install
npm install @reduxjs/toolkit react-redux redux-persist @react-native-async-storage/async-storage

// Store structure needed:
store/
├── index.ts                 // Store configuration
├── slices/
│   ├── authSlice.ts         // User authentication state
│   ├── profileSlice.ts      // Current user profile
│   ├── gossipSlice.ts       // Gossips feed & cache
│   ├── buzzSlice.ts         // Buzz transactions
│   ├── messageSlice.ts      // Messages & conversations
│   └── uiSlice.ts           // UI state (loading, errors)
└── api/
    ├── apiClient.ts         // Axios instance configuration
    └── endpoints/           // API endpoint definitions
```

#### 1.2 State Structure Definition
```typescript
interface AppState {
  auth: {
    user: User | null;
    token: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
  };
  profile: {
    currentProfile: PersonProfile | null;
    linkedSocials: SocialLinks;
    buzzBalance: number;
    dailyStreak: number;
  };
  gossips: {
    feed: Gossip[];
    userGossips: Gossip[];
    cache: Record<string, Gossip>;
    hasMore: boolean;
    isLoading: boolean;
    page: number;
  };
  // ... more slices
}
```

### 2. API Integration Layer

#### 2.1 API Client Setup
```typescript
// services/api/client.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth token
apiClient.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Implement token refresh logic
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      // ... refresh token logic
    }
    return Promise.reject(error);
  }
);
```

#### 2.2 API Service Methods to Implement
```typescript
// services/api/auth.service.ts
export const authService = {
  sendOTP: (phoneNumber: string) => Promise<{success: boolean}>,
  verifyOTP: (phoneNumber: string, otp: string) => Promise<AuthResponse>,
  refreshToken: (refreshToken: string) => Promise<TokenResponse>,
  logout: () => Promise<void>,
  googleSignIn: (googleToken: string) => Promise<AuthResponse>,
};

// services/api/profile.service.ts
export const profileService = {
  getProfile: (profileId: string) => Promise<PersonProfile>,
  searchProfiles: (query: string, platform?: string) => Promise<PersonProfile[]>,
  claimProfile: (profileId: string) => Promise<ClaimResponse>,
  linkSocialAccount: (platform: string, token: string) => Promise<LinkResponse>,
  unlinkSocialAccount: (platform: string) => Promise<void>,
  updateProfile: (updates: ProfileUpdate) => Promise<PersonProfile>,
};

// services/api/gossip.service.ts
export const gossipService = {
  getFeed: (page: number, type: 'hot' | 'latest') => Promise<GossipFeed>,
  getGossipsByProfile: (profileId: string, channelId?: string) => Promise<Gossip[]>,
  createGossip: (data: CreateGossipDto) => Promise<Gossip>,
  createReply: (gossipId: string, content: string) => Promise<Reply>,
  reportContent: (targetId: string, type: string, reason: string) => Promise<void>,
  hideGossip: (gossipId: string) => Promise<void>,
};

// services/api/buzz.service.ts
export const buzzService = {
  getBalance: () => Promise<number>,
  getTransactionHistory: (filter?: string) => Promise<BuzzTransaction[]>,
  claimDailyReward: () => Promise<BuzzTransaction>,
};

// services/api/channel.service.ts
export const channelService = {
  getChannels: (profileId: string) => Promise<Channel[]>,
  createChannel: (name: string, profileId: string) => Promise<Channel>,
  disableChannel: (channelId: string) => Promise<void>,
};
```

### 3. Media Handling Implementation

#### 3.1 Image Picker Integration
```typescript
// Install required packages
npm install expo-image-picker expo-image-manipulator

// utils/imageHelper.ts
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

export const pickImage = async (options?: ImagePicker.ImagePickerOptions) => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
    ...options,
  });
  
  if (!result.canceled) {
    return await compressImage(result.assets[0].uri);
  }
  return null;
};

export const compressImage = async (uri: string) => {
  const manipResult = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: 800 } }],
    { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
  );
  return manipResult.uri;
};

export const uploadImage = async (uri: string, type: 'profile' | 'gossip') => {
  const formData = new FormData();
  formData.append('image', {
    uri,
    type: 'image/jpeg',
    name: `${type}_${Date.now()}.jpg`,
  } as any);
  
  // Upload to backend
  const response = await apiClient.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  
  return response.data.url;
};
```

#### 3.2 Update Compose Screen for Images
```typescript
// Add to app/compose.tsx
const [selectedImage, setSelectedImage] = useState<string | null>(null);
const [isUploadingImage, setIsUploadingImage] = useState(false);

const handleImagePick = async () => {
  const imageUri = await pickImage();
  if (imageUri) {
    setSelectedImage(imageUri);
  }
};

const handleSubmit = async () => {
  let imageUrl = null;
  if (selectedImage) {
    setIsUploadingImage(true);
    try {
      imageUrl = await uploadImage(selectedImage, 'gossip');
    } catch (error) {
      Alert.alert('Error', 'Failed to upload image');
      return;
    } finally {
      setIsUploadingImage(false);
    }
  }
  
  await gossipService.createGossip({
    content: gossipContent,
    channelId: selectedChannel,
    profileId: selectedProfile,
    imageUrl,
  });
};
```

### 4. Performance Optimizations

#### 4.1 List Optimization
```typescript
// components/OptimizedFlatList.tsx
import { FlashList } from '@shopify/flash-list';

export const OptimizedGossipList = ({ data, onEndReached }) => {
  return (
    <FlashList
      data={data}
      renderItem={renderGossipCard}
      estimatedItemSize={200}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      keyExtractor={(item) => item.id}
      ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
      ListFooterComponent={LoadingFooter}
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      windowSize={10}
      initialNumToRender={5}
    />
  );
};
```

#### 4.2 Image Lazy Loading
```typescript
// components/LazyImage.tsx
import { Image } from 'expo-image';

export const LazyImage = ({ source, style, ...props }) => {
  return (
    <Image
      source={source}
      style={style}
      placeholder={blurhash}
      contentFit="cover"
      transition={200}
      cachePolicy="memory-disk"
      {...props}
    />
  );
};
```

#### 4.3 Memoization for Expensive Components
```typescript
// Use React.memo and useMemo for expensive renders
const GossipCard = React.memo(({ gossip, onLike, onReply }) => {
  const formattedTime = useMemo(() => 
    formatTimeAgo(gossip.createdAt), [gossip.createdAt]
  );
  
  return (
    // ... component JSX
  );
}, (prevProps, nextProps) => {
  return prevProps.gossip.id === nextProps.gossip.id &&
         prevProps.gossip.likes === nextProps.gossip.likes;
});
```

### 5. Production Configuration

#### 5.1 Environment Setup
```typescript
// config/environment.ts
interface Environment {
  API_URL: string;
  WEBSOCKET_URL: string;
  GOOGLE_CLIENT_ID: string;
  SENTRY_DSN: string;
  ANALYTICS_KEY: string;
}

const ENV = {
  dev: {
    API_URL: 'http://localhost:8000/api/v1',
    WEBSOCKET_URL: 'ws://localhost:8000/ws',
    GOOGLE_CLIENT_ID: 'dev-client-id',
    SENTRY_DSN: '',
    ANALYTICS_KEY: '',
  },
  staging: {
    API_URL: 'https://staging-api.rumoro.app/api/v1',
    WEBSOCKET_URL: 'wss://staging-api.rumoro.app/ws',
    GOOGLE_CLIENT_ID: 'staging-client-id',
    SENTRY_DSN: 'staging-sentry-dsn',
    ANALYTICS_KEY: 'staging-analytics-key',
  },
  prod: {
    API_URL: 'https://api.rumoro.app/api/v1',
    WEBSOCKET_URL: 'wss://api.rumoro.app/ws',
    GOOGLE_CLIENT_ID: 'prod-client-id',
    SENTRY_DSN: 'prod-sentry-dsn',
    ANALYTICS_KEY: 'prod-analytics-key',
  },
};

export default ENV[process.env.EXPO_PUBLIC_ENV || 'dev'];
```

#### 5.2 Error Boundary Implementation
```typescript
// components/ErrorBoundary.tsx
import * as Sentry from 'sentry-expo';

class ErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    Sentry.Native.captureException(error, {
      contexts: { react: { componentStack: errorInfo.componentStack } },
    });
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback onReset={() => this.setState({ hasError: false })} />;
    }
    return this.props.children;
  }
}
```

#### 5.3 Crash Reporting Setup
```typescript
// Install and configure Sentry
npm install sentry-expo

// app/_layout.tsx
import * as Sentry from 'sentry-expo';

Sentry.init({
  dsn: ENV.SENTRY_DSN,
  enableInExpoDevelopment: false,
  debug: __DEV__,
  environment: process.env.EXPO_PUBLIC_ENV || 'development',
});
```

### 6. Real-time Features

#### 6.1 WebSocket Integration
```typescript
// services/websocket.service.ts
import { io, Socket } from 'socket.io-client';

class WebSocketService {
  private socket: Socket | null = null;
  
  connect(token: string) {
    this.socket = io(ENV.WEBSOCKET_URL, {
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
    
    this.setupListeners();
  }
  
  private setupListeners() {
    this.socket?.on('message', (data) => {
      store.dispatch(messageSlice.actions.addMessage(data));
    });
    
    this.socket?.on('typing', (data) => {
      store.dispatch(messageSlice.actions.setTyping(data));
    });
    
    this.socket?.on('online_status', (data) => {
      store.dispatch(profileSlice.actions.updateOnlineStatus(data));
    });
  }
  
  sendMessage(conversationId: string, message: string) {
    this.socket?.emit('message', { conversationId, message });
  }
  
  startTyping(conversationId: string) {
    this.socket?.emit('typing_start', { conversationId });
  }
  
  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }
}

export default new WebSocketService();
```

#### 6.2 Push Notifications
```typescript
// services/notification.service.ts
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

export const registerForPushNotifications = async () => {
  if (!Device.isDevice) return null;
  
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  
  if (finalStatus !== 'granted') return null;
  
  const token = (await Notifications.getExpoPushTokenAsync()).data;
  
  // Send token to backend
  await apiClient.post('/devices/register', { 
    token,
    platform: Device.osName,
  });
  
  return token;
};

// Configure notification handlers
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});
```

### 7. Offline Support

#### 7.1 Cache Management
```typescript
// services/cache.service.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

class CacheService {
  private readonly CACHE_PREFIX = '@rumoro_cache_';
  private readonly CACHE_EXPIRY = 1000 * 60 * 60; // 1 hour
  
  async get<T>(key: string): Promise<T | null> {
    try {
      const cached = await AsyncStorage.getItem(this.CACHE_PREFIX + key);
      if (!cached) return null;
      
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp > this.CACHE_EXPIRY) {
        await this.remove(key);
        return null;
      }
      
      return data as T;
    } catch {
      return null;
    }
  }
  
  async set<T>(key: string, data: T): Promise<void> {
    const cacheData = {
      data,
      timestamp: Date.now(),
    };
    await AsyncStorage.setItem(
      this.CACHE_PREFIX + key,
      JSON.stringify(cacheData)
    );
  }
  
  async remove(key: string): Promise<void> {
    await AsyncStorage.removeItem(this.CACHE_PREFIX + key);
  }
  
  async clear(): Promise<void> {
    const keys = await AsyncStorage.getAllKeys();
    const cacheKeys = keys.filter(k => k.startsWith(this.CACHE_PREFIX));
    await AsyncStorage.multiRemove(cacheKeys);
  }
}

// Offline queue for actions
class OfflineQueue {
  private queue: any[] = [];
  
  async addToQueue(action: any) {
    this.queue.push(action);
    await AsyncStorage.setItem('@offline_queue', JSON.stringify(this.queue));
  }
  
  async processQueue() {
    const netInfo = await NetInfo.fetch();
    if (!netInfo.isConnected) return;
    
    const queuedActions = [...this.queue];
    this.queue = [];
    
    for (const action of queuedActions) {
      try {
        await this.executeAction(action);
      } catch (error) {
        this.queue.push(action); // Re-add failed actions
      }
    }
    
    await AsyncStorage.setItem('@offline_queue', JSON.stringify(this.queue));
  }
  
  private async executeAction(action: any) {
    // Process different action types
    switch (action.type) {
      case 'CREATE_GOSSIP':
        await gossipService.createGossip(action.payload);
        break;
      case 'SEND_MESSAGE':
        await messageService.sendMessage(action.payload);
        break;
      // ... other action types
    }
  }
}
```

### 8. Testing Implementation

#### 8.1 Unit Tests Setup
```typescript
// Install testing dependencies
npm install --save-dev @testing-library/react-native jest-expo

// __tests__/services/auth.test.ts
import { authService } from '../services/api/auth.service';
import { mockApiClient } from '../__mocks__/apiClient';

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('sendOTP should call correct endpoint', async () => {
    mockApiClient.post.mockResolvedValue({ data: { success: true } });
    
    const result = await authService.sendOTP('+1234567890');
    
    expect(mockApiClient.post).toHaveBeenCalledWith('/auth/send-otp', {
      phoneNumber: '+1234567890',
    });
    expect(result.success).toBe(true);
  });
  
  test('verifyOTP should return auth tokens', async () => {
    const mockResponse = {
      data: {
        user: { id: '1', phoneNumber: '+1234567890' },
        token: 'access-token',
        refreshToken: 'refresh-token',
      },
    };
    mockApiClient.post.mockResolvedValue(mockResponse);
    
    const result = await authService.verifyOTP('+1234567890', '123456');
    
    expect(result.token).toBe('access-token');
  });
});
```

#### 8.2 Component Tests
```typescript
// __tests__/components/GossipCard.test.tsx
import { render, fireEvent } from '@testing-library/react-native';
import { GossipCard } from '../components/GossipCard';

describe('GossipCard', () => {
  const mockGossip = {
    id: '1',
    content: 'Test gossip content',
    author: { name: 'Test User', handle: '@test' },
    likes: 10,
    comments: 5,
    createdAt: new Date(),
  };
  
  test('renders gossip content correctly', () => {
    const { getByText } = render(<GossipCard gossip={mockGossip} />);
    
    expect(getByText('Test gossip content')).toBeTruthy();
    expect(getByText('@test')).toBeTruthy();
  });
  
  test('calls onLike when like button pressed', () => {
    const onLike = jest.fn();
    const { getByTestId } = render(
      <GossipCard gossip={mockGossip} onLike={onLike} />
    );
    
    fireEvent.press(getByTestId('like-button'));
    expect(onLike).toHaveBeenCalledWith(mockGossip.id);
  });
});
```

---

## Backend Development with Django

### 1. Django Project Structure

```
rumoro-backend/
├── manage.py
├── requirements.txt
├── requirements-dev.txt
├── .env.example
├── docker-compose.yml
├── Dockerfile
├── rumoro/
│   ├── __init__.py
│   ├── settings/
│   │   ├── __init__.py
│   │   ├── base.py
│   │   ├── development.py
│   │   ├── staging.py
│   │   └── production.py
│   ├── urls.py
│   ├── wsgi.py
│   └── asgi.py
├── apps/
│   ├── __init__.py
│   ├── accounts/
│   │   ├── models.py         # User, PhoneVerification
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   ├── managers.py
│   │   ├── signals.py
│   │   └── tasks.py
│   ├── profiles/
│   │   ├── models.py         # PersonProfile, SocialLink
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   └── services.py
│   ├── gossips/
│   │   ├── models.py         # Gossip, Reply, Channel
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   ├── filters.py
│   │   └── permissions.py
│   ├── buzz/
│   │   ├── models.py         # BuzzTransaction, DailyReward
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   ├── services.py
│   │   └── tasks.py
│   ├── moderation/
│   │   ├── models.py         # Report, BlockedKeyword
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   └── utils.py
│   ├── messaging/
│   │   ├── models.py         # Conversation, Message
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   ├── consumers.py     # WebSocket consumers
│   │   └── routing.py
│   └── notifications/
│       ├── models.py         # Notification, DeviceToken
│       ├── serializers.py
│       ├── views.py
│       ├── urls.py
│       └── services.py
├── core/
│   ├── __init__.py
│   ├── mixins.py
│   ├── permissions.py
│   ├── pagination.py
│   ├── exceptions.py
│   ├── middleware.py
│   └── utils.py
├── tests/
│   ├── __init__.py
│   ├── test_accounts.py
│   ├── test_profiles.py
│   ├── test_gossips.py
│   ├── test_buzz.py
│   └── factories.py
└── scripts/
    ├── setup_dev.sh
    ├── deploy.sh
    └── backup_db.sh
```

### 2. Django Models Implementation

#### 2.1 User & Authentication Models
```python
# apps/accounts/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models
import random
import string

class User(AbstractUser):
    phone_number = models.CharField(max_length=20, unique=True, db_index=True)
    buzz_score = models.IntegerField(default=0)
    is_phone_verified = models.BooleanField(default=False)
    google_id = models.CharField(max_length=255, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    last_active_at = models.DateTimeField(auto_now=True)
    daily_streak = models.IntegerField(default=0)
    last_daily_claim = models.DateField(null=True, blank=True)
    
    # Settings
    notification_enabled = models.BooleanField(default=True)
    blocked_keywords = models.JSONField(default=list)
    
    USERNAME_FIELD = 'phone_number'
    REQUIRED_FIELDS = []
    
    class Meta:
        db_table = 'users'
        indexes = [
            models.Index(fields=['phone_number']),
            models.Index(fields=['google_id']),
        ]

class PhoneVerification(models.Model):
    phone_number = models.CharField(max_length=20)
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    attempts = models.IntegerField(default=0)
    is_verified = models.BooleanField(default=False)
    ip_address = models.GenericIPAddressField(null=True)
    
    def generate_otp(self):
        self.otp = ''.join(random.choices(string.digits, k=6))
        return self.otp
    
    def is_valid(self):
        from django.utils import timezone
        from datetime import timedelta
        return (
            not self.is_verified and
            self.attempts < 3 and
            self.created_at > timezone.now() - timedelta(minutes=10)
        )
    
    class Meta:
        db_table = 'phone_verifications'
        indexes = [
            models.Index(fields=['phone_number', '-created_at']),
        ]
```

#### 2.2 Profile Models
```python
# apps/profiles/models.py
from django.db import models
from django.contrib.postgres.fields import ArrayField

class PersonProfile(models.Model):
    PLATFORM_CHOICES = [
        ('instagram', 'Instagram'),
        ('twitter', 'Twitter'),
        ('snapchat', 'Snapchat'),
    ]
    
    handle = models.CharField(max_length=100)
    platform = models.CharField(max_length=20, choices=PLATFORM_CHOICES)
    display_name = models.CharField(max_length=150)
    avatar = models.URLField(null=True, blank=True)
    bio = models.TextField(blank=True)
    is_claimed = models.BooleanField(default=False)
    claimed_by = models.ForeignKey(
        'accounts.User',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='claimed_profiles'
    )
    is_verified = models.BooleanField(default=False)
    follower_count = models.IntegerField(default=0)
    external_id = models.CharField(max_length=255, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Stats
    total_gossips = models.IntegerField(default=0)
    trending_score = models.FloatField(default=0)
    
    class Meta:
        db_table = 'person_profiles'
        unique_together = ['handle', 'platform']
        indexes = [
            models.Index(fields=['handle', 'platform']),
            models.Index(fields=['claimed_by']),
            models.Index(fields=['-trending_score']),
        ]
    
    def __str__(self):
        return f"{self.display_name} (@{self.handle}) - {self.platform}"

class SocialLink(models.Model):
    user = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name='social_links')
    profile = models.ForeignKey(PersonProfile, on_delete=models.CASCADE)
    platform = models.CharField(max_length=20)
    access_token = models.TextField()
    refresh_token = models.TextField(null=True, blank=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    linked_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'social_links'
        unique_together = ['user', 'platform']
```

#### 2.3 Gossip Models
```python
# apps/gossips/models.py
from django.db import models
from django.contrib.postgres.fields import ArrayField

class Channel(models.Model):
    CHANNEL_TYPES = [
        ('preset', 'Preset'),
        ('user-created', 'User Created'),
    ]
    
    PRESET_CHANNELS = [
        'Work',
        'College/School',
        'Talent/Skills',
        'Tea/Spill',
        'Q&A',
        'Fact-Check',
        'Misc'
    ]
    
    profile = models.ForeignKey(
        'profiles.PersonProfile',
        on_delete=models.CASCADE,
        related_name='channels'
    )
    name = models.CharField(max_length=100)
    type = models.CharField(max_length=20, choices=CHANNEL_TYPES)
    created_by = models.ForeignKey(
        'accounts.User',
        null=True,
        blank=True,
        on_delete=models.SET_NULL
    )
    created_at = models.DateTimeField(auto_now_add=True)
    gossip_count = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'channels'
        unique_together = ['profile', 'name']
        indexes = [
            models.Index(fields=['profile', 'is_active']),
        ]

class Gossip(models.Model):
    profile = models.ForeignKey(
        'profiles.PersonProfile',
        on_delete=models.CASCADE,
        related_name='gossips'
    )
    channel = models.ForeignKey(
        Channel,
        on_delete=models.CASCADE,
        related_name='gossips'
    )
    author = models.ForeignKey(
        'accounts.User',
        on_delete=models.CASCADE,
        related_name='posted_gossips'
    )
    content = models.TextField(max_length=500)
    image_url = models.URLField(null=True, blank=True)
    
    # Engagement metrics
    reply_count = models.IntegerField(default=0)
    like_count = models.IntegerField(default=0)
    share_count = models.IntegerField(default=0)
    view_count = models.IntegerField(default=0)
    
    # Moderation
    is_hidden = models.BooleanField(default=False)
    hidden_by = models.ForeignKey(
        'accounts.User',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='hidden_gossips'
    )
    hidden_at = models.DateTimeField(null=True, blank=True)
    
    # Boost feature
    is_boosted = models.BooleanField(default=False)
    boost_expires_at = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # For trending algorithm
    trending_score = models.FloatField(default=0)
    last_activity_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'gossips'
        indexes = [
            models.Index(fields=['-created_at']),
            models.Index(fields=['profile', 'channel', '-created_at']),
            models.Index(fields=['-trending_score', '-created_at']),
            models.Index(fields=['author']),
        ]

class Reply(models.Model):
    gossip = models.ForeignKey(
        Gossip,
        on_delete=models.CASCADE,
        related_name='replies'
    )
    author = models.ForeignKey(
        'accounts.User',
        on_delete=models.CASCADE,
        related_name='replies'
    )
    content = models.TextField(max_length=280)
    created_at = models.DateTimeField(auto_now_add=True)
    is_hidden = models.BooleanField(default=False)
    
    class Meta:
        db_table = 'replies'
        indexes = [
            models.Index(fields=['gossip', '-created_at']),
        ]

class GossipLike(models.Model):
    gossip = models.ForeignKey(Gossip, on_delete=models.CASCADE, related_name='likes')
    user = models.ForeignKey('accounts.User', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'gossip_likes'
        unique_together = ['gossip', 'user']
```

#### 2.4 Buzz Models
```python
# apps/buzz/models.py
from django.db import models

class BuzzTransaction(models.Model):
    TRANSACTION_TYPES = [
        ('earn', 'Earn'),
        ('spend', 'Spend'),
    ]
    
    TRANSACTION_REASONS = [
        ('daily_open', 'Daily App Open'),
        ('post_survived', 'Post Survived 24h'),
        ('post_replies', 'Post Got 3+ Replies'),
        ('claim_profile', 'Claimed Profile'),
        ('create_channel', 'Created Channel'),
        ('boost_gossip', 'Boosted Gossip'),
        ('cosmetic', 'Cosmetic Purchase'),
    ]
    
    user = models.ForeignKey(
        'accounts.User',
        on_delete=models.CASCADE,
        related_name='buzz_transactions'
    )
    amount = models.IntegerField()
    type = models.CharField(max_length=10, choices=TRANSACTION_TYPES)
    reason = models.CharField(max_length=30, choices=TRANSACTION_REASONS)
    metadata = models.JSONField(default=dict, blank=True)
    balance_after = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    # For idempotency
    idempotency_key = models.CharField(max_length=255, null=True, blank=True, unique=True)
    
    class Meta:
        db_table = 'buzz_transactions'
        indexes = [
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['idempotency_key']),
        ]
    
    def save(self, *args, **kwargs):
        if not self.pk:
            # Update user's buzz score
            from django.db import transaction
            with transaction.atomic():
                user = self.user
                if self.type == 'earn':
                    user.buzz_score += self.amount
                else:
                    user.buzz_score -= self.amount
                user.save()
                self.balance_after = user.buzz_score
        super().save(*args, **kwargs)

class DailyReward(models.Model):
    user = models.ForeignKey('accounts.User', on_delete=models.CASCADE)
    date = models.DateField()
    claimed_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'daily_rewards'
        unique_together = ['user', 'date']
```

### 3. Django REST Framework Setup

#### 3.1 Serializers
```python
# apps/accounts/serializers.py
from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    linked_socials = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'id', 'phone_number', 'buzz_score', 'linked_socials',
            'created_at', 'last_active_at', 'daily_streak'
        ]
        read_only_fields = ['buzz_score', 'daily_streak']
    
    def get_linked_socials(self, obj):
        return {
            'instagram': obj.social_links.filter(platform='instagram').exists(),
            'twitter': obj.social_links.filter(platform='twitter').exists(),
            'snapchat': obj.social_links.filter(platform='snapchat').exists(),
        }

class PhoneAuthSerializer(serializers.Serializer):
    phone_number = serializers.CharField(max_length=20)
    
    def validate_phone_number(self, value):
        import re
        if not re.match(r'^\+\d{10,15}$', value):
            raise serializers.ValidationError("Invalid phone number format")
        return value

class OTPVerifySerializer(serializers.Serializer):
    phone_number = serializers.CharField(max_length=20)
    otp = serializers.CharField(max_length=6)

# apps/profiles/serializers.py
from rest_framework import serializers
from .models import PersonProfile

class PersonProfileSerializer(serializers.ModelSerializer):
    is_owner = serializers.SerializerMethodField()
    channels = serializers.SerializerMethodField()
    
    class Meta:
        model = PersonProfile
        fields = [
            'id', 'handle', 'platform', 'display_name', 'avatar',
            'bio', 'is_claimed', 'is_verified', 'follower_count',
            'total_gossips', 'trending_score', 'is_owner', 'channels'
        ]
    
    def get_is_owner(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.claimed_by == request.user
        return False
    
    def get_channels(self, obj):
        from apps.gossips.serializers import ChannelSerializer
        channels = obj.channels.filter(is_active=True)
        return ChannelSerializer(channels, many=True).data

# apps/gossips/serializers.py
from rest_framework import serializers
from .models import Gossip, Reply, Channel

class ChannelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Channel
        fields = ['id', 'name', 'type', 'gossip_count', 'is_active']

class ReplySerializer(serializers.ModelSerializer):
    author_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Reply
        fields = ['id', 'content', 'created_at', 'author_name']
    
    def get_author_name(self, obj):
        return "Anonymous"

class GossipSerializer(serializers.ModelSerializer):
    profile = PersonProfileSerializer(read_only=True)
    channel = ChannelSerializer(read_only=True)
    replies = ReplySerializer(many=True, read_only=True)
    is_liked = serializers.SerializerMethodField()
    author_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Gossip
        fields = [
            'id', 'profile', 'channel', 'content', 'image_url',
            'reply_count', 'like_count', 'created_at', 'is_boosted',
            'replies', 'is_liked', 'author_name', 'trending_score'
        ]
    
    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.likes.filter(user=request.user).exists()
        return False
    
    def get_author_name(self, obj):
        return "Anonymous"

class CreateGossipSerializer(serializers.ModelSerializer):
    profile_id = serializers.IntegerField()
    channel_id = serializers.IntegerField()
    
    class Meta:
        model = Gossip
        fields = ['content', 'image_url', 'profile_id', 'channel_id']
    
    def validate_content(self, value):
        # Check for inappropriate content
        from apps.moderation.utils import check_content
        if not check_content(value):
            raise serializers.ValidationError("Content contains inappropriate language")
        return value
```

#### 3.2 Views/ViewSets
```python
# apps/accounts/views.py
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.core.cache import cache
import random

class AuthViewSet(viewsets.GenericViewSet):
    permission_classes = [AllowAny]
    
    @action(detail=False, methods=['post'])
    def send_otp(self, request):
        serializer = PhoneAuthSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        phone_number = serializer.validated_data['phone_number']
        
        # Rate limiting
        cache_key = f"otp_sent_{phone_number}"
        if cache.get(cache_key):
            return Response(
                {"error": "Please wait before requesting another OTP"},
                status=status.HTTP_429_TOO_MANY_REQUESTS
            )
        
        # Generate and send OTP
        verification = PhoneVerification.objects.create(
            phone_number=phone_number,
            ip_address=request.META.get('REMOTE_ADDR')
        )
        otp = verification.generate_otp()
        verification.save()
        
        # Send via Twilio
        from apps.accounts.tasks import send_sms_task
        send_sms_task.delay(phone_number, f"Your Rumoro OTP is: {otp}")
        
        # Set rate limit
        cache.set(cache_key, True, 60)  # 1 minute cooldown
        
        return Response({"success": True, "message": "OTP sent successfully"})
    
    @action(detail=False, methods=['post'])
    def verify_otp(self, request):
        serializer = OTPVerifySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        phone_number = serializer.validated_data['phone_number']
        otp = serializer.validated_data['otp']
        
        # Verify OTP
        verification = PhoneVerification.objects.filter(
            phone_number=phone_number,
            otp=otp,
            is_verified=False
        ).order_by('-created_at').first()
        
        if not verification or not verification.is_valid():
            return Response(
                {"error": "Invalid or expired OTP"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        verification.is_verified = True
        verification.save()
        
        # Create or get user
        user, created = User.objects.get_or_create(
            phone_number=phone_number,
            defaults={'username': phone_number}
        )
        user.is_phone_verified = True
        user.save()
        
        # Generate tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'user': UserSerializer(user).data,
            'token': str(refresh.access_token),
            'refresh_token': str(refresh),
            'is_new_user': created
        })

# apps/profiles/views.py
from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend

class PersonProfileViewSet(viewsets.ModelViewSet):
    queryset = PersonProfile.objects.all()
    serializer_class = PersonProfileSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ['handle', 'display_name']
    filterset_fields = ['platform', 'is_verified']
    
    @action(detail=True, methods=['post'])
    def claim(self, request, pk=None):
        profile = self.get_object()
        
        if profile.is_claimed:
            return Response(
                {"error": "Profile already claimed"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # TODO: Verify ownership via OAuth
        profile.is_claimed = True
        profile.claimed_by = request.user
        profile.save()
        
        # Award buzz
        from apps.buzz.services import BuzzService
        BuzzService.award_buzz(
            request.user,
            10,
            'claim_profile',
            {'profile_id': profile.id}
        )
        
        return Response({"success": True, "buzz_earned": 10})
    
    @action(detail=False, methods=['get'])
    def trending(self, request):
        trending_profiles = self.queryset.order_by('-trending_score')[:20]
        serializer = self.get_serializer(trending_profiles, many=True)
        return Response(serializer.data)

# apps/gossips/views.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from apps.gossips.permissions import IsOwnerOrReadOnly

class GossipViewSet(viewsets.ModelViewSet):
    queryset = Gossip.objects.filter(is_hidden=False)
    serializer_class = GossipSerializer
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return CreateGossipSerializer
        return GossipSerializer
    
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
        
        # Update channel gossip count
        channel = serializer.instance.channel
        channel.gossip_count += 1
        channel.save()
    
    @action(detail=False, methods=['get'])
    def feed(self, request):
        feed_type = request.query_params.get('type', 'hot')
        page = int(request.query_params.get('page', 1))
        page_size = 20
        
        if feed_type == 'hot':
            gossips = self.queryset.order_by('-trending_score', '-created_at')
        else:
            gossips = self.queryset.order_by('-created_at')
        
        start = (page - 1) * page_size
        end = start + page_size
        
        serializer = self.get_serializer(gossips[start:end], many=True)
        
        return Response({
            'results': serializer.data,
            'has_more': gossips.count() > end,
            'page': page
        })
    
    @action(detail=True, methods=['post'])
    def like(self, request, pk=None):
        gossip = self.get_object()
        
        like, created = GossipLike.objects.get_or_create(
            gossip=gossip,
            user=request.user
        )
        
        if created:
            gossip.like_count += 1
            gossip.save()
            return Response({"liked": True})
        else:
            like.delete()
            gossip.like_count -= 1
            gossip.save()
            return Response({"liked": False})
    
    @action(detail=True, methods=['post'])
    def reply(self, request, pk=None):
        gossip = self.get_object()
        
        serializer = ReplySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        reply = serializer.save(
            gossip=gossip,
            author=request.user
        )
        
        gossip.reply_count += 1
        gossip.last_activity_at = reply.created_at
        gossip.save()
        
        # Check for buzz reward (3+ replies)
        if gossip.reply_count == 3:
            from apps.buzz.services import BuzzService
            BuzzService.award_buzz(
                gossip.author,
                3,
                'post_replies',
                {'gossip_id': gossip.id}
            )
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)
```

### 4. Django Channels for WebSocket

#### 4.1 WebSocket Configuration
```python
# rumoro/asgi.py
import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from channels.security.websocket import AllowedHostsOriginValidator

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'rumoro.settings')

from apps.messaging import routing

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AllowedHostsOriginValidator(
        AuthMiddlewareStack(
            URLRouter(
                routing.websocket_urlpatterns
            )
        )
    ),
})

# apps/messaging/routing.py
from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/chat/$', consumers.ChatConsumer.as_asgi()),
    re_path(r'ws/notifications/$', consumers.NotificationConsumer.as_asgi()),
]
```

#### 4.2 WebSocket Consumers
```python
# apps/messaging/consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.core.cache import cache

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope["user"]
        if not self.user.is_authenticated:
            await self.close()
            return
        
        self.user_group_name = f'user_{self.user.id}'
        
        # Join user group
        await self.channel_layer.group_add(
            self.user_group_name,
            self.channel_name
        )
        
        # Update online status
        await self.update_online_status(True)
        
        await self.accept()
    
    async def disconnect(self, close_code):
        if hasattr(self, 'user_group_name'):
            await self.channel_layer.group_discard(
                self.user_group_name,
                self.channel_name
            )
            await self.update_online_status(False)
    
    async def receive(self, text_data):
        data = json.loads(text_data)
        message_type = data.get('type')
        
        if message_type == 'message':
            await self.handle_message(data)
        elif message_type == 'typing':
            await self.handle_typing(data)
        elif message_type == 'read':
            await self.handle_read(data)
    
    async def handle_message(self, data):
        conversation_id = data.get('conversation_id')
        content = data.get('content')
        
        # Save message to database
        message = await self.save_message(conversation_id, content)
        
        # Send to recipient
        recipient_id = await self.get_recipient_id(conversation_id)
        await self.channel_layer.group_send(
            f'user_{recipient_id}',
            {
                'type': 'chat_message',
                'message': {
                    'id': message.id,
                    'content': content,
                    'sender_id': self.user.id,
                    'conversation_id': conversation_id,
                    'created_at': message.created_at.isoformat()
                }
            }
        )
    
    async def handle_typing(self, data):
        conversation_id = data.get('conversation_id')
        is_typing = data.get('is_typing')
        
        recipient_id = await self.get_recipient_id(conversation_id)
        
        # Use Redis for typing indicators
        cache_key = f'typing_{conversation_id}_{self.user.id}'
        if is_typing:
            cache.set(cache_key, True, 5)  # 5 second timeout
        else:
            cache.delete(cache_key)
        
        # Notify recipient
        await self.channel_layer.group_send(
            f'user_{recipient_id}',
            {
                'type': 'typing_indicator',
                'conversation_id': conversation_id,
                'user_id': self.user.id,
                'is_typing': is_typing
            }
        )
    
    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            'type': 'message',
            'message': event['message']
        }))
    
    async def typing_indicator(self, event):
        await self.send(text_data=json.dumps({
            'type': 'typing',
            'conversation_id': event['conversation_id'],
            'user_id': event['user_id'],
            'is_typing': event['is_typing']
        }))
    
    @database_sync_to_async
    def save_message(self, conversation_id, content):
        from apps.messaging.models import Message, Conversation
        conversation = Conversation.objects.get(id=conversation_id)
        return Message.objects.create(
            conversation=conversation,
            sender=self.user,
            content=content
        )
    
    @database_sync_to_async
    def get_recipient_id(self, conversation_id):
        from apps.messaging.models import Conversation
        conversation = Conversation.objects.get(id=conversation_id)
        participants = conversation.participants.all()
        for p in participants:
            if p != self.user:
                return p.id
        return None
    
    @database_sync_to_async
    def update_online_status(self, is_online):
        cache_key = f'online_{self.user.id}'
        if is_online:
            cache.set(cache_key, True, 300)  # 5 minute timeout
        else:
            cache.delete(cache_key)
```

### 5. Celery Tasks for Background Processing

```python
# rumoro/celery.py
import os
from celery import Celery
from celery.schedules import crontab

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'rumoro.settings')

app = Celery('rumoro')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()

app.conf.beat_schedule = {
    'calculate-trending-scores': {
        'task': 'apps.gossips.tasks.calculate_trending_scores',
        'schedule': crontab(minute='*/15'),  # Every 15 minutes
    },
    'cleanup-expired-boosts': {
        'task': 'apps.gossips.tasks.cleanup_expired_boosts',
        'schedule': crontab(minute='0', hour='*/1'),  # Every hour
    },
    'award-survival-buzz': {
        'task': 'apps.buzz.tasks.award_survival_buzz',
        'schedule': crontab(minute='0', hour='0'),  # Daily at midnight
    },
}

# apps/gossips/tasks.py
from celery import shared_task
from django.utils import timezone
from datetime import timedelta

@shared_task
def calculate_trending_scores():
    from apps.gossips.models import Gossip
    from math import log
    
    cutoff_time = timezone.now() - timedelta(days=7)
    gossips = Gossip.objects.filter(
        created_at__gte=cutoff_time,
        is_hidden=False
    )
    
    for gossip in gossips:
        # Reddit-like hot algorithm
        score = gossip.like_count + (gossip.reply_count * 2)
        order = log(max(abs(score), 1), 10)
        sign = 1 if score > 0 else -1 if score < 0 else 0
        seconds = (gossip.created_at - timezone.datetime(2020, 1, 1, tzinfo=timezone.utc)).total_seconds()
        gossip.trending_score = round(sign * order + seconds / 45000, 7)
        gossip.save(update_fields=['trending_score'])

@shared_task
def cleanup_expired_boosts():
    from apps.gossips.models import Gossip
    
    Gossip.objects.filter(
        is_boosted=True,
        boost_expires_at__lt=timezone.now()
    ).update(
        is_boosted=False,
        boost_expires_at=None
    )

@shared_task
def award_survival_buzz():
    from apps.gossips.models import Gossip
    from apps.buzz.services import BuzzService
    from datetime import timedelta
    
    cutoff_time = timezone.now() - timedelta(hours=24)
    surviving_gossips = Gossip.objects.filter(
        created_at__lte=cutoff_time,
        created_at__gte=cutoff_time - timedelta(hours=1),
        is_hidden=False
    )
    
    for gossip in surviving_gossips:
        BuzzService.award_buzz(
            gossip.author,
            2,
            'post_survived',
            {'gossip_id': gossip.id}
        )

# apps/accounts/tasks.py
from celery import shared_task
from twilio.rest import Client
from django.conf import settings

@shared_task
def send_sms_task(phone_number, message):
    client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
    
    message = client.messages.create(
        body=message,
        from_=settings.TWILIO_PHONE_NUMBER,
        to=phone_number
    )
    
    return message.sid

@shared_task
def send_push_notification(user_id, title, body, data=None):
    from apps.notifications.models import DeviceToken
    from exponent_server_sdk import PushClient, PushMessage
    
    tokens = DeviceToken.objects.filter(user_id=user_id, is_active=True)
    
    if not tokens:
        return
    
    push_client = PushClient()
    
    for token in tokens:
        try:
            push_client.publish(
                PushMessage(
                    to=token.token,
                    title=title,
                    body=body,
                    data=data or {}
                )
            )
        except Exception as e:
            # Handle invalid tokens
            token.is_active = False
            token.save()
```

### 6. Services Layer

```python
# apps/buzz/services.py
from django.db import transaction
from apps.buzz.models import BuzzTransaction
import hashlib

class BuzzService:
    @staticmethod
    @transaction.atomic
    def award_buzz(user, amount, reason, metadata=None):
        # Generate idempotency key
        idempotency_data = f"{user.id}_{reason}_{metadata}"
        idempotency_key = hashlib.md5(idempotency_data.encode()).hexdigest()
        
        # Check if transaction already exists
        existing = BuzzTransaction.objects.filter(
            idempotency_key=idempotency_key
        ).first()
        
        if existing:
            return existing
        
        # Create transaction
        transaction = BuzzTransaction.objects.create(
            user=user,
            amount=amount,
            type='earn',
            reason=reason,
            metadata=metadata or {},
            idempotency_key=idempotency_key
        )
        
        return transaction
    
    @staticmethod
    @transaction.atomic
    def spend_buzz(user, amount, reason, metadata=None):
        if user.buzz_score < amount:
            raise ValueError("Insufficient buzz balance")
        
        transaction = BuzzTransaction.objects.create(
            user=user,
            amount=amount,
            type='spend',
            reason=reason,
            metadata=metadata or {}
        )
        
        return transaction
    
    @staticmethod
    def check_daily_reward(user):
        from django.utils import timezone
        from apps.buzz.models import DailyReward
        
        today = timezone.now().date()
        
        # Check if already claimed
        if DailyReward.objects.filter(user=user, date=today).exists():
            return False
        
        # Create reward
        DailyReward.objects.create(user=user, date=today)
        
        # Award buzz
        BuzzService.award_buzz(
            user,
            1,
            'daily_open',
            {'date': str(today)}
        )
        
        # Update streak
        yesterday = today - timezone.timedelta(days=1)
        if user.last_daily_claim == yesterday:
            user.daily_streak += 1
        else:
            user.daily_streak = 1
        
        user.last_daily_claim = today
        user.save()
        
        return True

# apps/moderation/utils.py
import re
from django.conf import settings

class ContentModerator:
    INAPPROPRIATE_WORDS = [
        # Add your list of inappropriate words
    ]
    
    @staticmethod
    def check_content(content):
        content_lower = content.lower()
        
        # Check for inappropriate words
        for word in ContentModerator.INAPPROPRIATE_WORDS:
            if word in content_lower:
                return False
        
        # Check for excessive caps
        if len(content) > 10:
            caps_ratio = sum(1 for c in content if c.isupper()) / len(content)
            if caps_ratio > 0.8:
                return False
        
        # Check for spam patterns
        if re.search(r'(.)\1{5,}', content):  # Same character repeated 5+ times
            return False
        
        return True
    
    @staticmethod
    def filter_by_keywords(content, keywords):
        content_lower = content.lower()
        for keyword in keywords:
            if keyword.lower() in content_lower:
                return True
        return False
```

---

## API Specification

### Authentication Endpoints
```
POST   /api/v1/auth/send-otp/
POST   /api/v1/auth/verify-otp/
POST   /api/v1/auth/refresh/
POST   /api/v1/auth/logout/
POST   /api/v1/auth/google/
```

### User/Profile Endpoints
```
GET    /api/v1/users/me/
PATCH  /api/v1/users/me/
GET    /api/v1/users/me/buzz-balance/
GET    /api/v1/users/me/transactions/

GET    /api/v1/profiles/
GET    /api/v1/profiles/{id}/
GET    /api/v1/profiles/search/
GET    /api/v1/profiles/trending/
POST   /api/v1/profiles/{id}/claim/
POST   /api/v1/profiles/{id}/link-social/
DELETE /api/v1/profiles/{id}/unlink-social/
```

### Gossip Endpoints
```
GET    /api/v1/gossips/feed/
GET    /api/v1/gossips/{id}/
POST   /api/v1/gossips/
DELETE /api/v1/gossips/{id}/
POST   /api/v1/gossips/{id}/like/
POST   /api/v1/gossips/{id}/reply/
POST   /api/v1/gossips/{id}/report/
POST   /api/v1/gossips/{id}/hide/
POST   /api/v1/gossips/{id}/boost/
```

### Channel Endpoints
```
GET    /api/v1/channels/
GET    /api/v1/channels/{id}/
POST   /api/v1/channels/
PATCH  /api/v1/channels/{id}/
DELETE /api/v1/channels/{id}/
```

### Messaging Endpoints
```
GET    /api/v1/conversations/
GET    /api/v1/conversations/{id}/
POST   /api/v1/conversations/
GET    /api/v1/conversations/{id}/messages/
POST   /api/v1/conversations/{id}/messages/
PATCH  /api/v1/conversations/{id}/read/
```

### Notification Endpoints
```
GET    /api/v1/notifications/
PATCH  /api/v1/notifications/read-all/
POST   /api/v1/devices/register/
DELETE /api/v1/devices/{id}/
```

### WebSocket Endpoints
```
WS     /ws/chat/
WS     /ws/notifications/
```

---

## Database Schema

### PostgreSQL Tables
```sql
-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    phone_number VARCHAR(20) UNIQUE NOT NULL,
    username VARCHAR(150) UNIQUE NOT NULL,
    buzz_score INTEGER DEFAULT 0,
    is_phone_verified BOOLEAN DEFAULT FALSE,
    google_id VARCHAR(255),
    daily_streak INTEGER DEFAULT 0,
    last_daily_claim DATE,
    notification_enabled BOOLEAN DEFAULT TRUE,
    blocked_keywords JSONB DEFAULT '[]',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_active_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Person profiles table
CREATE TABLE person_profiles (
    id SERIAL PRIMARY KEY,
    handle VARCHAR(100) NOT NULL,
    platform VARCHAR(20) NOT NULL,
    display_name VARCHAR(150) NOT NULL,
    avatar TEXT,
    bio TEXT,
    is_claimed BOOLEAN DEFAULT FALSE,
    claimed_by_id INTEGER REFERENCES users(id),
    is_verified BOOLEAN DEFAULT FALSE,
    follower_count INTEGER DEFAULT 0,
    total_gossips INTEGER DEFAULT 0,
    trending_score FLOAT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(handle, platform)
);

-- Channels table
CREATE TABLE channels (
    id SERIAL PRIMARY KEY,
    profile_id INTEGER REFERENCES person_profiles(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(20) NOT NULL,
    created_by_id INTEGER REFERENCES users(id),
    gossip_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(profile_id, name)
);

-- Gossips table
CREATE TABLE gossips (
    id SERIAL PRIMARY KEY,
    profile_id INTEGER REFERENCES person_profiles(id) ON DELETE CASCADE,
    channel_id INTEGER REFERENCES channels(id) ON DELETE CASCADE,
    author_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    image_url TEXT,
    reply_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    share_count INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    is_hidden BOOLEAN DEFAULT FALSE,
    hidden_by_id INTEGER REFERENCES users(id),
    hidden_at TIMESTAMP,
    is_boosted BOOLEAN DEFAULT FALSE,
    boost_expires_at TIMESTAMP,
    trending_score FLOAT DEFAULT 0,
    last_activity_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_gossips_profile_channel ON gossips(profile_id, channel_id);
CREATE INDEX idx_gossips_trending ON gossips(trending_score DESC, created_at DESC);
CREATE INDEX idx_gossips_author ON gossips(author_id);
CREATE INDEX idx_profiles_trending ON person_profiles(trending_score DESC);
```

---

## Deployment & DevOps

### Docker Configuration
```dockerfile
# Dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    postgresql-client \
    gcc \
    python3-dev \
    musl-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Collect static files
RUN python manage.py collectstatic --noinput

# Run gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--workers", "4", "rumoro.wsgi:application"]
```

### Docker Compose
```yaml
# docker-compose.yml
version: '3.8'

services:
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: rumoro
      POSTGRES_USER: rumoro
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
  
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
  
  web:
    build: .
    command: gunicorn rumoro.wsgi:application --bind 0.0.0.0:8000
    volumes:
      - .:/app
      - static_volume:/app/staticfiles
      - media_volume:/app/mediafiles
    ports:
      - "8000:8000"
    env_file:
      - .env
    depends_on:
      - db
      - redis
  
  channels:
    build: .
    command: daphne -b 0.0.0.0 -p 8001 rumoro.asgi:application
    volumes:
      - .:/app
    ports:
      - "8001:8001"
    env_file:
      - .env
    depends_on:
      - db
      - redis
  
  celery:
    build: .
    command: celery -A rumoro worker -l info
    volumes:
      - .:/app
    env_file:
      - .env
    depends_on:
      - db
      - redis
  
  celery-beat:
    build: .
    command: celery -A rumoro beat -l info
    volumes:
      - .:/app
    env_file:
      - .env
    depends_on:
      - db
      - redis

volumes:
  postgres_data:
  static_volume:
  media_volume:
```

### Production Deployment (AWS)
```bash
# Deploy to AWS ECS/EKS or EC2

# 1. Build and push Docker image
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin $ECR_REGISTRY
docker build -t rumoro-backend .
docker tag rumoro-backend:latest $ECR_REGISTRY/rumoro-backend:latest
docker push $ECR_REGISTRY/rumoro-backend:latest

# 2. Update ECS task definition
aws ecs update-service --cluster rumoro-cluster --service rumoro-backend --force-new-deployment

# 3. Run migrations
kubectl exec -it rumoro-backend-pod -- python manage.py migrate

# 4. Create superuser
kubectl exec -it rumoro-backend-pod -- python manage.py createsuperuser
```

---

## Timeline & Priorities

### Phase 1: Core Backend (Week 1-2)
- [x] Django project setup
- [ ] User authentication with phone OTP
- [ ] Profile management APIs
- [ ] Basic gossip CRUD operations
- [ ] Buzz transaction system

### Phase 2: Real-time Features (Week 3)
- [ ] Django Channels setup
- [ ] WebSocket messaging
- [ ] Online status tracking
- [ ] Push notifications

### Phase 3: Frontend Integration (Week 4)
- [ ] Replace mock API calls
- [ ] Implement state management
- [ ] Add error handling
- [ ] Image upload functionality

### Phase 4: Testing & Optimization (Week 5)
- [ ] Unit tests (80% coverage)
- [ ] Integration tests
- [ ] Performance optimization
- [ ] Security audit

### Phase 5: Deployment (Week 6)
- [ ] CI/CD pipeline setup
- [ ] Staging environment
- [ ] Production deployment
- [ ] Monitoring & logging

### Critical Path Items
1. **Authentication system** - Blocks all user features
2. **Profile claiming** - Core differentiator
3. **Gossip feed** - Main content delivery
4. **Buzz economy** - Engagement driver
5. **Real-time messaging** - User retention

### MVP Definition
- Phone authentication ✓
- Profile discovery & claiming ✓
- Anonymous gossip posting ✓
- Basic buzz system ✓
- Simple messaging ✓

### Post-MVP Features
- Advanced moderation tools
- Analytics dashboard
- Sponsored content
- Premium features
- Social media verification
- Content recommendations

---

## Notes & Considerations

### Security
- Rate limiting on all endpoints
- Phone number validation
- Content filtering for inappropriate language
- CORS configuration for mobile app
- JWT token rotation
- SQL injection prevention via ORM

### Performance
- Database indexing on frequently queried fields
- Redis caching for hot data
- Pagination on all list endpoints
- Image compression and CDN delivery
- Query optimization with select_related/prefetch_related

### Scalability
- Horizontal scaling with load balancer
- Database read replicas
- Redis cluster for caching
- S3/CloudFront for media
- Message queue for async tasks

### Monitoring
- Sentry for error tracking
- CloudWatch/Datadog for metrics
- ELK stack for logging
- APM for performance monitoring
- Custom dashboard for business metrics