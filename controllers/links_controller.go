package controllers

import (
	"context"
	"encoding/json"

	"github.com/gofiber/fiber/v2"
	"github.com/harshit-jain52/LinkTree/configs"
	"github.com/harshit-jain52/LinkTree/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

var collection *mongo.Collection = configs.GetCollection(configs.DB, "links")

func GetLinks(c *fiber.Ctx) error {
	var links []models.Link

	cursor, err := collection.Find(context.Background(), bson.M{})

	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "Error fetching links",
		})
	}

	defer cursor.Close(context.Background())

	for cursor.Next(context.Background()) {
		var link models.Link
		if err := cursor.Decode(&link); err != nil {
			return c.Status(500).JSON(fiber.Map{
				"error": "Error decoding links",
			})
		}
		links = append(links, link)
	}

	return c.Status(200).JSON(links)
}

func CreateLink(c *fiber.Ctx) error {
	link := new(models.Link)

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

func UpdateLink(c *fiber.Ctx) error {
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

func DeleteLink(c *fiber.Ctx) error {
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
