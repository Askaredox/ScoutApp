import React, { useState } from 'react';

type CreateModalProps = {
  title: string;
  toggleModal: boolean; // Función para alternar la visibilidad del modal
  onClose: () => void;
  onSubmit: (data: React.FormEvent<HTMLFormElement>) => void; // Define el tipo de datos según tu necesidad
  children: React.ReactNode; // Para incluir el contenido del modal

};

const CreateModal: React.FC<CreateModalProps> = ({ title, toggleModal, onClose, onSubmit, children }) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    onSubmit(e);
  }

  return (
    <div id="createModal" tabIndex={-1} aria-hidden="true" className={"fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 " + (toggleModal ? "" : "hidden")}>
      <div className="relative w-full max-w-2xl mx-auto p-4">
        <div className="relative rounded-2xl bg-white shadow-xl dark:bg-gray-900 px-6 py-8">
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4 mb-6">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{title}</h3>
            <button type="button" onClick={onClose} className="rounded-full p-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition" aria-label="Cerrar">
              <svg className="w-6 h-6 text-gray-600 dark:text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {children}
            </div>

            <div className="flex justify-end pt-4">
              {
                loading && (
                  <button disabled type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center">
                    <svg aria-hidden="true" role="status" className="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                    </svg>
                    Subiendo...
                  </button>
                )
              }
              {
                !loading && (
                  <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white cursor-pointer text-base font-medium px-6 py-3 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-800 transition">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Añadir
                  </button>
                )
              }

            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateModal;