package main

import (
	"fmt"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/joho/godotenv"
)

type Link struct {
	ID    int    `json:"id"`
	Title string `json:"title"`
	Url   string `json:"url"`
}

func main() {
	app := fiber.New()

	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	PORT := os.Getenv("PORT")

	links := []Link{}

	app.Get("/api/links", func(c *fiber.Ctx) error {
		return c.Status(200).JSON(links)
	})

	app.Post("/api/link", func(c *fiber.Ctx) error {
		link := &Link{}

		if err := c.BodyParser(link); err != nil {
			return c.Status(422).JSON(fiber.Map{
				"error": "Unprocessable Entity",
			})
		}

		if link.Title == "" || link.Url == "" {
			return c.Status(400).JSON(fiber.Map{
				"error": "Title and URL are required",
			})
		}

		link.ID = len(links) + 1
		links = append(links, *link)

		return c.Status(201).JSON(link)
	})

	app.Patch("/api/link/:id", func(c *fiber.Ctx) error {
		id := c.Params("id")
		link := &Link{}
		if err := c.BodyParser(link); err != nil {
			return err
		}

		for i, l := range links {
			if fmt.Sprint(l.ID) == id {
				links[i] = *link
				return c.Status(200).JSON(link)
			}
		}

		return c.Status(404).JSON(fiber.Map{
			"error": "Link not found",
		})
	})

	app.Delete("/api/link/:id", func(c *fiber.Ctx) error {
		id := c.Params("id")

		for i, link := range links {
			if fmt.Sprint(link.ID) == id {
				links = append(links[:i], links[i+1:]...)
				return c.SendStatus(204)
			}
		}

		return c.Status(404).JSON(fiber.Map{
			"error": "Link not found",
		})
	})

	log.Fatal(app.Listen(":" + PORT))
}
