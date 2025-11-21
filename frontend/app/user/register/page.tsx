'use client'
// import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { NextRouter } from 'next/router';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import GoogleSignup from '../google_signup/page';


interface FormValues {
    firstName: string;
    password: string;
    lastName: string;
    email: string;
    re_password: string;
}

interface valueStruct {
    firstName: string;
    password: string;
    lastName: string;
    email: string;
    re_password: string;
}

const storage = async (values: valueStruct, route: any) => {
    try {
        const { authApi } = await import('@/lib/api');
        await authApi.register(
            values.firstName,
            values.lastName,
            values.email,
            values.password
        );
        alert("Registered Successfully!");
        route.push("/");
    }
    catch (err: any) {
        const errorMessage = err.response?.data?.data?.error || 'Registration failed. Please try again.';
        alert(errorMessage);
    }
}

const validate = (values: FormValues) => {
    const errors: Partial<FormValues> = {};
    if (!values.firstName) {
        errors.firstName = 'Required';
    }
    if (!values.lastName) {
        errors.lastName = 'Required';
    }

    if (!values.email) {
        errors.email = 'Required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = 'Invalid Email address'
    }

    if (!values.password) {
        errors.password = 'Password can\'t  be Empty.'
    } else if (values.password.length < 6) {
        errors.password = 'Password must be 6 char long.'
    } else if (!((/[A-Z]/).test(values.password) && (/[a-z]/).test(values.password) && (/[0-9]/).test(values.password) && (/[!@#$%^&*(),.?":{}|<>]/).test(values.password))) {
        errors.password = 'Password must contain atleast one of this : Capital Letters  , Small Letters , Number , Special Char  .'
    }

    if (!values.re_password) {
        errors.re_password = 'Password can\'t  be Empty.'
    } else if (values.re_password !== values.re_password) {
        errors.re_password = "Both passwords must be same";
    }


    return errors
}

const Signup = () => {
    const route = useRouter()

    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            re_password: '',
        },
        validate,
        onSubmit: values => {
            // alert(JSON.stringify(values, null, 2));but t
            storage(values, route)
            console.log(values)
        },
    });
    return (
        <form onSubmit={formik.handleSubmit} className='border-2  w-[30%] h-fit shadow-[inset_0px_30px_40px_0px_rgba(0,0,0,0.2),inset_1px_1px_20px_0px_rgba(0,0,0,0.1),0px_-5px_10px_0px_rgba(63,63,63,0.4)] rounded-2xl'>
            <div className='flex flex-col items-center m-5 '>
                <div className='m-1'>
                    <label htmlFor="firstName" className='m-3 w-32 inline-block' >First Name</label>
                    <input
                        className='border-2 m-3 rounded-md'
                        id="firstName"
                        name="firstName"
                        type="text"
                        onChange={formik.handleChange}
                        value={formik.values.firstName}
                    />
                    {formik.errors.firstName ? <div className="text-red-700">*{formik.errors.firstName}</div> : null}
                </div>
                <div className='m-1'>
                    <label htmlFor="lastName" className='m-3 w-32 inline-block'>Last Name</label>
                    <input
                        className='border-2 m-3 rounded-md'
                        id="lastName"
                        name="lastName"
                        type="text"
                        onChange={formik.handleChange}
                        value={formik.values.lastName}
                    />
                    {formik.errors.lastName ? <div className="text-red-700">*{formik.errors.lastName}</div> : null}
                </div>
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
                <div className='m-1'>
                    <label htmlFor="re_password" className='m-3 w-32 inline-block'>Re-enter Password</label>
                    <input
                        className='border-2 m-3 rounded-md'
                        id="re_password"
                        name="re_password"
                        type="password"
                        onChange={formik.handleChange}
                        value={formik.values.re_password}
                    />
                    {formik.errors.re_password ? <div className="text-red-700">*{formik.errors.re_password}</div> : null}
                </div>
                <div className='flex flex-col items-end w-full pr-8'>
                    <p className="mt-4 text-center">
                        Already have an account?{' '}
                        <Link href="/user/login" className="text-blue-500 hover:underline">
                            Login
                        </Link>
                    </p>
                </div>
                <button type="submit" className='bg-ring w-30 m-3 h-9 rounded-md mt-10'>Submit</button>
            </div>
            {/* <GoogleSignup></GoogleSignup> */}
        </form>
    );
};



const SignupForm = () => {


    return (
        <>
            <div className='flex h-[93.9vh] items-center justify-center'>
                <Signup ></Signup>
            </div>
        </>
    )
}

export default SignupForm
