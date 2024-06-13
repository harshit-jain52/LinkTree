package controllers

import (
	"log"
	"time"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/harshit-jain52/LinkTree/configs"
	"github.com/harshit-jain52/LinkTree/helpers"
	"github.com/harshit-jain52/LinkTree/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"golang.org/x/crypto/bcrypt"
)

var userCol *mongo.Collection = configs.GetCollection(configs.DB, "users")
var validate = validator.New()

func HashPassword(password string) string {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	if err != nil {
		log.Panic(err)
	}

	return string(bytes)
}

func VerifyPassword(userPassword string, providedPassword string) (bool, string) {
	err := bcrypt.CompareHashAndPassword([]byte(userPassword), []byte(providedPassword))
	check := true
	msg := ""

	if err != nil {
		msg = "name or password is incorrect"
		check = false
	}

	return check, msg
}

func Signup(c *fiber.Ctx) error {
	user := new(models.User)

	if err := c.BodyParser(user); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "Error parsing request",
		})
	}

	if user.Name == "" || user.Password == "" {
		return c.Status(400).JSON(fiber.Map{
			"error": "Name and Password are required",
		})
	}

	if err := validate.Struct(user); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	count, err := userCol.CountDocuments(c.Context(), bson.M{"name": user.Name})
	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "Error checking name",
		})
	}

	if count > 0 {
		return c.Status(400).JSON(fiber.Map{
			"error": "Name already taken",
		})
	}

	pass := HashPassword(user.Password)
	user.Password = pass

	user.Links = []primitive.ObjectID{}
	user.Created_at, _ = time.Parse(time.RFC3339, time.Now().Format(time.RFC3339))
	user.Updated_at, _ = time.Parse(time.RFC3339, time.Now().Format(time.RFC3339))
	user.ID = primitive.NewObjectID()
	user.User_id = user.ID.Hex()
	token, refreshToken, _ := helpers.GenerateAllTokens(user.Name, user.User_id)
	user.Token = token
	user.RefreshToken = refreshToken

	_, err = userCol.InsertOne(c.Context(), user)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "Error creating tree",
		})
	}

	return c.Status(200).JSON(user)
}

func Login(c *fiber.Ctx) error {
	user := new(models.User)
	foundUser := new(models.User)

	if err := c.BodyParser(user); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "Error parsing request",
		})
	}

	if user.Name == "" || user.Password == "" {
		return c.Status(400).JSON(fiber.Map{
			"error": "Name and Password are required",
		})
	}

	if err := validate.Struct(user); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	err := userCol.FindOne(c.Context(), bson.M{"name": user.Name}).Decode(&foundUser)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "Tree not found",
		})
	}

	check, msg := VerifyPassword(foundUser.Password, user.Password)

	if !check {
		return c.Status(400).JSON(fiber.Map{
			"error": msg,
		})
	}

	token, refreshToken, _ := helpers.GenerateAllTokens(foundUser.Name, foundUser.User_id)
	helpers.UpdateAllTokens(token, refreshToken, foundUser.User_id)

	return c.Status(200).JSON(foundUser)
}
