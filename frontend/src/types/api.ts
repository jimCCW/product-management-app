export interface GenericResponse {
  success: boolean;
  message?: string;
  errors?: any[];
}

export interface FieldValidationError {
  field: string;
  message: string;
}
