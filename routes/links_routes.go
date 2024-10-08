package routes

import (
	"github.com/gofiber/fiber/v2"
	"github.com/harshit-jain52/LinkTree/controllers"
	"github.com/harshit-jain52/LinkTree/middleware"
)

func LinksRoutes(app *fiber.App) {
	app.Get("/api/links/:tree", controllers.GetLinks)
	app.Post("/api/links", middleware.Authenticate, controllers.CreateLink)
	app.Patch("/api/links/:id", middleware.Authenticate, controllers.UpdateLink)
	app.Delete("/api/links/:id", middleware.Authenticate, controllers.DeleteLink)
	app.Get("/api/auth/:tree", middleware.Authenticate, controllers.Authenticate)
}
