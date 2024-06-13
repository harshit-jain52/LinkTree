package middleware

import (
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/harshit-jain52/LinkTree/helpers"
)

func Authenticate(c *fiber.Ctx) {
	clientToken := c.Get("Authorization")

	if clientToken == "" {
		c.Status(403).JSON(fiber.Map{
			"error": "No Authorization header provided",
		})
		return
	}

	splitToken := strings.Split(clientToken, "Bearer ")

	if len(splitToken) != 2 {
		c.Status(403).JSON(fiber.Map{
			"error": "Invalid token",
		})
		return
	}

	clientToken = splitToken[1]

	claims, err := helpers.ValidateToken(clientToken)
	if err != "" {
		c.Status(403).JSON(fiber.Map{
			"error": err,
		})
		return
	}

	c.Set("name", claims.Name)
	c.Set("uid", claims.Uid)

	c.Next()
}
