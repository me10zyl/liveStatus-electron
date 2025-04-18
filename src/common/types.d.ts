export type PlatformType = 'douyu' | 'bilibili' | 'huya' | 'douyin';
export interface Streamer {
    id: string;
    platform: PlatformType;
    name: string;
    avatar: string;
    isLive: boolean;
    roomId: string;
    roomUrl: string;
    title?: string;
    category?: string;
    viewerCount?: number;
    startTime?: string;
    description?: string;
}
export interface PlatformSettings {
    platform: PlatformType;
    enabled: boolean;
    cookie: string;
    username?: string;
}
export interface AppSettings {
    platforms: Record<PlatformType, PlatformSettings>;
    refreshInterval: number;
    notifications: boolean;
    autoLaunch: boolean;
    startMinimized: boolean;
}
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}
