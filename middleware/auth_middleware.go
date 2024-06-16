package middleware

import (
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/harshit-jain52/LinkTree/helpers"
)

func Authenticate(c *fiber.Ctx) error {
	clientToken := c.Get("Authorization")

	if clientToken == "" {
		return c.Status(403).JSON(fiber.Map{
			"error": "No Authorization header provided",
		})
	}

	splitToken := strings.Split(clientToken, "Bearer ")

	if len(splitToken) != 2 {
		return c.Status(403).JSON(fiber.Map{
			"error": "Invalid token",
		})
	}

	clientToken = splitToken[1]

	claims, err := helpers.ValidateToken(clientToken)
	if err != "" {
		return c.Status(403).JSON(fiber.Map{
			"error": err,
		})
	}

	c.Locals("name", claims.Name)
	c.Locals("uid", claims.Uid)

	return c.Next()
}
