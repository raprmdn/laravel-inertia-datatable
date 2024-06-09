import InputError from '@/Components/Form/InputError';
import { Head, useForm } from '@inertiajs/react';
import Guest from "@/Layouts/Guest.jsx";
import { Label } from "@/shadcn/ui/label.jsx";
import { Input } from "@/shadcn/ui/input.jsx";
import ButtonWithLoading from "@/Components/Button/ButtonWithLoading.jsx";

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.email'), {
            onSuccess: () => {
                reset();
            }
        });
    };

    return (
        <>
            <Head title="Forgot Password" />

            <div className="w-full max-w-md space-y-6">
                <div className="space-y-2 text-center">
                    <h1 className="text-3xl font-bold">
                        Forgot Password
                    </h1>
                    <p className="text-gray-500">
                        Forgot your password? No problem. Just let us know your email address and we will email you a password
                        reset link that will allow you to choose a new one.
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
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            <InputError message={errors.email}/>
                            {status && (
                                <div className="mb-4 text-sm text-green-500">
                                    {status}
                                </div>
                            )}
                        </div>

                        <ButtonWithLoading
                            className="w-full"
                            type="submit"
                            processing={processing}
                            label="Email Password Reset Link"
                        />
                    </div>
                </form>
            </div>
        </>
    );
}

ForgotPassword.layout = (page) => <Guest children={page}/>
