import React from 'react'

export const NotFound: React.FC = ()=>{
    return(
        <div className="flex flex-col items-center justify-center h-screen bg-gray-950">
            <h1 className="text-8xl text-gray-100">404 - Not Found</h1>
            <h1 className="text-3xl font-bold text-red-700">Página não econtrada</h1>
            <p className="text-gray-300 mt-4">
                A URL que você digitou está incorreta. Por favor, contate o administrador.
            </p>
        </div>
    )
}