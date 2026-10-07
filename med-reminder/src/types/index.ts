export type MealRelation = 'before' | 'after' | 'with' | 'bedtime' | 'independent';
export interface Medicine {
  id: string;
  name: string;
  purpose: string;
  dosage: string;
  mealRelation: MealRelation;
  courseDurationDays: number;
  prescribedBy: string;
  medicalFacility: string;
  intervalValue: number;
  intervalUnit: string;
}
export interface DoctorAppointment {
  id: string;
  doctorName: string;
  date: string;
  time: string;
  office: string;
}
export interface PatientTask {
  id: string;
  patientName: string;
  roomNumber: string;
  taskType: string;
  scheduledTime: string;
}
export interface IntakeLog {
  id: string;
  medicineName: string;
  timestamp: string;
}
