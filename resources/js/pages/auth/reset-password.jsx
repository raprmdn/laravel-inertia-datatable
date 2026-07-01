import { Head, useForm } from '@inertiajs/react';
import InputError from '@/components/input-error';
import ButtonWithLoading from '@/components/button-with-loading.jsx';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout.jsx';
import { __ } from '@/lib/lang.jsx';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useState } from 'react';

export default function ResetPassword({ token, email, passwordRules }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token,
        email,
        password: '',
        password_confirmation: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);

    const submit = (e) => {
        e.preventDefault();

        post(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title={__('Reset Password')} />

            <div className="mx-auto w-full max-w-md">
                <div>
                    <img
                        alt="Logo"
                        src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                        className="h-10 w-auto"
                    />

                    <h2 className="mt-8 text-2xl/9 font-bold tracking-tight text-gray-900">
                        {__('Reset Password')} 🔐
                    </h2>

                    <p className="mt-2 text-sm/6 text-gray-500">
                        {__('Please enter your new password below.')}
                    </p>
                </div>

                <div className="mt-10">
                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="email">{__('Email')}</Label>
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                autoComplete="email"
                                readOnly
                                aria-invalid={!!errors.email}
                            />
                            <InputError message={errors.email} />
                        </div>

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
                                    autoComplete="new-password"
                                    autoFocus
                                    placeholder={__('Enter :key', {
                                        key: __('Password'),
                                    })}
                                    passwordrules={passwordRules}
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

                        <div className="grid gap-2">
                            <Label htmlFor="password_confirmation">
                                {__('Confirm Password')}
                            </Label>

                            <div className="relative">
                                <Input
                                    id="password_confirmation"
                                    type={
                                        showConfirmation ? 'text' : 'password'
                                    }
                                    value={data.password_confirmation}
                                    onChange={(e) =>
                                        setData(
                                            'password_confirmation',
                                            e.target.value,
                                        )
                                    }
                                    autoComplete="new-password"
                                    placeholder={__('Confirm :key', {
                                        key: __('Password'),
                                    })}
                                    passwordrules={passwordRules}
                                    aria-invalid={
                                        !!errors.password_confirmation
                                    }
                                />

                                <button
                                    type="button"
                                    tabIndex={-1}
                                    onClick={() =>
                                        setShowConfirmation(!showConfirmation)
                                    }
                                    className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    {showConfirmation ? (
                                        <EyeOffIcon className="size-4" />
                                    ) : (
                                        <EyeIcon className="size-4" />
                                    )}
                                </button>
                            </div>

                            <InputError
                                message={errors.password_confirmation}
                            />
                        </div>

                        <ButtonWithLoading
                            type="submit"
                            className="h-10 w-full"
                            processing={processing}
                            label={__('Reset Password')}
                            data-test="reset-password-button"
                        />
                    </form>
                </div>
            </div>
        </>
    );
}

ResetPassword.layout = AuthLayout;
