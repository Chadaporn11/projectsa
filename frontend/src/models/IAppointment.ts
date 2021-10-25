import { PatientsInterface } from "./IPatient";
import { DoctorsInterface } from "./IDoctor";
import { ClinicsInterface } from "./IClinic";
import { NursesInterface } from "./INurse";


export interface AppointmentInterface {
  ID: string,
  PatientID: number,
  Patient: PatientsInterface,
  DoctorID: number,
  Doctor: DoctorsInterface,
  ClinicID: number,
  Clinic: ClinicsInterface,
  NurseID: number,
  Nurse: NursesInterface,
  AppointmentTime: Date,
  Note: string,
}