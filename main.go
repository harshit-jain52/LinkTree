package main

import (
	"context"
	"encoding/json"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Link struct {
	ID    primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	Title string             `json:"title"`
	Url   string             `json:"url"`
}

var collection *mongo.Collection

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file", err)
	}

	MONGODB_URI := os.Getenv("MONGODB_URI")
	clientOptions := options.Client().ApplyURI(MONGODB_URI)
	client, err := mongo.Connect(context.Background(), clientOptions)

	if err != nil {
		log.Fatal("Error connecting to MongoDB", err)
	}

	defer client.Disconnect(context.Background())

	err = client.Ping(context.Background(), nil)

	if err != nil {
		log.Fatal("Error pinging MongoDB", err)
	}

	log.Println("Connected to MongoDB")

	collection = client.Database("linktree_db").Collection("links")

	app := fiber.New()
	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:5173/",
		AllowHeaders: "Origin,Content-Type,Accept",
	}))

	app.Get("/api/links", getLinks)
	app.Post("/api/links", createLink)
	app.Patch("/api/links/:id", updateLink)
	app.Delete("/api/links/:id", deleteLink)

	port := os.Getenv("PORT")
	if port == "" {
		port = "5000"
	}

	log.Fatal(app.Listen(":" + port))
}

func getLinks(c *fiber.Ctx) error {
	var links []Link

	cursor, err := collection.Find(context.Background(), bson.M{})

	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "Error fetching links",
		})
	}

	defer cursor.Close(context.Background())

	for cursor.Next(context.Background()) {
		var link Link
		if err := cursor.Decode(&link); err != nil {
			return c.Status(500).JSON(fiber.Map{
				"error": "Error decoding links",
			})
		}
		links = append(links, link)
	}

	return c.Status(200).JSON(links)
}

func createLink(c *fiber.Ctx) error {
	link := new(Link)

	if err := c.BodyParser(link); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "Error parsing request",
		})
	}

	if link.Title == "" || link.Url == "" {
		return c.Status(400).JSON(fiber.Map{
			"error": "Title and URL are required",
		})
	}

	result, err := collection.InsertOne(context.Background(), link)

	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "Error creating link",
		})
	}

	link.ID = result.InsertedID.(primitive.ObjectID)

	return c.Status(200).JSON(link)
}

func updateLink(c *fiber.Ctx) error {
	id := c.Params("id")
	objectID, err := primitive.ObjectIDFromHex(id)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "Invalid ID",
		})
	}

	var update map[string]interface{}
	err = json.Unmarshal(c.Body(), &update)
	if err != nil {
		return c.Status(400).SendString("Bad Request")
	}

	filter := bson.M{"_id": objectID}
	updateBson := bson.M{"$set": update}

	_, err = collection.UpdateOne(context.Background(), filter, updateBson)

	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "Error updating link",
		})
	}

	return c.Status(200).JSON(fiber.Map{"success": true})
}

func deleteLink(c *fiber.Ctx) error {
	id := c.Params("id")
	objectID, err := primitive.ObjectIDFromHex(id)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "Invalid ID",
		})
	}

	filter := bson.M{"_id": objectID}

	_, err = collection.DeleteOne(context.Background(), filter)

	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "Error deleting link",
		})
	}

	return c.Status(200).JSON(fiber.Map{"success": true})
}
