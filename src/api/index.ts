/**
 * Export central de tous les services API
 */

export { default as apiClient } from './client';

// Auth API
export * from './auth.api';

// Students API
export * from './students.api';

// TODO: Ajouter les autres APIs
// export * from './teachers.api';
// export * from './courses.api';
// export * from './grades.api';

// À ajouter plus tard :
// export { academicApi } from './academic.api';
// export { studentsApi } from './students.api';
// export { evaluationsApi } from './evaluations.api';
// etc.