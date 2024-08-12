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

var linkCol *mongo.Collection = configs.GetCollection(configs.DB, "links")

func GetLinks(c *fiber.Ctx) error {
	tree := c.Params("tree")
	foundUser := new(models.User)
	var links []models.Link

	err := userCol.FindOne(c.Context(), bson.M{"name": tree}).Decode(&foundUser)

	if err != nil {
		return c.Status(404).JSON(fiber.Map{
			"error": "Tree not found",
		})
	}

	cursor, err := linkCol.Find(context.Background(), bson.M{"uid": foundUser.User_id})
	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "Error fetching links",
		})
	}

	defer cursor.Close(context.Background())

	for cursor.Next(context.Background()) {
		var link models.Link
		cursor.Decode(&link)
		links = append(links, link)
	}

	return c.Status(200).JSON(links)
}

func CreateLink(c *fiber.Ctx) error {
	link := new(models.Link)
	treeIDInterface := c.Locals("uid")
	treeID, ok := treeIDInterface.(string)
	if !ok {
		return c.Status(403).JSON(fiber.Map{
			"error": "Forbidden",
		})
	}

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

	link.Uid = treeID
	result, err := linkCol.InsertOne(context.Background(), link)

	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "Error creating link",
		})
	}

	link.ID = result.InsertedID.(primitive.ObjectID)

	userFilter := bson.M{"user_id": treeID}
	update := bson.M{"$push": bson.M{"links": link.ID}}
	_, err = userCol.UpdateOne(context.Background(), userFilter, update)

	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "Error updating tree",
		})
	}

	return c.Status(200).JSON(link)
}

func UpdateLink(c *fiber.Ctx) error {
	treeIDInterface := c.Locals("uid")
	_, ok := treeIDInterface.(string)

	id := c.Params("id")
	objectID, err := primitive.ObjectIDFromHex(id)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "Invalid ID",
		})
	}

	if !ok {
		return c.Status(403).JSON(fiber.Map{
			"error": "Forbidden",
		})
	}

	var update map[string]interface{}
	err = json.Unmarshal(c.Body(), &update)
	if err != nil {
		return c.Status(400).SendString("Bad Request")
	}

	filter := bson.M{"_id": objectID}
	updateBson := bson.M{"$set": update}

	_, err = linkCol.UpdateOne(context.Background(), filter, updateBson)

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
	treeIDInterface := c.Locals("uid")
	treeID, ok := treeIDInterface.(string)
	if !ok {
		return c.Status(403).JSON(fiber.Map{
			"error": "Forbidden",
		})
	}

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "Invalid ID",
		})
	}

	filter := bson.M{"_id": objectID}

	_, err = linkCol.DeleteOne(context.Background(), filter)

	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "Error deleting link",
		})
	}

	userFilter := bson.M{"user_id": treeID}
	update := bson.M{"$pull": bson.M{"links": objectID}}
	_, err = userCol.UpdateOne(context.Background(), userFilter, update)

	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "Error updating tree",
		})
	}

	return c.Status(200).JSON(fiber.Map{"success": true})
}

func Authenticate(c *fiber.Ctx) error {
	tree := c.Params("tree")
	foundUser := new(models.User)
	treeNameInterface := c.Locals("name")
	treeName, ok := treeNameInterface.(string)
	if !ok {
		return c.Status(403).JSON(fiber.Map{
			"error": "Forbidden",
		})
	}
	err := userCol.FindOne(c.Context(), bson.M{"name": tree}).Decode(&foundUser)

	if err != nil {
		return c.Status(404).JSON(fiber.Map{
			"error": "Tree not found",
		})
	}

	if foundUser.Name != treeName {
		return c.Status(403).JSON(fiber.Map{
			"error": "Forbidden",
		})
	}

	return c.Status(200).JSON(fiber.Map{
		"success": true,
	})
}
