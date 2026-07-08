import { Head, setLayoutProps, useForm } from '@inertiajs/react';
import { useRef } from 'react';
import ButtonWithLoading from '@/components/button-with-loading';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import ManagePasskeys from '@/components/manage-passkeys';
import ManageTwoFactor from '@/components/manage-two-factor';
import PasswordInput from '@/components/password-input';
import { Label } from '@/components/ui/label';
import DashboardLayout from '@/layouts/dashboard-layout.jsx';
import SettingsLayout from '@/layouts/settings/layout.jsx';
import { __ } from '@/lib/lang.jsx';

export default function Security(props) {
    const passwordInput = useRef(null);
    const currentPasswordInput = useRef(null);
    const { data, setData, put, processing, errors, reset } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        put(route('user-password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                reset('password', 'password_confirmation', 'current_password');

                if (errors.password) {
                    passwordInput.current?.focus();
                }

                if (errors.current_password) {
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    setLayoutProps({
        breadcrumbs: [
            { title: __('Settings') },
            { title: __('Security'), href: route('security.edit') },
        ],
    });

    return (
        <>
            <Head title="Security settings" />

            <h1 className="sr-only">Security settings</h1>

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title="Update password"
                    description="Ensure your account is using a long, random password to stay secure"
                />

                <form onSubmit={submit} className="space-y-6">
                    <div className="grid gap-2">
                        <Label htmlFor="current_password">
                            Current password
                        </Label>

                        <PasswordInput
                            id="current_password"
                            ref={currentPasswordInput}
                            name="current_password"
                            className="mt-1 block w-full"
                            autoComplete="current-password"
                            placeholder="Current password"
                            value={data.current_password}
                            onChange={(e) =>
                                setData('current_password', e.target.value)
                            }
                            aria-invalid={!!errors.current_password}
                        />

                        <InputError message={errors.current_password} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password">New password</Label>

                        <PasswordInput
                            id="password"
                            ref={passwordInput}
                            name="password"
                            className="mt-1 block w-full"
                            autoComplete="new-password"
                            placeholder="New password"
                            passwordrules={props.passwordRules}
                            value={data.password}
                            onChange={(e) =>
                                setData('password', e.target.value)
                            }
                            aria-invalid={!!errors.password}
                        />

                        <InputError message={errors.password} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation">
                            Confirm password
                        </Label>

                        <PasswordInput
                            id="password_confirmation"
                            name="password_confirmation"
                            className="mt-1 block w-full"
                            autoComplete="new-password"
                            placeholder="Confirm password"
                            passwordrules={props.passwordRules}
                            value={data.password_confirmation}
                            onChange={(e) =>
                                setData('password_confirmation', e.target.value)
                            }
                            aria-invalid={!!errors.password_confirmation}
                        />

                        <InputError message={errors.password_confirmation} />
                    </div>

                    <div className="flex items-center gap-4">
                        <ButtonWithLoading
                            type="submit"
                            processing={processing}
                            label="Save"
                            data-test="update-password-button"
                        />
                    </div>
                </form>
            </div>

            <ManageTwoFactor
                canManageTwoFactor={props.canManageTwoFactor}
                requiresConfirmation={props.requiresConfirmation}
                twoFactorEnabled={props.twoFactorEnabled}
            />

            <ManagePasskeys
                canManagePasskeys={props.canManagePasskeys}
                passkeys={props.passkeys}
            />
        </>
    );
}

Security.layout = [DashboardLayout, SettingsLayout];
