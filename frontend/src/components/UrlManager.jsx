import React, { useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import axios from "axios";
import * as Yup from "yup";
import { useAuth } from "../context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";

const UrlManager = () => {
  const { isAuthenticated, user, authToken, apiUrl, urls, setUrls } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to sign-in if not authenticated
    if (!isAuthenticated) {
      navigate("/signin", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    // Fetch URLs when authenticated and user is present
    if (isAuthenticated && user) {
      const fetchUrls = async () => {
        try {
          const response = await axios.get(`${apiUrl}/api/user-urls`, {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          });
          setUrls(response.data);
          // Also update the URLs in local storage
          localStorage.setItem("urls", JSON.stringify(response.data));
        } catch (error) {
          console.error("Failed to fetch URLs", error);
        }
      };
      fetchUrls();
    }
  }, [isAuthenticated, user, authToken, apiUrl, setUrls]);

  const deleteUrl = async (urlId) => {
    try {
      await axios.delete(`${apiUrl}/api/urls/${urlId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      const updatedUrls = urls.filter((url) => url._id !== urlId);
      setUrls(updatedUrls);
      localStorage.setItem("urls", JSON.stringify(updatedUrls)); // Update local storage
    } catch (error) {
      console.error("Failed to delete the URL", error);
    }
  };

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  const initialValues = {
    longUrl: "",
  };

  const validationSchema = Yup.object().shape({
    longUrl: Yup.string().url("Invalid URL format").required("Required"),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    if (!user || !user.id) {
      alert("User is not authenticated or user ID is not available.");
      setSubmitting(false);
      return;
    }

    setSubmitting(true);
    try {
      const response = await axios.post(
        `${apiUrl}/api/shorten`,
        {
          longUrl: values.longUrl,
          userId: user.id,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      const newUrls = [...urls, response.data];
      setUrls(newUrls);
      localStorage.setItem("urls", JSON.stringify(newUrls)); // Update local storage
      resetForm();
    } catch (error) {
      alert("Failed to create short URL: " + error.message);
    }
    setSubmitting(false);
  };

  return (
    <div className="container">
      <h1 className="row d-flex justify-content-center">Your URLs</h1>
      <table className="table">
        <thead className="thead-dark">
          <tr>
            <th scope="col">Used times</th>
            <th scope="col">Long URL</th>
            <th scope="col">Short URL</th>
            <th scope="col">Delete</th>
          </tr>
        </thead>
        <tbody>
          {urls.map((url) => (
            <tr key={url._id}>
              <td>{url.clicks}</td>
              <td>{url.longUrl}</td>
              <td>
                {apiUrl}/{url.shortUrl}
              </td>
              <td>
                <button onClick={() => deleteUrl(url._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Create a New Short URL</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <Field type="text" name="longUrl" placeholder="Enter URL" />
            <ErrorMessage name="longUrl" component="div" />
            <button type="submit" disabled={isSubmitting}>
              Create Short URL
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default UrlManager;
