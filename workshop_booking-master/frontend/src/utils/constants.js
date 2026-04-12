/**
 * Shared constants — single source of truth for all dropdown data and status codes.
 * Extracted from RegisterPage, StatisticsPage, and backend models.py
 */

// Workshop status codes (match Django Workshop.STATUS_CHOICES)
export const STATUS_CODES = {
  PENDING: 0,
  ACCEPTED: 1,
  REJECTED: 2,   // Also used for "Deleted" in backend
};

export const STATUS_LABELS = {
  [STATUS_CODES.PENDING]: 'Pending',
  [STATUS_CODES.ACCEPTED]: 'Accepted',
  [STATUS_CODES.REJECTED]: 'Rejected',
};

// Indian states — value matches Django model `states` tuple
export const INDIAN_STATES = [
  { value: 'IN-AP', label: 'Andhra Pradesh' },
  { value: 'IN-AR', label: 'Arunachal Pradesh' },
  { value: 'IN-AS', label: 'Assam' },
  { value: 'IN-BR', label: 'Bihar' },
  { value: 'IN-CT', label: 'Chhattisgarh' },
  { value: 'IN-GA', label: 'Goa' },
  { value: 'IN-GJ', label: 'Gujarat' },
  { value: 'IN-HR', label: 'Haryana' },
  { value: 'IN-HP', label: 'Himachal Pradesh' },
  { value: 'IN-JK', label: 'Jammu and Kashmir' },
  { value: 'IN-JH', label: 'Jharkhand' },
  { value: 'IN-KA', label: 'Karnataka' },
  { value: 'IN-KL', label: 'Kerala' },
  { value: 'IN-MP', label: 'Madhya Pradesh' },
  { value: 'IN-MH', label: 'Maharashtra' },
  { value: 'IN-MN', label: 'Manipur' },
  { value: 'IN-ML', label: 'Meghalaya' },
  { value: 'IN-MZ', label: 'Mizoram' },
  { value: 'IN-NL', label: 'Nagaland' },
  { value: 'IN-OR', label: 'Odisha' },
  { value: 'IN-PB', label: 'Punjab' },
  { value: 'IN-RJ', label: 'Rajasthan' },
  { value: 'IN-SK', label: 'Sikkim' },
  { value: 'IN-TN', label: 'Tamil Nadu' },
  { value: 'IN-TG', label: 'Telangana' },
  { value: 'IN-TR', label: 'Tripura' },
  { value: 'IN-UT', label: 'Uttarakhand' },
  { value: 'IN-UP', label: 'Uttar Pradesh' },
  { value: 'IN-WB', label: 'West Bengal' },
  { value: 'IN-AN', label: 'Andaman and Nicobar Islands' },
  { value: 'IN-CH', label: 'Chandigarh' },
  { value: 'IN-DN', label: 'Dadra and Nagar Haveli' },
  { value: 'IN-DD', label: 'Daman and Diu' },
  { value: 'IN-DL', label: 'Delhi' },
  { value: 'IN-LD', label: 'Lakshadweep' },
  { value: 'IN-PY', label: 'Puducherry' },
];

// State names only (for statistics page dropdown)
export const INDIAN_STATE_NAMES = INDIAN_STATES.map((s) => s.label);

// Departments — matches Django model `department_choices`
export const DEPARTMENTS = [
  { value: 'computer engineering', label: 'Computer Science & Engineering' },
  { value: 'information technology', label: 'Information Technology' },
  { value: 'civil engineering', label: 'Civil Engineering' },
  { value: 'electrical engineering', label: 'Electrical Engineering' },
  { value: 'mechanical engineering', label: 'Mechanical Engineering' },
  { value: 'chemical engineering', label: 'Chemical Engineering' },
  { value: 'aerospace engineering', label: 'Aerospace Engineering' },
  { value: 'biosciences and bioengineering', label: 'Biosciences and BioEngineering' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'energy science and engineering', label: 'Energy Science and Engineering' },
];

// Titles — matches Django model `title` choices
export const TITLES = [
  { value: 'Professor', label: 'Prof.' },
  { value: 'Doctor', label: 'Dr.' },
  { value: 'Mr', label: 'Mr.' },
  { value: 'Mrs', label: 'Mrs.' },
  { value: 'Miss', label: 'Ms.' },
  { value: 'Shriman', label: 'Shri' },
  { value: 'Shrimati', label: 'Smt' },
  { value: 'Kumari', label: 'Ku' },
];

// User positions/roles
export const POSITIONS = [
  { value: 'coordinator', label: 'Coordinator', description: 'Propose and coordinate workshops at your institution' },
  { value: 'instructor', label: 'Instructor', description: 'Conduct and manage workshops' },
];
