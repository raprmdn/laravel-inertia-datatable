import { Form, Head } from '@inertiajs/react';
import { useRef } from 'react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import ManagePasskeys from '@/components/manage-passkeys';
import ManageTwoFactor from '@/components/manage-two-factor';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export default function Security(props) {
    const passwordInput = useRef(null);
    const currentPasswordInput = useRef(null);

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

                {/*<Form*/}
                {/*    {...SecurityController.update.form()}*/}
                {/*    options={{*/}
                {/*        preserveScroll: true,*/}
                {/*    }}*/}
                {/*    resetOnError={[*/}
                {/*        'password',*/}
                {/*        'password_confirmation',*/}
                {/*        'current_password',*/}
                {/*    ]}*/}
                {/*    resetOnSuccess*/}
                {/*    onError={(errors) => {*/}
                {/*        if (errors.password) {*/}
                {/*            passwordInput.current?.focus();*/}
                {/*        }*/}

                {/*        if (errors.current_password) {*/}
                {/*            currentPasswordInput.current?.focus();*/}
                {/*        }*/}
                {/*    }}*/}
                {/*    className="space-y-6"*/}
                {/*>*/}
                {/*    {({ errors, processing }) => (*/}
                {/*        <>*/}
                {/*            <div className="grid gap-2">*/}
                {/*                <Label htmlFor="current_password">*/}
                {/*                    Current password*/}
                {/*                </Label>*/}

                {/*                <PasswordInput*/}
                {/*                    id="current_password"*/}
                {/*                    ref={currentPasswordInput}*/}
                {/*                    name="current_password"*/}
                {/*                    className="mt-1 block w-full"*/}
                {/*                    autoComplete="current-password"*/}
                {/*                    placeholder="Current password"*/}
                {/*                />*/}

                {/*                <InputError message={errors.current_password} />*/}
                {/*            </div>*/}

                {/*            <div className="grid gap-2">*/}
                {/*                <Label htmlFor="password">New password</Label>*/}

                {/*                <PasswordInput*/}
                {/*                    id="password"*/}
                {/*                    ref={passwordInput}*/}
                {/*                    name="password"*/}
                {/*                    className="mt-1 block w-full"*/}
                {/*                    autoComplete="new-password"*/}
                {/*                    placeholder="New password"*/}
                {/*                    passwordrules={props.passwordRules}*/}
                {/*                />*/}

                {/*                <InputError message={errors.password} />*/}
                {/*            </div>*/}

                {/*            <div className="grid gap-2">*/}
                {/*                <Label htmlFor="password_confirmation">*/}
                {/*                    Confirm password*/}
                {/*                </Label>*/}

                {/*                <PasswordInput*/}
                {/*                    id="password_confirmation"*/}
                {/*                    name="password_confirmation"*/}
                {/*                    className="mt-1 block w-full"*/}
                {/*                    autoComplete="new-password"*/}
                {/*                    placeholder="Confirm password"*/}
                {/*                    passwordrules={props.passwordRules}*/}
                {/*                />*/}

                {/*                <InputError*/}
                {/*                    message={errors.password_confirmation}*/}
                {/*                />*/}
                {/*            </div>*/}

                {/*            <div className="flex items-center gap-4">*/}
                {/*                <Button*/}
                {/*                    disabled={processing}*/}
                {/*                    data-test="update-password-button"*/}
                {/*                >*/}
                {/*                    Save*/}
                {/*                </Button>*/}
                {/*            </div>*/}
                {/*        </>*/}
                {/*    )}*/}
                {/*</Form>*/}
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

Security.layout = {
    breadcrumbs: [
        {
            title: 'Security settings',
            href: route('security.edit'),
        },
    ],
};
