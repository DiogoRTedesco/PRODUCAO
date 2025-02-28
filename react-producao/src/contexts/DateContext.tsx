import  { createContext, useContext, useState, ReactNode } from "react";

interface DateContextProps {
    selectedDate: Date | null;
    setSelectedDate: (date: Date | null) => void;
}

const DateContext = createContext<DateContextProps | undefined>(undefined);

export const DateProvider = ({ children }: { children: ReactNode }) => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

    return (
        <DateContext.Provider value={{ selectedDate, setSelectedDate }}>
            {children}
        </DateContext.Provider>
    );
};

export const useDate = () => {
    const context = useContext(DateContext);
    if (!context) {
        throw new Error("useDate deve ser usado dentro de um DateProvider");
    }
    return context;
};
