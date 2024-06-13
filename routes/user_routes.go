package routes

import (
	"github.com/gofiber/fiber/v2"
	"github.com/harshit-jain52/LinkTree/controllers"
)

func UserRoutes(app *fiber.App) {
	app.Post("/api/signup", controllers.Signup)
	app.Post("/api/login", controllers.Login)
}
