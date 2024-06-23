import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import axios from "axios";
import * as Yup from "yup";
import { Link } from "react-router-dom";
const apiUrl = import.meta.env.VITE_API_URL;
const SignupSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  mobileNumber: Yup.string().required("Mobile number is required"),
  dob: Yup.date().required("Date of birth is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm password is required"),
});

const Signup = () => {
  return (
    <Formik
      initialValues={{
        name: "",
        email: "",
        mobileNumber: "",
        dob: "",
        password: "",
        confirmPassword: "",
      }}
      validationSchema={SignupSchema}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        setSubmitting(true);
        const { confirmPassword, ...dataToSubmit } = values;
        try {
          const response = await axios.post(
            `${apiUrl}/auth/signup`,
            dataToSubmit
          );
          alert(
            "Signup successful please check your email to activate account."
          );

          setSubmitting(false);
          resetForm();
        } catch (error) {
          alert("Error during signup");
          console.error(error);
          setSubmitting(false);
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form className="container">
          <h1 className="text-center">Sign Up</h1>
          <div className="row">
            <div className="form-group row">
              <label className="form-label" htmlFor="name">
                Name
              </label>
              <Field className="form-control" type="text" name="name" />
              <ErrorMessage
                name="name"
                component="div"
                className="text-danger"
              />
            </div>
            <div className="form-group row">
              <label className="form-label" htmlFor="email">
                Email
              </label>
              <Field className="form-control" type="email" name="email" />
              <ErrorMessage
                name="email"
                component="div"
                className="text-danger"
              />
            </div>
            <div className="form-group row">
              <label className="form-label" htmlFor="mobileNumber">
                Mobile Number
              </label>
              <Field className="form-control" type="text" name="mobileNumber" />
              <ErrorMessage
                name="mobileNumber"
                component="div"
                className="text-danger"
              />
            </div>
            <div className="form-group row">
              <label className="form-label" htmlFor="dob">
                Date of Birth
              </label>
              <Field className="form-control col-4" type="date" name="dob" />
              <ErrorMessage
                name="dob"
                component="div"
                className="text-danger"
              />
            </div>
            <div className="form-group row">
              <label className="form-label" htmlFor="password">
                Password
              </label>
              <Field className="form-control" type="password" name="password" />
              <ErrorMessage
                name="password"
                component="div"
                className="text-danger"
              />
            </div>
            <div className="form-group row">
              <label className="form-label" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <Field
                className="form-control"
                type="password"
                name="confirmPassword"
              />
              <ErrorMessage
                name="confirmPassword"
                component="div"
                className="text-danger"
              />
            </div>
            <Link to="/signin">Already have an account? Sign in</Link>
            <button
              type="submit"
              className="btn btn-primary col-3 mt-4"
              disabled={isSubmitting}
              style={{ height: "25%" }}
            >
              Sign Up
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default Signup;
