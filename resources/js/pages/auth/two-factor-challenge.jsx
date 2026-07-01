import { Head, useForm } from '@inertiajs/react';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { useState } from 'react';
import InputError from '@/components/input-error';
import ButtonWithLoading from '@/components/button-with-loading.jsx';
import { Input } from '@/components/ui/input';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from '@/components/ui/input-otp';
import { Label } from '@/components/ui/label';
import { OTP_MAX_LENGTH } from '@/hooks/use-two-factor-auth';
import AuthLayout from '@/layouts/auth-layout.jsx';
import { __ } from '@/lib/lang.jsx';

export default function TwoFactorChallenge() {
    const [showRecoveryInput, setShowRecoveryInput] = useState(false);
    const { data, setData, post, processing, errors, clearErrors, reset } =
        useForm({
            code: '',
            recovery_code: '',
        });

    const authConfigContent = showRecoveryInput
        ? {
              title: __('Recovery Code'),
              heading: __('Recovery Code') + ' 🧾',
              description: __(
                  'Please confirm access to your account by entering one of your emergency recovery codes.',
              ),
              toggleText: __('Use an authentication code'),
          }
        : {
              title: __('Two-Factor Authentication'),
              heading: __('Authentication Code') + ' 🔐',
              description: __(
                  'Enter the authentication code provided by your authenticator application.',
              ),
              toggleText: __('Use a recovery code'),
          };

    const toggleRecoveryMode = () => {
        setShowRecoveryInput(!showRecoveryInput);
        clearErrors();
        reset('code', 'recovery_code');
    };

    const submit = (e) => {
        e.preventDefault();

        post(route('two-factor.login.store'), {
            preserveScroll: true,
            onError: () => reset('code', 'recovery_code'),
            onSuccess: () => {
                if (!showRecoveryInput) {
                    reset('code');
                }
            },
        });
    };

    return (
        <>
            <Head title={authConfigContent.title} />

            <div className="mx-auto w-full max-w-md">
                <div>
                    <img
                        alt="Logo"
                        src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                        className="h-10 w-auto"
                    />

                    <h2 className="mt-8 text-2xl/9 font-bold tracking-tight text-gray-900">
                        {authConfigContent.heading}
                    </h2>

                    <p className="mt-2 text-sm/6 text-gray-500">
                        {authConfigContent.description}
                    </p>

                    <p className="mt-2 text-sm/6 text-gray-500">
                        {__('Or you can')}{' '}
                        <button
                            type="button"
                            className="font-medium text-primary hover:text-primary/80"
                            onClick={toggleRecoveryMode}
                        >
                            {authConfigContent.toggleText}
                        </button>
                    </p>
                </div>

                <div className="mt-10">
                    <form onSubmit={submit} className="space-y-6">
                        {showRecoveryInput ? (
                            <div className="grid gap-2">
                                <Label htmlFor="recovery_code">
                                    {__('Recovery Code')}
                                </Label>
                                <Input
                                    id="recovery_code"
                                    type="text"
                                    value={data.recovery_code}
                                    onChange={(e) =>
                                        setData('recovery_code', e.target.value)
                                    }
                                    placeholder={__('Enter recovery code')}
                                    autoFocus={showRecoveryInput}
                                    required
                                    aria-invalid={!!errors.recovery_code}
                                />
                                <InputError message={errors.recovery_code} />
                            </div>
                        ) : (
                            <div className="grid gap-2">
                                <Label>{__('Authentication Code')}</Label>
                                <div className="flex w-full items-center justify-center">
                                    <InputOTP
                                        maxLength={OTP_MAX_LENGTH}
                                        value={data.code}
                                        onChange={(value) =>
                                            setData('code', value)
                                        }
                                        disabled={processing}
                                        pattern={REGEXP_ONLY_DIGITS}
                                        autoFocus
                                    >
                                        <InputOTPGroup>
                                            {Array.from(
                                                { length: OTP_MAX_LENGTH },
                                                (_, index) => (
                                                    <InputOTPSlot
                                                        key={index}
                                                        index={index}
                                                    />
                                                ),
                                            )}
                                        </InputOTPGroup>
                                    </InputOTP>
                                </div>
                                <InputError message={errors.code} />
                            </div>
                        )}

                        <ButtonWithLoading
                            type="submit"
                            className="h-10 w-full"
                            processing={processing}
                            label={__('Continue')}
                        />
                    </form>
                </div>
            </div>
        </>
    );
}

TwoFactorChallenge.layout = AuthLayout;
