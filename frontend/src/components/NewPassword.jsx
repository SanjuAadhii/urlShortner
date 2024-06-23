import React from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
const apiUrl = import.meta.env.VITE_API_URL;
const NewPassword = () => {
  const { token } = useParams();

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setSubmitting(true);
    try {
      const response = await axios.post(`${apiUrl}/auth/reset/${token}`, {
        password: values.password,
      });
      alert("Password reset successfully");
      resetForm();
    } catch (error) {
      alert("Failed to reset password");
      console.error(error);
    }
    setSubmitting(false);
  };

  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
  });

  return (
    <Formik
      initialValues={{ password: "", confirmPassword: "" }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched }) => (
        <Form className="container">
          <h1 className="text-center">Enter New Password</h1>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <Field
              type="password"
              name="password"
              className={`form-control ${
                touched.password && errors.password ? "is-invalid" : ""
              }`}
            />
            <ErrorMessage
              name="password"
              component="div"
              className="invalid-feedback"
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <Field
              type="password"
              name="confirmPassword"
              className={`form-control ${
                touched.confirmPassword && errors.confirmPassword
                  ? "is-invalid"
                  : ""
              }`}
            />
            <ErrorMessage
              name="confirmPassword"
              component="div"
              className="invalid-feedback"
            />
          </div>
          <button className="btn btn-dark mt-4" type="submit">
            Reset Password
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default NewPassword;
