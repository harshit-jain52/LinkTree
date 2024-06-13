package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
	ID           primitive.ObjectID   `json:"_id,omitempty" bson:"_id,omitempty"`
	Name         string               `json:"name" validate:"required"`
	Password     string               `json:"password" validate:"required"`
	Links        []primitive.ObjectID `json:"links" default:"[]" bson:"links"`
	Token        string               `json:"token"`
	RefreshToken string               `json:"refreshToken"`
	Created_at   time.Time            `json:"created_at"`
	Updated_at   time.Time            `json:"updated_at"`
	User_id      string               `json:"user_id"`
}
