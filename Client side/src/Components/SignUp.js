import React from 'react'
import { useFormik } from 'formik'
import * as yup from 'yup'
import axios from 'axios'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import style from './style.css'
function SignUp() {
    const navigate = useNavigate()
    const SIGNUPURI = 'http://localhost:4000/user/signup'
    const [status, setstatus] = useState('')
    const [message, setmessage] = useState('')
    const [isLoading, setisLoading] = useState(true)
    const [isGoing, setisGoing] = useState(false)
    const contactRegex = /^[0][\d]{10}$/
    const formik = useFormik({
        initialValues: {
            firstname: '',
            lastname: '',
            email: '',
            contact: '',
            username: '',
            password: '',
            profilePhoto: '',
            gender: '',
            dateOfBirth: ''
        },
        onSubmit: (values) => {
            const userDetails = values;
            setisGoing(true)
            axios.post(SIGNUPURI, userDetails).then((res) => {
                setisLoading(false)
                setisGoing(false)
                let feedBack = res.data
                setmessage(feedBack.message)
                setstatus(feedBack.status)
                // if (res.data.status) {
                //     navigate('/signin')
                // }
            })
        },
        validationSchema: yup.object({
            firstname: yup.string().required(`This field is requied`),
            lastname: yup.string().required(`This field is requied`),
            email: yup.string().required(`This field is requied`).email(`please, enter a verlid email`),
            contact: yup.string().required(`This field is requied`).matches(contactRegex, `contact must be valid 11 digit`),
            username: yup.string().required(`This field is requied`),
            password: yup.string().required(`This field is requied`),
        })
    })
    return (
        <>
            <div className='container-fluid'>
                <div className='col-lg-7 col-md-12 mx-auto my-5'>
                    <div className='form shadow'>
                        <h1 className='card-header text-center text-light border-bottom-0 btnbg'>Sign up</h1>
                        <div className='p-3'>
                            {
                                isLoading ? '' : status ? <div className='alert alert-success text-center'>{message}</div> : <div className='alert alert-danger text-center'>{message}</div>
                            }
                            <form action='' onSubmit={formik.handleSubmit}>
                                <div className='row'>
                                    <div className='form-floating mt-2 col-lg-6 col-md-12'>
                                        <div className='form-floating'>
                                            <input type='text' name='firstname' className='form-control mx-auto' placeholder='First Name here' onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.firstname} />
                                            <label for='' className='text-muted ms-2'>First Name here</label>
                                            {formik.touched.firstname ? <small className='text-danger'>{formik.errors.firstname}</small> : ''}
                                        </div>
                                    </div>
                                    <div className='form-floating mt-2 col-lg-6 col-md-12 '>
                                        <div className='form-floating '>
                                            <input type='text' name='lastname' className='form-control mx-auto' placeholder='Last Name here' onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.lastname} />
                                            <label for='' className='text-muted ms-2'>Last Name here</label>
                                            {formik.touched.lastname ? <small className='text-danger'>{formik.errors.lastname}</small> : ''}
                                        </div>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='form-floating mt-2 col-lg-6 col-md-12'>
                                        <div className='form-floating'>
                                            <input type='email' name='email' className='form-control mx-auto' placeholder='Email Address' onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.email} />
                                            <label for='' className='text-muted ms-2'>Email Address</label>
                                            {formik.touched.email ? <small className='text-danger'>{formik.errors.email}</small> : ''}
                                        </div>
                                    </div>
                                    <div className='form-floating mt-2 col-lg-6 col-md-12'>
                                        <div className='form-floating'>
                                            <input type='text' name='contact' className='form-control mx-auto bg-white' placeholder='Contact' onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.contact} />
                                            <label for='' className='text-muted ms-2'>Contact</label>
                                            {formik.touched.contact ? <small className='text-danger'>{formik.errors.contact}</small> : ''}
                                        </div>
                                    </div>
                                </div>
                                <div className='row'>

                                    <div className=' mt-2 col-lg-6 col-md-12'>
                                        <div className='form-floating'>
                                            <input type='text' name='username' className='form-control mx-auto' placeholder='username' onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.username} />
                                            <label for='' className='text-muted ms-2'>Username</label>
                                        </div>
                                        {formik.touched.username ? <small className='text-danger'>{formik.errors.username}</small> : ''}
                                    </div>
                                    <div className='mt-2 col-lg-6 col-md-12'>
                                        <div className='form-floating'>

                                            <input type='password' name='password' className='form-control mx-auto' placeholder='Password' onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.password} />
                                            <label for='' className='text-muted ms-2'>Password</label>
                                            {formik.touched.password ? <small className='text-danger'>{formik.errors.password}</small> : ''}
                                        </div>
                                    </div>
                                </div>
                                <div className='row mt-3 mx-3'>
                                    <div className='col-sm-6'>
                                        <p className='text-muted'>Already have an account <Link to='/signin' className='text-decoration-none'>Sign in</Link></p>
                                    </div>
                                    <div className='col-sm-6'>
                                        <p className='text-muted'>Already have an account <Link to='/signin' className='text-decoration-none'>Sign in</Link></p>
                                    </div>
                                </div>
                                <div className='col-12 mt-3 text-end'>
                                    <button className='btn btnbg px-5 text-light' type='submit'>{isGoing ? <div className="spinner-border text-light opacity-50" role="status">
                                        <span class="visually-hidden">Loading...</span>
                                    </div> : 'Create account'}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SignUp