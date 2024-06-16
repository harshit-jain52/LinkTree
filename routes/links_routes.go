package routes

import (
	"github.com/gofiber/fiber/v2"
	"github.com/harshit-jain52/LinkTree/controllers"
	"github.com/harshit-jain52/LinkTree/middleware"
)

func LinksRoutes(app *fiber.App) {
	app.Get("/api/links/:tree", controllers.GetLinks)
	app.Use(middleware.Authenticate)
	app.Post("/api/links", controllers.CreateLink)
	app.Patch("/api/links/:id", controllers.UpdateLink)
	app.Delete("/api/links/:id", controllers.DeleteLink)
}
