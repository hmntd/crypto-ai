import { Transition } from '@headlessui/react';
import { Form, Head, usePage } from '@inertiajs/react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import type { BreadcrumbItem, SharedData } from '@/types';
import IntegrationController from '@/actions/App/Http/Controllers/Settings/IntegrationController';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Integrations',
        href: '/settings/integrations',
    },
];

export default function Integrations() {
    const { auth } = usePage<SharedData>().props;

    const settings = auth.user.notification_settings?.[0] ?? {
        notifications_enabled: false,
        telegram_user_id: '',
        slack_user_id: '',
        scheduled_time: '09:00'
    };

    const [isEnabled, setIsEnabled] = useState(!!settings.notifications_enabled);

    const [testing, setTesting] = useState<string | null>(null);

    const handleTest = async (provider: 'telegram' | 'slack') => {
        const inputElement = document.getElementById(`${provider}_user_id`) as HTMLInputElement;
        const value = inputElement?.value;

        if (!value) {
            alert(`Please enter a ${provider} ID first.`);
            return;
        }

        setTesting(provider);

        try {
            const response = await fetch(`/settings/integrations/test/${provider}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ key: value }),
            });

            const result = await response.json();

            if (result.success) {
                alert('✅ ' + result.message);
            } else {
                alert('❌ ' + result.message);
            }
        } catch (e) {
            alert('🚫 Connection failed. Could not reach the server.');
        } finally {
            setTesting(null);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Integrations" />

            <SettingsLayout>
                <div className="space-y-6">
                    <Heading
                        variant="small"
                        title="Notification Integrations"
                        description="Configure where and when you receive AI crypto alerts."
                    />

                    <Form
                        {...IntegrationController.update.form()}
                        options={{
                            preserveScroll: true,
                        }}
                        className="space-y-6"
                    >
                        {({ processing, recentlySuccessful, errors }: any) => {

                            return (
                                <>
                                    <div className="flex items-center justify-between rounded-lg border p-4 shadow-sm bg-card">
                                        <div className="space-y-0.5">
                                            <Label htmlFor="notifications_enabled">Enable Notifications</Label>
                                            <p className="text-sm text-muted-foreground">
                                                Status: {isEnabled ? 'Active' : 'Disabled'}
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => setIsEnabled(!isEnabled)}
                                            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${isEnabled ? 'bg-primary' : 'bg-muted'
                                                }`}
                                        >
                                            <span
                                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background transition duration-200 ease-in-out ${isEnabled ? 'translate-x-5' : 'translate-x-0'
                                                    }`}
                                            />
                                        </button>
                                        <input type="hidden" name="notifications_enabled" value={isEnabled ? 1 : 0} />
                                    </div>

                                    <div className="grid gap-2">
                                        <div className="flex flex-col gap-1">
                                            <Label htmlFor="telegram_user_id">Telegram User ID</Label>
                                            <p className="text-xs text-muted-foreground">
                                                Get your ID by sending a message to <span className="font-medium text-foreground">@userinfobot</span>
                                            </p>
                                        </div>
                                        <div className="relative">
                                            <Input
                                                id="telegram_user_id"
                                                name="telegram_user_id"
                                                className="block w-full pr-10"
                                                defaultValue={settings.telegram_user_id ?? ''}
                                                placeholder="e.g. 123456789"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleTest('telegram')}
                                                disabled={testing === 'telegram'}
                                                className="absolute right-1.5 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-md border bg-muted text-xs font-bold transition-all hover:bg-primary hover:text-primary-foreground cursor-pointer disabled:opacity-50"
                                            >
                                                {testing === 'telegram' ? '...' : '!'}
                                            </button>
                                        </div>
                                        <InputError message={errors.telegram_user_id} />
                                    </div>

                                    <div className="grid gap-2">
                                        <div className="flex flex-col gap-1">
                                            <Label htmlFor="slack_user_id">Slack User ID</Label>
                                            <p className="text-xs text-muted-foreground">
                                                Profile &gt; More (three dots) &gt; <span className="font-medium text-foreground">Copy member ID</span>
                                            </p>
                                        </div>
                                        <div className="relative">
                                            <Input
                                                id="slack_user_id"
                                                name="slack_user_id"
                                                className="block w-full pr-10"
                                                defaultValue={settings.slack_user_id ?? ''}
                                                placeholder="e.g. U12345678"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleTest('slack')}
                                                disabled={testing === 'slack'}
                                                className="absolute right-1.5 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-md border bg-muted text-xs font-bold transition-all hover:bg-primary hover:text-primary-foreground cursor-pointer disabled:opacity-50"
                                            >
                                                {testing === 'slack' ? '...' : '!'}
                                            </button>
                                        </div>
                                        <InputError message={errors.slack_user_id} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="scheduled_time">Daily Report Time</Label>
                                        <Input
                                            id="scheduled_time"
                                            name="scheduled_time"
                                            type="time"
                                            className="mt-1 block w-32"
                                            defaultValue={settings?.scheduled_time?.substring(0, 5) ?? '09:00'}
                                        />
                                        <InputError message={errors.scheduled_time} />
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <Button disabled={processing}>Save Changes</Button>
                                        <Transition show={recentlySuccessful}>
                                            <p className="text-sm text-green-500">Saved</p>
                                        </Transition>
                                    </div>
                                </>
                            );
                        }}
                    </Form>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}