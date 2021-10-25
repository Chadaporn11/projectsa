package entity

import (
	"time"

	"gorm.io/gorm"
)

type Patient struct {
	gorm.Model
	Id_card            string `gorm:"uniqueTndex"`
	Firstname          string
	Lastname           string
	Birthdate          time.Time
	Age                uint
	Allergy            string
	Underlying_Disease string
	Gender             string
	Recorder           string

	// 1 patient มีได้หลาย Appointment
	Appointments []Appointment `gorm:"foreignKey:PatientID"`
}

type Doctor struct {
	gorm.Model
	Name  string
	Email string `gorm:"uniqueTndex"`
	// 1 Doctor มีได้หลาย Appointment
	Appointments []Appointment `gorm:"foreignKey:DoctorID"`
}

type Clinic struct {
	gorm.Model
	Name string
	// 1 Clinic มีได้หลาย Appointment
	Appointments []Appointment `gorm:"foreignKey:ClinicID"`
}

type Nurse struct {
	gorm.Model
	Firstname string
	Lastname  string
	Email     string `gorm:"uniqueTndex"`
	Password string
	// 1 Nurse ทำได้หลาย Appointment
	Appointments []Appointment `gorm:"foreignKey:NurseID"`
}

type Appointment struct {
	gorm.Model

	AppointmentTime time.Time
	Note            string

	//PatientID ทำหน้าที่เป็น FK
	PatientID *uint
	Patient   Patient

	//DoctorID ทำหน้าที่เป็น FK
	DoctorID *uint
	Doctor   Doctor

	//ClinicID ทำหน้าที่เป็น FK
	ClinicID *uint
	Clinic   Clinic

	//NurseID ทำหน้าที่เป็น FK
	NurseID *uint
	Nurse   Nurse
}
