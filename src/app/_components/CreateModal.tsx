import React from 'react';

type CreateModalProps = {
  title: string;
  toggleModal: boolean; // Función para alternar la visibilidad del modal
  onClose: () => void;
  onSubmit: (data: React.FormEvent<HTMLFormElement>) => void; // Define el tipo de datos según tu necesidad
  children: React.ReactNode; // Para incluir el contenido del modal

};

const CreateModal: React.FC<CreateModalProps> = ({ title, toggleModal, onClose, onSubmit, children }) => {
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

          <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {children}
            </div>

            <div className="flex justify-end pt-4">
              <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-base font-medium px-6 py-3 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-800 transition">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Añadir
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateModal;