import { create } from "zustand";


interface AppState {
    /* Erros */
    errorTitle: string,
    errorText: string,
    isError: boolean
    setIsError: (isError: boolean) => void,
    setErrorTitle: (errorTitle: string) => void,
    setErrorText: (errorText: string) => void,
    isNavBarShow: boolean,
    setIsNavBarShow: (isNavBarShow: boolean) => void
}


const useAppStore = create<AppState>((set) => ({
    /* Erros */

    errorTitle: '',
    errorText: '',
    isError: false,
    setIsError: (isError: boolean) => set({ isError }),
    setErrorTitle: (errorTitle: string) => set({ errorTitle }),
    setErrorText: (errorText: string) => set({ errorText }),
    isNavBarShow: false,
    setIsNavBarShow: (isNavBarShow: boolean) => set({ isNavBarShow })



}))

export default useAppStore;