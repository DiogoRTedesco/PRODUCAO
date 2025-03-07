import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { api } from "../../lib/axios";
import { Sidebar } from "../../Components/sideBar";
import Cione from '../../../public/cioneLogoPequena.png';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface User {
    id: number;
    usuario: string;
}

interface Log {
    id: number;
    action: string;
    createdAt: string;
    metadata?: Record<string, any>;
}

export const LogSearchPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<number | null>(null);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [logs, setLogs] = useState<Log[]>([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api.get("/users");
                setUsers(response.data);
            } catch (error) {
                toast.error("Erro ao carregar usuários!");
            }
        };
        fetchUsers();
    }, []);

    const handleSearchLogs = async () => {
        if (!selectedUser || !startDate || !endDate) {
            toast.warning("Por favor, selecione um usuário e um período!");
            return;
        }
        const startOfDay = new Date(startDate);
        startOfDay.setHours(0, 0, 0, 0); // 00:00:00

        const endOfDay = new Date(endDate);
        endOfDay.setHours(23, 59, 59, 999); // 23:59:59.999
        try {
            const response = await api.get("/logs", {
                params: {
                    userId: selectedUser,
                    startDate: startOfDay.toISOString(),
                    endDate: endOfDay.toISOString(),
                },
            });
            setLogs(response.data);
        } catch (error) {
            toast.error("Erro ao buscar logs!");
        }
    };

    return (
        <div className="min-h-screen bg-yellow-100 text-zinc-900">
            <Sidebar />
            <header className="bg-zinc-800 text-white p-4 flex items-center justify-between">
                <div className='flex items-center'>
                    <img src={Cione} alt="Logo" className="h-8 w-8 mr-4 ml-10" />
                    <h1 className="text-2xl font-bold space-x-3">Gerenciamento de Logs dos Usuários</h1>
                </div>
            </header>
            <div className="max-w-6xl px-6 py-10 mx-auto space-y-8 pt-16">
                <h2 className="text-2xl font-medium">Buscar Logs</h2>

                <div className="flex gap-4">
                    <select
                        className="border p-2 rounded-lg"
                        value={selectedUser || ""}
                        onChange={(e) => setSelectedUser(Number(e.target.value))}
                    >
                        <option value="">Selecione um usuário</option>
                        {users.map((user) => (
                            <option key={user.id} value={user.id}>{user.usuario}</option>
                        ))}
                    </select>
                    <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        className="border p-2 rounded-lg"
                        dateFormat="dd/MM/yyyy"
                        placeholderText="Data Inicial"
                    />
                    <DatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        className="border p-2 rounded-lg"
                        dateFormat="dd/MM/yyyy"
                        placeholderText="Data Final"
                    />
                    <button
                        onClick={handleSearchLogs}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    >
                        Buscar Logs
                    </button>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h3 className="text-lg font-medium">Resultados</h3>
                    {logs.length === 0 ? (
                        <p>Nenhum log encontrado</p>
                    ) : (
                        <ul>
                            {logs.map((log) => (
                                <li key={log.id} className="border-b py-2">
                                    <strong>Ação:</strong> {log.action} - <strong>Data:</strong> {new Date(log.createdAt).toLocaleString()}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            <ToastContainer position="top-right" autoClose={5000} />
        </div>
    );
};

