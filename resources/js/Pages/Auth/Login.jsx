import { useEffect } from 'react';
import InputError from '@/Components/Form/InputError';
import { Head, Link, useForm } from '@inertiajs/react';
import Guest from "@/Layouts/Guest.jsx";
import { Label } from "@/shadcn/ui/label"
import { Input } from "@/shadcn/ui/input"
import ButtonWithLoading from "@/Components/Button/ButtonWithLoading.jsx";

export default function Login() {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();

        post(route('login'));
    };

    return (
        <>
            <Head title="Sign in" />

            <div className="w-full max-w-md space-y-6">
                <div className="space-y-2 text-center">
                    <h1 className="text-3xl font-bold">
                        Welcome Back
                    </h1>
                    <p className="text-gray-500">
                        Enter your email and password to sign in
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
                            <InputError message={errors.email} />
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
                            <InputError message={errors.password} />
                        </div>

                        <ButtonWithLoading
                            className="w-full"
                            type="submit"
                            processing={processing}
                            label="Sign in"
                        />
                    </div>
                </form>
                <div className="space-y-4">
                    <div className="text-center text-sm text-gray-500">
                        Don't have an account?
                        <Link className="font-medium underline ml-1" href={route('register')}>
                            Sign up
                        </Link>
                    </div>

                    <div className="text-center text-sm text-gray-500">
                        <Link
                            href={route('password.request')}
                            className="hover:underline"
                        >
                            Forgot your password?
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}

Login.layout = (page) => <Guest children={page}/>
