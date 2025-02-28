import React from 'react';

export const Unauthorized: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-950">
            <h1 className="text-8xl text-gray-100">403 - Forbidden</h1>
            <h1 className="text-3xl font-bold text-red-700">Sem Autorização</h1>
            <p className="text-gray-300 mt-4">
                Você não tem permissão para acessar esta página. Por favor, contate o administrador.
            </p>
        </div>
    );
}