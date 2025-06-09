export class FormDataHelper {
    static isEmpty = function (data: FormData): boolean {
        let empty = true;
        data.forEach(() => {
            empty = false;
        });
        return empty;
    };

    static objToFormData = (obj: Record<string, any>): FormData => {
        const formData = new FormData();

        Object.entries(obj).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                formData.append(key, value);
            }
        });

        return formData;
    };

}