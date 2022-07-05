import React from 'react'
import { useFormik } from 'formik'
import * as yup from 'yup'
import axios from 'axios'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
function Signin() {
    const navigate = useNavigate()
    const SIGNINURI = 'http://localhost:4000/user/signin'
    const [status, setstatus] = useState('')
    const [message, setmessage] = useState('')
    const [token, settoken] = useState('')
    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        onSubmit: (values) => {
            const authDetails = values;
            axios.post(SIGNINURI, authDetails).then((res) => {
                console.log(res);
                localStorage.token = res.data.token
                // let feedBack = res.data
                // console.log(res);
                // setmessage(feedBack.message)
                // setstatus(feedBack.status)
                // settoken(feedBack.token)
                // if (feedBack.token) {
                //     localStorage.token = JSON.stringify(feedBack.token) 
                //     navigate('/home')
                // }
            })
        },
        validationSchema: yup.object({
            email: yup.string().required(`This field is requied`).email(`please, enter a verlid email`),
            password: yup.string().required(`This field is requied`),
        })
    })
    return (
        <>
            <div className='container-fluid'>
                <div className='col-lg-7 col-md-12 mx-auto my-5'>
                    <div className='form shadow'>
                        <h1 className='card-header text-center text-muted border-bottom-0'>Sign in</h1>
                        <div className='p-3'>
                         
                            <form action='' onSubmit={formik.handleSubmit}>

                                <div className='row'>
                                    <div className='form-floating mt-2 col-md-12'>
                                        <div className='form-floating'>
                                            <input type='text' name='email' className='form-control mx-auto' placeholder='Email Address' onChange={formik.handleChange} onBlur={formik.handleBlur} />
                                            <label for='' className='text-muted ms-2'>Email Address</label>
                                            {formik.touched.email ? <small className='text-danger'>{formik.errors.email}</small> : ''}
                                        </div>
                                    </div>

                                </div>

                                <div className='mt-2 col-md-12'>
                                    <div className='form-floating'>

                                        <input type='password' name='password' className='form-control mx-auto' placeholder='Password' onChange={formik.handleChange} onBlur={formik.handleBlur} />
                                        <label for='' className='text-muted ms-2'>Password</label>
                                        {formik.touched.password ? <small className='text-danger'>{formik.errors.password}</small> : ''}
                                    </div>
                                </div>
                                <div className='col-12 mt-3 text-end'>
                                    <button className='btn btn-danger' type='submit'>Create account</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Signin