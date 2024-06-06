package routes

import (
	"github.com/gofiber/fiber/v2"
	"github.com/harshit-jain52/LinkTree/controllers"
)

func LinksRoutes(app *fiber.App) {
	app.Get("/api/links", controllers.GetLinks)
	app.Post("/api/links", controllers.CreateLink)
	app.Patch("/api/links/:id", controllers.UpdateLink)
	app.Delete("/api/links/:id", controllers.DeleteLink)
}
