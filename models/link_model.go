package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type Link struct {
	ID    primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	Title string             `json:"title"`
	Url   string             `json:"url"`
}
