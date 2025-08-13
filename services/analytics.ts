interface AnalyticsEvent {
    name: string;
    properties?: Record<string, any>;
    timestamp: Date;
    userId?: string;
    sessionId: string;
}

type EventName = 
    // Auth events
    | 'auth_phone_submit'
    | 'auth_otp_submit'
    | 'auth_google_signin'
    | 'auth_logout'
    
    // Discovery events
    | 'search_query'
    | 'profile_view'
    | 'channel_switch'
    | 'trending_profile_tap'
    
    // Create events
    | 'compose_open'
    | 'compose_post'
    | 'reply_posted'
    
    // Channel events
    | 'channel_create_open'
    | 'channel_create_confirmed'
    | 'channel_create_blocked'
    | 'channel_disabled_by_owner'
    | 'channel_merged_by_owner'
    
    // Buzz events
    | 'buzz_earned'
    | 'buzz_spent_channel_create'
    | 'buzz_spent_cosmetic'
    | 'buzz_history_viewed'
    
    // Safety events
    | 'report_submit'
    | 'owner_hide'
    | 'user_blocked'
    | 'keyword_filter_added'
    
    // Social events
    | 'social_account_connected'
    | 'social_account_disconnected'
    | 'profile_claimed'
    
    // Navigation events
    | 'tab_switched'
    | 'drawer_opened'
    | 'settings_opened';

class AnalyticsService {
    private static instance: AnalyticsService;
    private sessionId: string;
    private userId?: string;
    private eventQueue: AnalyticsEvent[] = [];
    private flushInterval: NodeJS.Timeout | null = null;
    private isDebug: boolean = __DEV__;
    
    private constructor() {
        this.sessionId = this.generateSessionId();
        this.startFlushInterval();
    }
    
    static getInstance(): AnalyticsService {
        if (!AnalyticsService.instance) {
            AnalyticsService.instance = new AnalyticsService();
        }
        return AnalyticsService.instance;
    }
    
    private generateSessionId(): string {
        return `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    }
    
    private startFlushInterval(): void {
        // Flush events every 30 seconds
        this.flushInterval = setInterval(() => {
            this.flushEvents();
        }, 30000);
    }
    
    setUserId(userId: string): void {
        this.userId = userId;
    }
    
    track(eventName: EventName, properties?: Record<string, any>): void {
        const event: AnalyticsEvent = {
            name: eventName,
            properties: {
                ...properties,
                platform: 'mobile',
                app_version: '1.0.0',
            },
            timestamp: new Date(),
            userId: this.userId,
            sessionId: this.sessionId,
        };
        
        this.eventQueue.push(event);
        
        if (this.isDebug) {
            console.log('📊 Analytics Event:', {
                name: eventName,
                properties,
                timestamp: event.timestamp.toISOString(),
            });
        }
        
        // Flush immediately for critical events
        const criticalEvents: EventName[] = [
            'auth_logout',
            'report_submit',
            'profile_claimed',
            'channel_create_confirmed'
        ];
        
        if (criticalEvents.includes(eventName)) {
            this.flushEvents();
        }
    }
    
    trackScreenView(screenName: string, properties?: Record<string, any>): void {
        this.track('profile_view' as EventName, {
            screen_name: screenName,
            ...properties,
        });
    }
    
    trackTiming(category: string, value: number, name?: string): void {
        const event: AnalyticsEvent = {
            name: 'timing_event' as EventName,
            properties: {
                category,
                value,
                name,
            },
            timestamp: new Date(),
            userId: this.userId,
            sessionId: this.sessionId,
        };
        
        this.eventQueue.push(event);
    }
    
    private async flushEvents(): Promise<void> {
        if (this.eventQueue.length === 0) return;
        
        const eventsToSend = [...this.eventQueue];
        this.eventQueue = [];
        
        try {
            // In production, this would send to your analytics backend
            if (!this.isDebug) {
                await this.sendToBackend(eventsToSend);
            } else {
                console.log(`📊 Flushing ${eventsToSend.length} analytics events`);
            }
        } catch (error) {
            // Re-add events to queue if sending failed
            this.eventQueue.unshift(...eventsToSend);
            console.error('Failed to flush analytics events:', error);
        }
    }
    
    private async sendToBackend(events: AnalyticsEvent[]): Promise<void> {
        // Mock API call - replace with actual analytics endpoint
        const response = await fetch('https://api.rumoro.app/analytics/events', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                events,
                session_id: this.sessionId,
                user_id: this.userId,
            }),
        });
        
        if (!response.ok) {
            throw new Error(`Analytics API error: ${response.status}`);
        }
    }
    
    // Helper methods for common events
    trackAuth(action: 'phone_submit' | 'otp_submit' | 'google_signin' | 'logout'): void {
        this.track(`auth_${action}` as EventName);
    }
    
    trackBuzz(
        action: 'earned' | 'spent',
        amount: number,
        reason: string,
        metadata?: Record<string, any>
    ): void {
        const eventName = action === 'earned' ? 'buzz_earned' : 
                         reason === 'channel_create' ? 'buzz_spent_channel_create' :
                         'buzz_spent_cosmetic';
        
        this.track(eventName as EventName, {
            amount,
            reason,
            ...metadata,
        });
    }
    
    trackSafety(
        action: 'report' | 'hide' | 'block',
        targetType: string,
        targetId: string,
        reason?: string
    ): void {
        const eventMap = {
            report: 'report_submit',
            hide: 'owner_hide',
            block: 'user_blocked',
        };
        
        this.track(eventMap[action] as EventName, {
            target_type: targetType,
            target_id: targetId,
            reason,
        });
    }
    
    trackSearch(query: string, filters?: Record<string, any>): void {
        this.track('search_query', {
            query,
            query_length: query.length,
            has_filters: !!filters && Object.keys(filters).length > 0,
            ...filters,
        });
    }
    
    trackCompose(
        action: 'open' | 'post' | 'cancel',
        channelId?: string,
        contentLength?: number
    ): void {
        if (action === 'open') {
            this.track('compose_open', { channel_id: channelId });
        } else if (action === 'post') {
            this.track('compose_post', {
                channel_id: channelId,
                content_length: contentLength,
                has_warning: false,
            });
        }
    }
    
    trackSocial(
        platform: 'instagram' | 'twitter' | 'snapchat',
        action: 'connected' | 'disconnected'
    ): void {
        this.track(
            action === 'connected' ? 'social_account_connected' : 'social_account_disconnected',
            { platform }
        );
    }
    
    // Session management
    startNewSession(): void {
        this.sessionId = this.generateSessionId();
        this.flushEvents();
    }
    
    endSession(): void {
        this.flushEvents();
        if (this.flushInterval) {
            clearInterval(this.flushInterval);
            this.flushInterval = null;
        }
    }
}

// Export singleton instance
export const Analytics = AnalyticsService.getInstance();

// Export types
export type { AnalyticsEvent, EventName };