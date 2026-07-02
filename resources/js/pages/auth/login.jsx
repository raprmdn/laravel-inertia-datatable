import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasskeyVerify from '@/components/passkey-verify';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout.jsx';
import { useEffect, useRef, useState } from 'react';
import { __ } from '@/lib/lang.jsx';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import ButtonWithLoading from '@/components/button-with-loading.jsx';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);
    const emailRef = useRef(null);
    const passwordRef = useRef(null);

    useEffect(() => {
        if (errors.email) {
            emailRef.current.focus();
        } else if (errors.password) {
            passwordRef.current.focus();
        }
    }, [errors]);

    const submit = (e) => {
        e.preventDefault();

        post(route('login.store'), {
            preserveState: true,
            preserveScroll: true,
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Sign In" />

            <PasskeyVerify />

            <div className="mx-auto w-full max-w-md">
                <div>
                    <img
                        alt="Logo"
                        src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                        className="h-10 w-auto"
                    />

                    <h2 className="mt-8 text-2xl/9 font-bold tracking-tight text-gray-900 dark:text-white">
                        {__('Welcome Back!')} 👋
                    </h2>

                    <p className="mt-2 text-sm/6 text-gray-500">
                        {__('Don’t have an account?')}{' '}
                        <Link
                            href={route('register')}
                            className="font-medium text-primary hover:text-primary/80"
                        >
                            {__('Sign up')}
                        </Link>
                    </p>
                </div>

                <div className="mt-10">
                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="email">{__('Email')}</Label>
                            <Input
                                ref={emailRef}
                                id="email"
                                type="text"
                                name="email"
                                autoComplete="off"
                                placeholder={__('Enter :key', { key: 'Email' })}
                                aria-invalid={!!errors.email}
                                value={data.email}
                                onChange={(e) =>
                                    setData('email', e.target.value)
                                }
                            />
                            <InputError message={errors.email} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password">{__('Password')}</Label>

                            <div className="relative">
                                <Input
                                    ref={passwordRef}
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder={__('Enter :key', {
                                        key: 'Password',
                                    })}
                                    aria-invalid={!!errors.password}
                                    value={data.password}
                                    onChange={(e) =>
                                        setData('password', e.target.value)
                                    }
                                />

                                <button
                                    type="button"
                                    className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                                    tabIndex={-1}
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    aria-hidden="true"
                                >
                                    {showPassword ? (
                                        <EyeOffIcon
                                            className="size-4"
                                            strokeWidth={2}
                                        />
                                    ) : (
                                        <EyeIcon
                                            className="size-4"
                                            strokeWidth={2}
                                        />
                                    )}
                                </button>
                            </div>

                            <InputError message={errors.password} />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="remember"
                                    checked={data.remember}
                                    onCheckedChange={(checked) =>
                                        setData('remember', Boolean(checked))
                                    }
                                />
                                <Label
                                    htmlFor="remember"
                                    className="cursor-pointer text-sm font-normal text-muted-foreground"
                                >
                                    {__('Remember me')}
                                </Label>
                            </div>

                            {canResetPassword && (
                                <Link
                                    tabIndex={-1}
                                    href={route('password.request')}
                                    className="text-sm font-normal text-muted-foreground hover:text-foreground"
                                >
                                    {__('Forgot Password?')}
                                </Link>
                            )}
                        </div>

                        <ButtonWithLoading
                            type="submit"
                            className="h-10 w-full"
                            processing={processing}
                            label={__('Sign In')}
                        />
                    </form>

                    <div className="mt-10">
                        <div className="relative">
                            <div
                                aria-hidden="true"
                                className="absolute inset-0 flex items-center"
                            >
                                <div className="w-full border-t border-gray-200" />
                            </div>

                            <div className="relative flex justify-center text-sm/6 font-medium">
                                <span className="bg-background px-6 text-muted-foreground">
                                    {__('Or continue with')}
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-4">
                            <Button
                                type="button"
                                variant="outline"
                                className="h-10 w-full gap-3"
                            >
                                Google
                            </Button>

                            <Button
                                type="button"
                                variant="outline"
                                className="h-10 w-full gap-3"
                            >
                                GitHub
                            </Button>
                        </div>
                    </div>
                </div>

                {status && (
                    <div className="mt-6 text-center text-sm font-medium text-green-600">
                        {status}
                    </div>
                )}
            </div>
        </>
    );
}

Login.layout = AuthLayout;
