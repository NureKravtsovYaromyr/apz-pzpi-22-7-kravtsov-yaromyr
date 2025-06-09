

export const isoToNormal = (isoDateString: string) => {
    const date = new Date(isoDateString);

    return date.toLocaleDateString('de-DE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}
export const isoToInput = (isoDateString:string) => {
    if(isoDateString.trim() == '') return ''
    const date = new Date(isoDateString);

    return date.toISOString().split('T')[0];

}