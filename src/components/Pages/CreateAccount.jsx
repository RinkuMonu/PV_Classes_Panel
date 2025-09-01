import React from 'react';

const CreateAccount = () => {
  return (
    <div className="flex items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800">
        <div className="flex flex-col overflow-y-auto md:flex-row">
          <div className="h-32 md:h-auto md:w-1/2">
            <img
              aria-hidden="true"
              className="object-cover w-full h-full dark:hidden"
              src="/@/assets/create-account-office-Dk7xGghJ.jpeg"
              alt="Office"
            />
            <img
              aria-hidden="true"
              className="hidden object-cover w-full h-full dark:block"
              src="/@/assets/create-account-office-Dk7xGghJ.jpeg"
              alt="Office"
            />
          </div>
          <main className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
            <div className="w-full">
              <h1 className="mb-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
                Create account
              </h1>
              <form>
                <div className="mb-4">
                  <label className="block text-sm text-gray-800 dark:text-gray-400 col-span-4 sm:col-span-2 font-medium text-sm">
                    Name
                  </label>
                  <input
                    className="block w-full h-12 border px-3 py-1 text-sm focus:outline-none dark:text-gray-300 leading-5 rounded-md bg-gray-100 focus:bg-white dark:focus:bg-gray-700 focus:border-gray-200 border-gray-200 dark:border-gray-600 dark:focus:border-gray-500 dark:bg-gray-700 mr-2 h-12 p-2"
                    type="text"
                    name="name"
                    placeholder="Admin"
                    value=""
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm text-gray-800 dark:text-gray-400 col-span-4 sm:col-span-2 font-medium text-sm">
                    Email
                  </label>
                  <input
                    className="block w-full h-12 border px-3 py-1 text-sm focus:outline-none dark:text-gray-300 leading-5 rounded-md bg-gray-100 focus:bg-white dark:focus:bg-gray-700 focus:border-gray-200 border-gray-200 dark:border-gray-600 dark:focus:border-gray-500 dark:bg-gray-700 mr-2 h-12 p-2"
                    type="email"
                    name="email"
                    placeholder="john@doe.com"
                    value=""
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm text-gray-800 dark:text-gray-400 col-span-4 sm:col-span-2 font-medium text-sm">
                    Password
                  </label>
                  <input
                    className="block w-full h-12 border px-3 py-1 text-sm focus:outline-none dark:text-gray-300 leading-5 rounded-md bg-gray-100 focus:bg-white dark:focus:bg-gray-700 focus:border-gray-200 border-gray-200 dark:border-gray-600 dark:focus:border-gray-500 dark:bg-gray-700 mr-2 h-12 p-2"
                    type="password"
                    name="password"
                    placeholder="***************"
                    value=""
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm text-gray-800 dark:text-gray-400 col-span-4 sm:col-span-2 font-medium text-sm">
                    Staff Role
                  </label>
                  <div className="col-span-8 sm:col-span-4">
                    <select
                      className="block w-full h-12 border bg-gray-100 px-2 py-1 text-sm dark:text-gray-300 focus:outline-none rounded-md form-select focus:bg-white dark:focus:bg-gray-700 focus:border-gray-200 border-gray-200 dark:border-gray-600 focus:shadow-none dark:focus:border-gray-500 dark:bg-gray-700 leading-5"
                      name="role"
                    >
                      <option value="" hidden>
                        Staff role
                      </option>
                      <option value="Super Admin">Super Admin</option>
                      <option value="Admin">Admin</option>
                      <option value="Cashier">Cashier</option>
                      <option value="CEO">CEO</option>
                      <option value="Manager">Manager</option>
                      <option value="Accountant">Accountant</option>
                      <option value="Driver">Driver</option>
                      <option value="Security Guard">Security Guard</option>
                      <option value="Deliver Person">Delivery Person</option>
                    </select>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm text-gray-800 dark:text-gray-400 inline-flex items-center mt-6">
                    <input
                      className="text-emerald-600 form-checkbox focus:border-emerald-500 focus:outline-none rounded focus:border-gray-200 border-gray-200 dark:border-gray-600 dark:focus:border-gray-500 dark:bg-gray-700"
                      type="checkbox"
                    />
                    <span className="ml-2">
                      I agree to the <span className="underline">privacy policy</span>
                    </span>
                  </label>
                </div>

                <button
                  className="align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150 font-medium focus:outline-none px-4 py-2 rounded-lg text-sm text-white bg-emerald-500 border border-transparent active:bg-emerald-600 hover:bg-emerald-600 w-full mt-4 h-12"
                  type="submit"
                >
                  Create account
                </button>
              </form>

              <hr className="my-10" />

              <div className="space-y-4">
                <button
                  disabled
                  className="text-sm inline-flex items-center cursor-pointer transition ease-in-out duration-300 font-semibold font-serif text-center justify-center rounded-md focus:outline-none text-gray-700 bg-gray-100 shadow-sm my-2 md:px-2 lg:px-3 py-4 md:py-3.5 lg:py-4 hover:text-white hover:bg-blue-600 h-11 md:h-12 w-full mr-2"
                >
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth="0"
                    version="1.1"
                    viewBox="0 0 16 16"
                    className="w-4 h-4 mr-2"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9.5 3h2.5v-3h-2.5c-1.93 0-3.5 1.57-3.5 3.5v1.5h-2v3h2v8h3v-8h2.5l0.5-3h-3v-1.5c0-0.271 0.229-0.5 0.5-0.5z"></path>
                  </svg>
                  <span className="ml-2">Login With Facebook</span>
                </button>

                <button
                  disabled
                  className="text-sm inline-flex items-center cursor-pointer transition ease-in-out duration-300 font-semibold font-serif text-center justify-center rounded-md focus:outline-none text-gray-700 bg-gray-100 shadow-sm my-2 md:px-2 lg:px-3 py-4 md:py-3.5 lg:py-4 hover:text-white hover:bg-red-500 h-11 md:h-12 w-full"
                >
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth="0"
                    version="1.1"
                    viewBox="0 0 16 16"
                    className="w-4 h-4 mr-2"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M8.159 6.856v2.744h4.537c-0.184 1.178-1.372 3.45-4.537 3.45-2.731 0-4.959-2.262-4.959-5.050s2.228-5.050 4.959-5.050c1.553 0 2.594 0.663 3.188 1.234l2.172-2.091c-1.394-1.306-3.2-2.094-5.359-2.094-4.422 0-8 3.578-8 8s3.578 8 8 8c4.616 0 7.681-3.247 7.681-7.816 0-0.525-0.056-0.925-0.125-1.325l-7.556-0.003z"></path>
                  </svg>
                  <span className="ml-2">Login With Google</span>
                </button>
              </div>

              <p className="mt-4">
                <a
                  className="text-sm font-medium text-emerald-500 dark:text-emerald-400 hover:underline"
                  href="/login"
                >
                  Already have an account? Login
                </a>
              </p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default CreateAccount;