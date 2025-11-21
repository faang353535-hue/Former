'use client'
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authApi } from '@/lib/api';
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

interface FormValues {
    password: string;
    email: string;
}

interface valueStruct {
    password: string;
    email: string;
}

const storage = async (values: valueStruct, route: any) => {
    try {
        const { authApi } = await import('@/lib/api');
        await authApi.login(values.email, values.password);
        alert("Login Successfully!");
        route.push("/");
    }
    catch (err: any) {
        const errorMessage = err.response?.data?.data?.error || 'Login failed. Please try again.';
        alert(errorMessage);
    }
}

const validate = (values: FormValues) => {
    const errors: Partial<FormValues> = {};

    if (!values.email) {
        errors.email = 'Required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = 'Invalid Email address'
    }

    if (!values.password) {
        errors.password = 'Password can\'t  be Empty.'
    }



    return errors
}

const Login = () => {
    const route = useRouter()
    const { resolvedTheme } = useTheme();

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validate,
        onSubmit: values => {
            storage(values, route)
            console.log(values)
        },
    });

    const handleGoogleLogin = async () => {
        window.location.href = 'http://localhost:5000/auth/google/start?redirect=/';
    };

    const handleGithubLogin = async () => {
        window.location.href = 'http://localhost:5000/auth/github/start?redirect=/'
    }

    

    return (
        <form onSubmit={formik.handleSubmit} className='border-2  w-[30%] h-fit shadow-[inset_0px_30px_40px_0px_rgba(0,0,0,0.2),inset_1px_1px_20px_0px_rgba(0,0,0,0.1),0px_-5px_10px_0px_rgba(63,63,63,0.4)] rounded-2xl'>
            <div className=' flex flex-col items-center m-5'>
                <div className='m-1'>
                    <label htmlFor="email" className='m-3 w-32 inline-block'>Email Address</label>
                    <input
                        className='border-2 m-3 rounded-md'
                        id="email"
                        name="email"
                        type="email"
                        onChange={formik.handleChange}
                        value={formik.values.email}
                    />
                    {formik.errors.email ? <div className="text-red-700">*{formik.errors.email}</div> : null}
                </div>
                <div className='m-1'>
                    <label htmlFor="password" className='m-3 w-32 inline-block'>Password</label>
                    <input
                        className='border-2 m-3 rounded-md'
                        id="password"
                        name="password"
                        type="password"
                        onChange={formik.handleChange}
                        value={formik.values.password}
                    />
                    {formik.errors.password ? <div className="text-red-700">*{formik.errors.password}</div> : null}
                </div>
                <div className='flex flex-col items-end w-full pr-8'>
                    <p className="mt-4 text-center">
                        Don&apos;t have an account?{' '}
                        <Link href="/user/register" className="text-blue-500 hover:underline">
                            Register
                        </Link>
                    </p>
                </div>
                <button type="submit" className='bg-ring w-30 m-3 h-9 rounded-md mt-10'>Login</button>
                <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className='bg-transparent border flex items-center justify-center gap-3  w-full m-3 h-9 rounded-md mt-10'
                >
                    <img src='/google-logo.svg' className='h-fit p-2 w-10' alt='Google Logo'></img>
                    Login with Google
                </button>
                <button
                    type="button"
                    onClick={handleGithubLogin}
                    className='bg-transparent border flex items-center justify-center gap-3  w-full m-3 h-9 rounded-md mt-10'
                >
                    <img
                        src={resolvedTheme === 'dark' ? '/github-dark.svg' : '/github.svg'}
                        className='h-fit p-2 w-10'
                        alt='GitHub Logo'
                    />
                    Login with GitHub
                </button>
            </div>
        </form>
    );
};




const LoginForm = () => {

    const [isLogin, setIsLogin] = useState(false);
    const router = useRouter();

    useEffect(() => {
        console.log("auth checnk cl");
        const check = async () => {
            console.log("auth checnk calllll");
            const authenticated = await authApi.checkAuth();
            setIsLogin(authenticated);

            if (authenticated == " " || null ? false : true) {
                router.push('/');
            }
        };
        check();
    }, []);

    return (
        <>
            <div className='flex h-[93.9vh] items-center justify-center'>
                <Login ></Login>
            </div>
        </>
    )
}

export default LoginForm
