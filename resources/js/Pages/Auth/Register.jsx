import { useEffect } from 'react';
import InputError from '@/Components/Form/InputError';
import { Head, Link, useForm } from '@inertiajs/react';
import Guest from "@/Layouts/Guest.jsx";
import { Label } from "@/shadcn/ui/label.jsx";
import { Input } from "@/shadcn/ui/input.jsx";
import ButtonWithLoading from "@/Components/Button/ButtonWithLoading.jsx";

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
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

        post(route('register'));
    };

    return (
        <>
            <Head title="Sign Up"/>

            <div className="w-full max-w-md space-y-6">
                <div className="space-y-2 text-center">
                    <h1 className="text-3xl font-bold">
                        Sign Up
                    </h1>
                    <p className="text-gray-500">
                        Create an account to get started
                    </p>
                </div>
                <form onSubmit={submit}>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                type="text"
                                autoComplete="off"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                            />
                            <InputError message={errors.name}/>
                        </div>

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
                            label="Sign up"
                        />
                    </div>
                </form>
                <div className="space-y-4">
                    <div className="text-center text-sm text-gray-500">
                        Already have an account?
                        <Link className="font-medium underline ml-1" href={route('login')}>
                            Sign in
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}

Register.layout = (page) => <Guest children={page}/>
