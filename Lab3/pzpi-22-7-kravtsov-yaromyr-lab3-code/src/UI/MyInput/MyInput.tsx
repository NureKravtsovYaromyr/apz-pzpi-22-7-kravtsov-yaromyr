import { FC } from "react";
import styles from "./MyInput.module.css";

interface MyInputProps {
    value: string;
    setValue: (value: string) => void;
    placeholder?: string;
    className?: string;
    width?: number;
    type?: string;
    disabled?: boolean;
    hasError?: boolean;
    onEnter?: () => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onFocus?: () => void;
    multiline?: boolean;
}

const MyInput: FC<MyInputProps> = (props) => {
    const {
        value,
        setValue,
        placeholder,
        className,
        width,
        type,
        disabled,
        hasError,
        onEnter,
        onKeyDown,
        onFocus,
        multiline = false
    } = props;

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (event.key === "Enter" && onEnter) {
            onEnter();
        }
        onKeyDown?.(event);
    };

    const commonProps = {
        value,
        onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setValue(e.target.value),
        placeholder,
        className: `${className || ""} ${styles.input} ${disabled ? styles.disabled : ""} ${hasError ? styles.errorBorder : ""}`,
        style: {
            width: width ? `${width}px` : undefined,
            color: type === 'datetime-local' && value === ''
                ? 'rgba(0, 0, 0, 0.6)'
                : 'rgba(0, 0, 0, 1)'
        },
        disabled,
        onKeyDown: handleKeyDown,
        onFocus
    };

    return (
        <div className={`${styles.inputContainer} ${className}`}>
            {multiline ? (
                <textarea {...commonProps as React.TextareaHTMLAttributes<HTMLTextAreaElement>} />
            ) : (
                <input type={type} {...commonProps as React.InputHTMLAttributes<HTMLInputElement>} />
            )}
            {hasError && (
                <span className={styles.errorText}>
                    Eingabefehler. Bitte überprüfen Sie die Daten.
                </span>
            )}
        </div>
    );
};

export default MyInput;
