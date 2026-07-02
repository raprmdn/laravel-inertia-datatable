import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/components/input-error';
import ButtonWithLoading from '@/components/button-with-loading.jsx';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout.jsx';
import { __ } from '@/lib/lang.jsx';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.email'), {
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title={__('Forgot Password')} />

            <div className="mx-auto w-full max-w-md">
                <div>
                    <img
                        alt="Logo"
                        src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                        className="h-10 w-auto"
                    />

                    <h2 className="mt-8 text-2xl/9 font-bold tracking-tight text-gray-900 dark:text-white">
                        {__('Forgot Password?')} 🔑
                    </h2>

                    <p className="mt-2 text-sm/6 text-gray-500">
                        {__('Remember your password?')}{' '}
                        <Link
                            href={route('login')}
                            className="font-medium text-primary hover:text-primary/80"
                        >
                            {__('Sign in')}
                        </Link>
                    </p>

                    <p className="mt-2 text-sm/6 text-gray-500">
                        {__(
                            'Enter your email to receive a password reset link.',
                        )}
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
                                onChange={(e) =>
                                    setData('email', e.target.value)
                                }
                                autoComplete="off"
                                autoFocus
                                placeholder={__('Enter :key', {
                                    key: __('Email'),
                                })}
                                aria-invalid={!!errors.email}
                            />

                            <InputError message={errors.email} />
                        </div>

                        <ButtonWithLoading
                            type="submit"
                            className="h-10 w-full"
                            processing={processing}
                            label={__('Email password reset link')}
                            data-test="email-password-reset-link-button"
                        />
                    </form>

                    {status && (
                        <div className="mt-6 text-center text-sm font-medium text-green-600">
                            {status}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

ForgotPassword.layout = AuthLayout;
