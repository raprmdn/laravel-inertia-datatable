import { Head, useForm } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasskeyVerify from '@/components/passkey-verify';
import ButtonWithLoading from '@/components/button-with-loading.jsx';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout.jsx';
import { __ } from '@/lib/lang.jsx';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useState } from 'react';

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();

        post(route('password.confirm.store'), {
            preserveScroll: true,
            onSuccess: () => reset('password'),
        });
    };

    return (
        <>
            <Head title={__('Confirm Password')} />

            <div className="mx-auto w-full max-w-md">
                <div>
                    <img
                        alt="Logo"
                        src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                        className="h-10 w-auto"
                    />

                    <h2 className="mt-8 text-2xl/9 font-bold tracking-tight text-gray-900">
                        {__('Confirm Password')} 🔒
                    </h2>

                    <p className="mt-2 text-sm/6 text-gray-500">
                        {__(
                            'This is a secure area of the application. Please confirm your password before continuing.',
                        )}
                    </p>
                </div>

                <div className="mt-10">
                    <PasskeyVerify
                        routes={{
                            options: {
                                url: route('passkey.confirm-options'),
                            },
                            submit: {
                                url: route('passkey.confirm'),
                            },
                        }}
                        label={__('Confirm with passkey')}
                        loadingLabel={__('Confirming...')}
                        separator={__('Or confirm with password')}
                    />

                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="password">{__('Password')}</Label>

                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={data.password}
                                    onChange={(e) =>
                                        setData('password', e.target.value)
                                    }
                                    placeholder={__('Enter :key', {
                                        key: __('Password'),
                                    })}
                                    autoComplete="current-password"
                                    autoFocus
                                    aria-invalid={!!errors.password}
                                />

                                <button
                                    type="button"
                                    tabIndex={-1}
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    {showPassword ? (
                                        <EyeOffIcon className="size-4" />
                                    ) : (
                                        <EyeIcon className="size-4" />
                                    )}
                                </button>
                            </div>

                            <InputError message={errors.password} />
                        </div>

                        <ButtonWithLoading
                            type="submit"
                            className="h-10 w-full"
                            processing={processing}
                            label={__('Confirm Password')}
                            data-test="confirm-password-button"
                        />
                    </form>
                </div>
            </div>
        </>
    );
}

ConfirmPassword.layout = AuthLayout;
