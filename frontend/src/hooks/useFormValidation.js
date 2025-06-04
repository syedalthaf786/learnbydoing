import { useState, useCallback } from 'react';

function useFormValidation(initialState, validationRules) {
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setValues(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (touched[name]) {
      validateField(name, value);
    }
  }, [touched]);

  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    validateField(name, values[name]);
  }, [values]);

  const validateField = useCallback((fieldName, value) => {
    const fieldRules = validationRules[fieldName];
    if (!fieldRules) return;

    let fieldError = '';
    for (const rule of fieldRules) {
      const error = rule(value, values);
      if (error) {
        fieldError = error;
        break;
      }
    }

    setErrors(prev => ({
      ...prev,
      [fieldName]: fieldError
    }));
  }, [validationRules, values]);

  const validateForm = useCallback(() => {
    const newErrors = {};
    let isValid = true;

    Object.keys(validationRules).forEach(fieldName => {
      const fieldRules = validationRules[fieldName];
      const value = values[fieldName];

      for (const rule of fieldRules) {
        const error = rule(value, values);
        if (error) {
          newErrors[fieldName] = error;
          isValid = false;
          break;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [validationRules, values]);

  const resetForm = useCallback(() => {
    setValues(initialState);
    setErrors({});
    setTouched({});
  }, [initialState]);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    resetForm,
    setValues
  };
}

export default useFormValidation;