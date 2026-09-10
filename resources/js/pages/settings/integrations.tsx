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
import { toast } from 'react-toastify';
import { Clock, Send, BellRing, Sparkles } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Integrations',
        href: '/settings/integrations',
    },
];

const PRESET_TIMES = [
    { label: '8:00 AM', value: '08:00' },
    { label: '9:00 AM', value: '09:00' },
    { label: '12:00 PM', value: '12:00' },
    { label: '6:00 PM', value: '18:00' },
    { label: '9:00 PM', value: '21:00' },
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
    const [selectedTime, setSelectedTime] = useState<string>(settings?.scheduled_time?.substring(0, 5) ?? '09:00');
    const [testing, setTesting] = useState<string | null>(null);

    const handleTest = async (provider: 'telegram' | 'slack') => {
        const inputElement = document.getElementById(`${provider}_user_id`) as HTMLInputElement;
        const value = inputElement?.value;

        if (!value) {
            toast.error(`Please enter a ${provider} ID first.`);
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
                toast.success(result.message);
            } else {
                toast.error(result.message);
            }
        } catch (e) {
            toast.error('Connection failed. Could not reach the server.');
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
                        description="Configure where and when you receive AI crypto alerts & favorite coin reports."
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
                                    <div className="flex items-center justify-between rounded-xl border p-4 shadow-xs bg-card">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <BellRing className="w-4 h-4 text-emerald-500" />
                                                <Label htmlFor="notifications_enabled" className="font-semibold">Enable Notifications</Label>
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                Automatically send daily AI updates and favorite coin price movements.
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => setIsEnabled(!isEnabled)}
                                            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${isEnabled ? 'bg-emerald-500' : 'bg-muted'}`}
                                        >
                                            <span
                                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow-xs transition duration-200 ease-in-out ${isEnabled ? 'translate-x-5' : 'translate-x-0'}`}
                                            />
                                        </button>
                                        <input type="hidden" name="notifications_enabled" value={isEnabled ? 1 : 0} />
                                    </div>

                                    {/* Telegram Settings */}
                                    <div className="grid gap-2 p-4 rounded-xl border bg-card/50">
                                        <div className="flex flex-col gap-1">
                                            <Label htmlFor="telegram_user_id" className="font-semibold">Telegram Integration</Label>
                                            <p className="text-xs text-muted-foreground">
                                                Get your Telegram ID by chatting with <span className="font-semibold text-foreground">@userinfobot</span>
                                            </p>
                                        </div>
                                        <div className="relative mt-1">
                                            <Input
                                                id="telegram_user_id"
                                                name="telegram_user_id"
                                                className="block w-full pr-24 font-mono text-sm"
                                                defaultValue={settings.telegram_user_id ?? ''}
                                                placeholder="e.g. 123456789"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleTest('telegram')}
                                                disabled={testing === 'telegram'}
                                                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 text-xs font-semibold rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-all cursor-pointer disabled:opacity-50"
                                            >
                                                {testing === 'telegram' ? 'Testing...' : 'Test Telegram'}
                                            </button>
                                        </div>
                                        <InputError message={errors.telegram_user_id} />
                                    </div>

                                    {/* Slack Settings */}
                                    <div className="grid gap-2 p-4 rounded-xl border bg-card/50">
                                        <div className="flex flex-col gap-1">
                                            <Label htmlFor="slack_user_id" className="font-semibold">Slack Integration</Label>
                                            <p className="text-xs text-muted-foreground">
                                                Slack profile &gt; More &gt; <span className="font-semibold text-foreground">Copy member ID</span>
                                            </p>
                                        </div>
                                        <div className="relative mt-1">
                                            <Input
                                                id="slack_user_id"
                                                name="slack_user_id"
                                                className="block w-full pr-24 font-mono text-sm"
                                                defaultValue={settings.slack_user_id ?? ''}
                                                placeholder="e.g. U12345678"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleTest('slack')}
                                                disabled={testing === 'slack'}
                                                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 text-xs font-semibold rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-all cursor-pointer disabled:opacity-50"
                                            >
                                                {testing === 'slack' ? 'Testing...' : 'Test Slack'}
                                            </button>
                                        </div>
                                        <InputError message={errors.slack_user_id} />
                                    </div>

                                    {/* Enhanced Daily Report Timepicker */}
                                    <div className="grid gap-3 p-4 rounded-xl border bg-card">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-primary" />
                                            <Label htmlFor="scheduled_time" className="font-semibold">Daily Report Schedule</Label>
                                        </div>
                                        
                                        <p className="text-xs text-muted-foreground">
                                            Select the exact time when daily price summaries & AI market signals will be dispatched to your enabled channels.
                                        </p>

                                        <div className="flex flex-wrap items-center gap-3 mt-1">
                                            <div className="relative">
                                                <Input
                                                    id="scheduled_time"
                                                    name="scheduled_time"
                                                    type="time"
                                                    value={selectedTime}
                                                    onChange={(e) => setSelectedTime(e.target.value)}
                                                    className="w-36 font-mono text-sm font-semibold cursor-pointer"
                                                />
                                            </div>

                                            <div className="flex flex-wrap items-center gap-1.5">
                                                {PRESET_TIMES.map((preset) => (
                                                    <button
                                                        key={preset.value}
                                                        type="button"
                                                        onClick={() => setSelectedTime(preset.value)}
                                                        className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer border ${
                                                            selectedTime === preset.value
                                                                ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                                                                : 'bg-muted/50 text-muted-foreground border-border hover:bg-muted hover:text-foreground'
                                                        }`}
                                                    >
                                                        {preset.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 text-xs font-mono text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-lg w-fit mt-1">
                                            <Sparkles className="w-3.5 h-3.5" />
                                            <span>Report delivery scheduled daily at <strong>{selectedTime}</strong></span>
                                        </div>

                                        <InputError message={errors.scheduled_time} />
                                    </div>

                                    <div className="flex items-center gap-4 pt-2">
                                        <Button disabled={processing} className="cursor-pointer">Save Preferences</Button>
                                        <Transition show={recentlySuccessful}>
                                            <p className="text-sm font-medium text-emerald-500">Settings saved successfully!</p>
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