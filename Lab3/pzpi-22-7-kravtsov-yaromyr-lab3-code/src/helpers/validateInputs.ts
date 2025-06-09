export function validateInputs(inputs: Record<string, string>): [Record<string, boolean>, boolean, Record<string, boolean>] {
  const inputErrors: Record<string, boolean> = {};
  const defaultState: Record<string, boolean> = {};

  for (const key in inputs) {
    const isEmpty = inputs[key].trim() === '';
    inputErrors[key] = isEmpty;
    defaultState[key] = false;
  }

  const hasErrors = Object.values(inputErrors).some(Boolean);

  return [inputErrors, hasErrors, defaultState];
}
