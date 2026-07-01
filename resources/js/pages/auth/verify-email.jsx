import { Head, Link, useForm } from '@inertiajs/react';
import ButtonWithLoading from '@/components/button-with-loading.jsx';
import AuthLayout from '@/layouts/auth-layout.jsx';
import { __ } from '@/lib/lang.jsx';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();

        post(route('verification.send'), {
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title={__('Email Verification')} />

            <div className="mx-auto w-full max-w-md">
                <div>
                    <img
                        alt="Logo"
                        src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                        className="h-10 w-auto"
                    />

                    <h2 className="mt-8 text-2xl/9 font-bold tracking-tight text-gray-900">
                        {__('Verify Email')} 📬
                    </h2>

                    <p className="mt-2 text-sm/6 text-gray-500">
                        {__(
                            'Please verify your email address by clicking on the link we just emailed to you.',
                        )}
                    </p>

                    <p className="mt-2 text-sm/6 text-gray-500">
                        {__('Wrong account?')}{' '}
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="font-medium text-primary hover:text-primary/80"
                        >
                            {__('Log out')}
                        </Link>
                    </p>
                </div>

                <div className="mt-10">
                    <form onSubmit={submit} className="space-y-6">
                        <ButtonWithLoading
                            type="submit"
                            className="h-10 w-full"
                            processing={processing}
                            label={__('Resend verification email')}
                        />
                    </form>

                    {status === 'verification-link-sent' && (
                        <div className="mt-6 text-center text-sm font-medium text-green-600">
                            {__(
                                'A new verification link has been sent to the email address you provided during registration.',
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

VerifyEmail.layout = AuthLayout;
