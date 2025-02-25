import { Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useState } from "react";
import { FcTodoList } from "react-icons/fc";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface SignUpValues {
  email: string;
  password: string;
  name: string;
  surname: string;
}

//  Validation by Yup

const validationValues = Yup.object({
  email: Yup.string()
    .email("Invalid emaill addres")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  name: Yup.string()
    .matches(/^[a-zA-Zà-žÀ-Ž\s'-]+$/, "Invalid characters in name")
    .trim()
    .min(2, "Name must be at least 2 characters long")
    .required("Name is required"),
  surname: Yup.string()
    .matches(/^[a-zA-Zà-žÀ-Ž\s'-]+$/, "Invalid characters in surname")
    .trim()
    .min(2, "Surname must be at least 2 characters long")
    .required("Surname is required"),
});

export default function SignUp() {
  const [errorMessage, setErrorMessage] = useState("");
  const initialValues: SignUpValues = {
    email: "",
    password: "",
    name: "",
    surname: "",
  };

  const handleSubmit = async (
    values: SignUpValues,
    { setSubmitting, resetForm }: FormikHelpers<SignUpValues>
  ) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/signup`, values);
      if (response.status === 201 || response.status === 200) {
        console.log("User created successfully!", response.data.message);
        toast.success("User created successfully!");
        setErrorMessage("");
        resetForm();
      } else {
        throw new Error("Unexpected response status: " + response.status);
      }
    } catch (error: any) {
      setErrorMessage(error.response?.data?.error || "Something went wrong");
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="relative min-h-screen">
        <div className="bg -z-10"></div>
        <header className="w-full  border-b-1 border-gray-500 px-4 lg:px-20 py-4 text-white flex justify-center items-center  text-2xl ">
          <Link to="/" className="flex items-center gap-2 text-seccondColor">
            <FcTodoList className="text-4xl" />
            <h2 className="font-bold">Plan & Do</h2>
          </Link>
        </header>
        <main>
          <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
              <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">
                Sign Up and create account
              </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
              {errorMessage && (
                <div className="text-red-500">{errorMessage}</div>
              )}
              <Formik
                initialValues={initialValues}
                validationSchema={validationValues}
                onSubmit={handleSubmit}>
                {({ isSubmitting }) => (
                  <Form className="space-y-6">
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm/6 font-medium text-white">
                        Email address
                      </label>
                      <div className="mt-2">
                        <Field
                          id="email"
                          name="email"
                          type="email"
                          required
                          autoComplete="email"
                          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-black outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-seccondColor  sm:text-sm/6"
                        />
                        <ErrorMessage
                          name="email"
                          component="div"
                          className="text-red-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm/6 font-medium text-white">
                        Your Name{" "}
                      </label>
                      <div className="mt-2">
                        <Field
                          id="name"
                          name="name"
                          type="text"
                          required
                          autoComplete="name"
                          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-black outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-seccondColor  sm:text-sm/6"
                        />
                        <ErrorMessage
                          name="name"
                          component="div"
                          className="text-red-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="surname"
                        className="block text-sm/6 font-medium text-white">
                        Your Surname
                      </label>
                      <div className="mt-2">
                        <Field
                          id="surname"
                          name="surname"
                          type="text"
                          required
                          autoComplete="surname"
                          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-black outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-seccondColor  sm:text-sm/6"
                        />
                        <ErrorMessage
                          name="surname"
                          component="div"
                          className="text-red-500"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between">
                        <label
                          htmlFor="password"
                          className="block text-sm/6 font-medium text-white">
                          Password
                        </label>
                      </div>
                      <div className="mt-2">
                        <Field
                          id="password"
                          name="password"
                          type="password"
                          required
                          autoComplete="current-password"
                          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-black outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-seccondColor  sm:text-sm/6"
                        />
                        <ErrorMessage
                          name="password"
                          component="div"
                          className="text-red-500"
                        />
                      </div>
                    </div>

                    <div>
                      <button
                        type="submit"
                        className="flex w-full justify-center rounded-md bg-seccondColor  px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-seccondColor ">
                        {isSubmitting ? "Submitting..." : "Sign Up"}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
              <p className="mt-10 text-center text-sm/6 text-gray-300">
                You already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-seccondColor  hover:text-indigo-500">
                  Sign in!
                </Link>
              </p>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
