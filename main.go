package main

import (
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/harshit-jain52/LinkTree/configs"
	"github.com/harshit-jain52/LinkTree/routes"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Link struct {
	ID    primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	Title string             `json:"title"`
	Url   string             `json:"url"`
}

func main() {
	configs.ConnectDB()

	app := fiber.New()
	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:5173/",
		AllowHeaders: "Origin,Content-Type,Accept,Authorization",
	}))

	routes.UserRoutes(app)
	routes.LinksRoutes(app)

	if os.Getenv("ENV") == "production" {
		app.Static("/", "./client/dist")
	}

	log.Fatal(app.Listen(":" + configs.EnvPort()))
}
