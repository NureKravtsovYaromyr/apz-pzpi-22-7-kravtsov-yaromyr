import React, { FC, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // import styles
import styles from './MyEditor.module.css'
import './MyEditor.css'
interface Props {
    value: string;
    setValue: (val: string) => void;
    className?: string
}
const MyEditor: FC<Props> = ({ setValue, value, className }) => {


    const handleChange = (value: string) => {
        setValue(value);
    };

    return (
        <div>
            <ReactQuill
                value={value}
                onChange={handleChange}
                className={`${styles.editor} ${className}`}
                modules={{
                    toolbar: [
                        [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                        ['bold', 'italic', 'underline'],
                        ['link']
                    ]
                }}
            />
        </div>
    );
}

export default MyEditor;
