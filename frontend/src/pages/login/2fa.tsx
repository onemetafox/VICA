import React from 'react';
import Head from 'next/head';

const Login2fa = () => {
  const allowOnlyNumeric = (event: any) => {
    if (!/[0-9]/.test(event.key)) {
      event.preventDefault();
    }
  };
  return (
    <>
      <Head>
        <title>2FA</title>
      </Head>

      <div className="h-screen bg-blue-500 py-20 px-3">
        <div className="container mx-auto">
          <div className="max-w-sm mx-auto md:max-w-lg">
            <div className="w-full">
              <div className="bg-white h-64 py-3 rounded text-center">
                <h1 className="text-2xl font-bold">2FA Verification</h1>
                <div className="flex flex-col mt-4">
                  <span>
                    Enter 6-digit code from your two factor authentication app
                  </span>
                </div>

                <div
                  id="otp"
                  className="flex flex-row justify-center text-center px-2 mt-5"
                >
                  <input
                    className="m-2 border h-10 w-10 text-center form-control rounded"
                    type="text"
                    id="first"
                    maxLength={1}
                    onKeyPress={allowOnlyNumeric}
                  />
                  <input
                    className="m-2 border h-10 w-10 text-center form-control rounded"
                    type="text"
                    id="second"
                    maxLength={1}
                    onKeyPress={allowOnlyNumeric}
                  />
                  <input
                    className="m-2 border h-10 w-10 text-center form-control rounded"
                    type="text"
                    id="third"
                    maxLength={1}
                    onKeyPress={allowOnlyNumeric}
                  />
                  <input
                    className="m-2 border h-10 w-10 text-center form-control rounded"
                    type="text"
                    id="fourth"
                    maxLength={1}
                    onKeyPress={allowOnlyNumeric}
                  />
                  <input
                    className="m-2 border h-10 w-10 text-center form-control rounded"
                    type="text"
                    id="fifth"
                    maxLength={1}
                    onKeyPress={allowOnlyNumeric}
                  />
                  <input
                    className="m-2 border h-10 w-10 text-center form-control rounded"
                    type="text"
                    id="sixth"
                    maxLength={1}
                    onKeyPress={allowOnlyNumeric}
                  />
                </div>

                <div className="flex justify-center text-center mt-5">
                  <button
                    type="button"
                    className="flex items-center text-blue-700 hover:text-blue-900 cursor-pointer"
                  >
                    <span className="font-bold">Continue</span>
                    <i className="bx bx-caret-right ml-1" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login2fa;
