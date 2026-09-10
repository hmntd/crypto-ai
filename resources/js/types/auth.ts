export type User = {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    can_favourite_coins?: boolean;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
    notification_settings: NotificationSetting[];
};

export type Auth = {
    user: User;
};

export type TwoFactorSetupData = {
    svg: string;
    url: string;
};

export type TwoFactorSecretKey = {
    secretKey: string;
};

export type NotificationSetting = {
    id: number;
    user_id: number;
    slack_user_id: string;
    telegram_user_id: string;
    notifications_enabled: boolean;
    scheduled_time: string;
    created_at: string;
    updated_at: string;
};