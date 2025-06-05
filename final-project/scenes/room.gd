class_name Room extends Node2D

@onready var entrances: Node = $Entrances
@onready var main_tile_map_layer: TileMapLayer = $TileMapLayer
@onready var camera_bounds: CollisionShape2D = $CameraBounds

func go_to_entrance(id: int):
	Global.player.velocity = Vector2.ZERO
	for entrance in entrances.get_children():
		if "entrance_id" in entrance and entrance.entrance_id == id:
			Global.player.global_position = entrance.global_position
			return
	# Fallback to (0,0) if entrance not found
	printerr("No entrance found with id of ", id, "! Defaulting to position (0, 0)")
	Global.player.global_position = Vector2(0,0)
	
