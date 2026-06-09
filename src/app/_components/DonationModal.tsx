import { Donation } from "@/lib/interfaces";
import { request } from "@/lib/request-utils";
import React, { SetStateAction, useEffect, useState } from "react";
import Loader from "./Loader";

type DonateModalProps = {
  show: boolean;
  setShow: (value: SetStateAction<boolean>) => void;
};

const DonateModal: React.FC<DonateModalProps> = ({ show, setShow }) => {
  const donationRef = React.useRef<boolean>(false);
  const [donationData, setDonationData] = useState<Donation>();
  const [ready, setReady] = useState<boolean>(false);

  const request_donation_data = async () => {
    setReady(false);
    const response = await request(
      "GET",
      "/donation",
      "application/json",
      null,
      false,
    );
    setReady(true);
    setDonationData(response);
  };

  useEffect(() => {
    if (!show || donationRef.current) return;
    donationRef.current = true;
    request_donation_data();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);
  if (!show) return null;

  return (
    <div
      id="donation-modal"
      tabIndex={-1}
      aria-hidden="true"
      className={`overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full ${show ? "" : "hidden"}`}
    >
      <div className="relative p-4 w-full max-w-lg max-h-full mx-auto">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-900 rounded-base shadow-sm p-4 md:p-6">
          <button
            type="button"
            className="absolute top-3 end-2.5 text-body bg-transparent hover:bg-neutral-tertiary cursor-pointer hover:text-heading rounded-base text-sm w-9 h-9 ms-auto inline-flex justify-center items-center"
            onClick={() => setShow(false)}
          >
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18 17.94 6M18 18 6.06 6"
              />
            </svg>
            <span className="sr-only">Close modal</span>
          </button>
          {!ready ? (
            <div className="flex justify-center items-center h-48">
              <Loader />
            </div>
          ) : (
            <div>
              <h3 className="mb-8 text-lg font-semibold text-heading">
                Dona para apoyar el proyecto
              </h3>

              <p className="mb-4 text-body">
                Tu donación nos ayudará a mantener y mejorar el proyecto.
              </p>

              <p className="mb-4 text-body">
                {(donationData &&
                  donationData.general &&
                  donationData.general[0].description) ||
                  "Cargando datos de donación..."}
              </p>
              <div className="flex justify-between mb-1.5 text-sm text-body mt-6">
                <span className="font-normal">Donaciones hechas</span>
                <span className="font-medium">
                  Q
                  {donationData &&
                    donationData.donations &&
                    donationData.donations.reduce(
                      (acc: number, curr: any) => acc + curr.amount,
                      0,
                    )}{" "}
                  de Q
                  {donationData &&
                    donationData.general &&
                    donationData.general[0].goal}{" "}
                  de meta
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
                <div
                  className="bg-green-600 h-2.5 rounded-full"
                  style={{
                    width: `${donationData && (donationData.donations && donationData.donations.reduce((acc: number, curr: any) => acc + curr.amount, 0) / (donationData.general && donationData.general[0].goal)) * 100}%`,
                  }}
                ></div>
              </div>

              <div className="flex items-center mt-6 space-x-4 rtl:space-x-reverse">
                <button
                  data-modal-hide="default-modal"
                  type="button"
                  className="text-white bg-green-600 box-border cursor-pointer rounded-lg border border-transparent hover:bg-green-700 focus:ring-4 focus:ring-green-300 shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
                  onClick={() => {
                    window.open(
                      donationData &&
                        donationData.general &&
                        donationData.general[0].link,
                      "_blank",
                    );
                  }}
                >
                  Contactar
                </button>
                <button
                  data-modal-hide="default-modal"
                  type="button"
                  className="text-body text-black bg-gray-200 cursor-pointer box-border rounded-lg border border-default-medium hover:bg-neutral-300 hover:text-heading focus:ring-4 focus:ring-neutral-300 shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
                  onClick={() => setShow(false)}
                >
                  Salir
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DonateModal;
