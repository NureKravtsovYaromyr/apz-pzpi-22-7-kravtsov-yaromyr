import React, { useEffect, useState } from 'react';
import styles from './PaginationBar.module.css';

interface Props {
    setPage: (val: number) => void;
    totalPages: number;
    page: number
}

const PaginationBar: React.FC<Props> = ({ totalPages, setPage, page }) => {
    const [pages, setPages] = useState<number[]>([]);

    useEffect(() => {
        const array = new Array(totalPages).fill(0); // Массив, заполненный нулями
        array[0] = 1; // Устанавливаем 1 в нужный индекс

        setPages(array)
    }, [])

    const changePage = (newPage: number) => {
        page !== newPage && setPage(Number(newPage));
        const array = new Array(totalPages).fill(0); // Массив, заполненный нулями
        array[page - 1] = 1; // Устанавливаем 1 в нужный индекс
        setPages(array)
    }


    useEffect(() => {
        changePage(page)
    }, [page])

    const decrimentPage = () => {
        if (page <= 1) return
        setPage(page - 1)
    }

    const incrimentPage = () => {
        if (page >= totalPages) return
        setPage(page + 1)
    }
    return (
        <div className={styles.paginationBar}>
            <div className={`${styles.actionButton} ${page <= 1 && styles.disabled}`} onClick={decrimentPage}>
                <svg width="6" height="8" viewBox="0 0 6 8" fill="" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M5.40281 0.184136C5.63249 0.422999 5.62504 0.802824 5.38618 1.0325L2.23598 4L5.38618 6.9675C5.62504 7.19718 5.63249 7.577 5.40281 7.81587C5.17314 8.05473 4.79331 8.06218 4.55445 7.8325L0.954446 4.4325C0.836798 4.31938 0.770311 4.16321 0.770311 4C0.770311 3.83679 0.836799 3.68062 0.954446 3.5675L4.55445 0.167501C4.79331 -0.0621752 5.17314 -0.0547276 5.40281 0.184136Z" fill="#626262" />
                </svg>
                <p>Back</p>
            </div>
            <div className={styles.pages}>
                {pages.map((page, index) =>
                    <div className={`${styles.page} ${page && styles.active}`} onClick={() => changePage(index + 1)}>
                        {index + 1}
                    </div>
                )}
            </div>
            <div className={`${styles.actionButton} ${page >= totalPages && styles.disabled}`} onClick={incrimentPage}>
                <p>Next</p>
                <svg width="6" height="8" viewBox="0 0 6 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M0.598165 7.81586C0.368489 7.577 0.375937 7.19718 0.6148 6.9675L3.765 4L0.614799 1.0325C0.375936 0.802823 0.368489 0.422997 0.598165 0.184134C0.827841 -0.0547285 1.20767 -0.0621767 1.44653 0.167499L5.04653 3.5675C5.16418 3.68062 5.23067 3.83679 5.23067 4C5.23067 4.16321 5.16418 4.31938 5.04653 4.4325L1.44653 7.8325C1.20767 8.06218 0.827841 8.05473 0.598165 7.81586Z" fill="#626262" />
                </svg>
            </div>
        </div>
    );
};

export default PaginationBar;