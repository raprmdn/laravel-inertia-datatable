import { useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import Guest from "@/Layouts/Guest.jsx";
import { Label } from "@/shadcn/ui/label.jsx";
import { Input } from "@/shadcn/ui/input.jsx";
import InputError from "@/Components/Form/InputError.jsx";
import ButtonWithLoading from "@/Components/Button/ButtonWithLoading.jsx";

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();

        post(route('password.store'));
    };

    return (
        <>
            <Head title="Reset Password"/>

            <div className="w-full max-w-md space-y-6">
                <div className="space-y-2 text-center">
                    <h1 className="text-3xl font-bold">
                        Reset Password
                    </h1>
                    <p className="text-gray-500">
                        Enter your new password and confirm it to reset your password.
                    </p>
                </div>
                <form onSubmit={submit}>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                autoComplete="off"
                                value={data.email}
                                readOnly
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            <InputError message={errors.email}/>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                autoComplete="off"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                            />
                            <InputError message={errors.password}/>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password_confirmation">Password Confirmation</Label>
                            <Input
                                id="password_confirmation"
                                type="password"
                                autoComplete="off"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                            />
                            <InputError message={errors.password_confirmation}/>
                        </div>

                        <ButtonWithLoading
                            className="w-full"
                            type="submit"
                            processing={processing}
                            label="Reset Password"
                        />
                    </div>
                </form>
            </div>
        </>
    );
}

ResetPassword.layout = page => <Guest children={page} />;
