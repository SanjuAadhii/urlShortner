import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import axios from "axios";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

const apiUrl = import.meta.env.VITE_API_URL;

const ResetPasswordSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
});

const ResetPassword = () => {
  const navigate = useNavigate();
  return (
    <Formik
      initialValues={{
        email: "",
      }}
      validationSchema={ResetPasswordSchema}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        setSubmitting(true);
        try {
          const response = await axios.post(
            `${apiUrl}/auth/reset-password`,
            values
          );
          alert("Check your email for the reset link");

          resetForm();
          navigate("/signin", { replace: true });
        } catch (error) {
          alert("Error sending reset link" + error.response.data.msg);
          console.error(error);
        }
        setSubmitting(false);
      }}
    >
      {({ isSubmitting }) => (
        <Form className="container">
          <h1 className="text-center"> Reset Password</h1>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <Field className="form-control" type="email" name="email" />
            <ErrorMessage
              className="text-danger"
              name="email"
              component="div"
            />
          </div>
          <button
            type="submit"
            className="btn btn-info mt-4"
            disabled={isSubmitting}
          >
            Send Reset Link
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default ResetPassword;
