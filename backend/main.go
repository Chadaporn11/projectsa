package main

import (
	"github.com/Chadaporn11/SAG13/controller"

	"github.com/Chadaporn11/SAG13/entity"
	"github.com/Chadaporn11/SAG13/middlewares"

	"github.com/gin-gonic/gin"
)

func main() {

	entity.SetupDatabase()

	r := gin.Default()
	r.Use(CORSMiddleware())

	api := r.Group("")
	{
		protected := api.Use(middlewares.Authorizes())
		{
			// Nurse Routes
			protected.GET("/nurses", controller.ListNurses)
			protected.GET("/nurse/:id", controller.GetNurse)
			protected.PATCH("/nurses", controller.UpdateNurse)
			protected.DELETE("/nurses/:id", controller.DeleteNurses)

			// Patient Routes
			protected.GET("/patients", controller.ListPatients)
			protected.GET("/patient/:id", controller.GetPatient)
			protected.POST("/patients", controller.CreatePatients)
			protected.PATCH("/patients", controller.UpdatePatient)
			protected.DELETE("/patients/:id", controller.DeletePatients)

			// Doctor Routes
			protected.GET("/doctors", controller.ListDoctors)
			protected.GET("/doctor/:id", controller.GetDoctor)
			protected.POST("/doctors", controller.CreateDoctors)
			protected.PATCH("/doctors", controller.UpdateDoctor)
			protected.DELETE("/doctors/:id", controller.DeleteDoctors)

			// Clinic Routes
			protected.GET("/clinics", controller.ListClinics)
			protected.GET("/clinic/:id", controller.GetClinic)
			protected.POST("/clinics", controller.CreateClinics)
			protected.PATCH("/clinics", controller.UpdateClinic)
			protected.DELETE("/clinics/:id", controller.DeleteClinics)

			// Appointment Routes
			protected.GET("/appointments", controller.ListAppointments)
			protected.GET("/appointment/:id", controller.GetAppointment)
			protected.POST("/appointments", controller.CreateAppointment)
			protected.PATCH("/appointments", controller.UpdateAppointment)
			protected.DELETE("/appointments/:id", controller.DeleteAppointment)

		}
	}

	// Nurse Routes
	r.POST("/nurses", controller.CreateNurses)

	// Authentication Routes
	r.POST("/login", controller.Login)
	

	// Run the server
	r.Run()
}

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}

}
