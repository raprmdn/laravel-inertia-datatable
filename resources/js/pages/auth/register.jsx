import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout.jsx';
import { useEffect, useRef, useState } from 'react';
import { __ } from '@/lib/lang.jsx';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import ButtonWithLoading from '@/components/button-with-loading.jsx';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);

    const refs = {
        name: useRef(null),
        email: useRef(null),
        password: useRef(null),
        password_confirmation: useRef(null),
    };

    useEffect(() => {
        const firstError = Object.keys(errors)[0];

        if (firstError && refs[firstError]) {
            refs[firstError].current?.focus();
        }
    }, [errors]);

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            preserveScroll: true,
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title={__('Create Account')} />

            <div className="mx-auto w-full max-w-md">
                <div>
                    <img
                        alt="Logo"
                        src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                        className="h-10 w-auto"
                    />

                    <h2 className="mt-8 text-2xl/9 font-bold tracking-tight text-gray-900 dark:text-white">
                        {__('Create Account')} 🎉
                    </h2>

                    <p className="mt-2 text-sm/6 text-gray-500">
                        {__('Already have an account?')}{' '}
                        <Link
                            href={route('login')}
                            className="font-medium text-primary hover:text-primary/80"
                        >
                            {__('Sign in')}
                        </Link>
                    </p>
                </div>

                <div className="mt-10">
                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="name">{__('Full Name')}</Label>
                            <Input
                                ref={refs.name}
                                id="name"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                placeholder={__('Enter :key', {
                                    key: __('Full Name'),
                                })}
                                aria-invalid={!!errors.name}
                            />
                            <InputError message={errors.name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email">{__('Email')}</Label>
                            <Input
                                ref={refs.email}
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData('email', e.target.value)
                                }
                                placeholder={__('Enter :key', {
                                    key: __('Email'),
                                })}
                                aria-invalid={!!errors.email}
                            />
                            <InputError message={errors.email} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password">{__('Password')}</Label>

                            <div className="relative">
                                <Input
                                    ref={refs.password}
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={data.password}
                                    onChange={(e) =>
                                        setData('password', e.target.value)
                                    }
                                    placeholder={__('Enter :key', {
                                        key: __('Password'),
                                    })}
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
                                    ref={refs.password_confirmation}
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
                                    placeholder={__('Confirm :key', {
                                        key: __('Password'),
                                    })}
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
                            label={__('Create Account')}
                        />
                    </form>
                </div>
            </div>
        </>
    );
}

Register.layout = AuthLayout;
