import { useState, useRef, useEffect, FC } from "react";
import styles from "./MySelect.module.css";
import arrowSelect from "../../assets/images/arrow-down-s-fill.svg";
import { SelectOption } from "../../models/SelectOption";
/* import { SelectOption } from "../../models/SelectOption"; */



interface MySelectProps {
    options: SelectOption[];
    placeholder?: string;
    className?: string;
    onChange: (value: string) => void;
    disabled?: boolean;
    value?: string; // Проп для начального значения
    hasError?: boolean; // Новое свойство для отображения ошибки

}

const MySelect: FC<MySelectProps> = (props) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState<string | null>(props.value || null);
    const selectRef = useRef<HTMLDivElement>(null);
    const selectedOptionRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (props.value !== undefined) {
            setSelectedValue(props.value);
        }
    }, [props.value]);

    const handleOptionClick = (value: string, event: React.MouseEvent) => {
        event.stopPropagation(); // Предотвращаем всплытие
        event.preventDefault();
        setSelectedValue(value);
        props.onChange(value); // Уведомляем родителя о выборе
        setIsOpen(false);

        // Если есть ошибка, уведомляем родителя, что её нужно скрыть
        if (props.hasError) {
            props.onChange(value); // Колбэк обновляет родительское состояние ошибки
        }
    };

    const toggleDropdown = (event: React.MouseEvent) => {
        event.stopPropagation(); // Предотвращаем всплытие
        event.preventDefault();
        if (!props.disabled) {
            setIsOpen((prevState) => !prevState);
        }
    };

    // Прокручиваем к выбранному элементу, когда выпадающий список открывается
    useEffect(() => {
        if (isOpen && selectedOptionRef.current) {
            selectedOptionRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
    }, [isOpen]);

    const handleClickOutside = (event: MouseEvent) => {
        if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div
            className={`${props.className || ""} ${styles.customSelectContainer} ${props.disabled ? styles.disabled : ""
                } `}
            ref={selectRef}
            onClick={(event) => event.stopPropagation()} // Останавливаем всплытие на основном контейнере
        >
            <div
                className={`${styles.customSelectTrigger} ${props.hasError ? styles.errorBorder : ""}`}
                onClick={toggleDropdown}
                style={{ cursor: props.disabled ? "not-allowed" : "pointer" }}
            >
                <span className={selectedValue ? styles.selectedPlaceholder : ""}>
                    {selectedValue
                        ? props.options.find((option) => option.value === selectedValue)?.label
                        : props.placeholder}
                </span>
                <svg width="17" height="9" viewBox="0 0 17 9" fill="none" xmlns="http://www.w3.org/2000/svg"
                    className={`${styles.arrow} ${isOpen ? styles.open : ""}`}
                >
                    <path d="M0 0.5L8.5 8.5L17 0.5H0Z" fill="black" fillOpacity="0.54" />
                </svg>

            </div>
            {isOpen && !props.disabled && (
                <div className={styles.customSelectDropdown}>
                    {props.options.map((option) => (
                        <div
                            key={option.value}
                            ref={option.value === selectedValue ? selectedOptionRef : null}
                            className={`${styles.customSelectOption} ${option.value === selectedValue ? styles.selectedOption : ""
                                }`}
                            onClick={(event) => handleOptionClick(option.value, event)}
                        >
                            {option.label}
                        </div>
                    ))}
                </div>
            )}
            {props.hasError && (
                <span className={styles.errorText}>Eingabefehler. Bitte überprüfen Sie die Daten.</span>
            )}
        </div>
    );
};

export default MySelect;
