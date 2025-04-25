extends Area2D

@export_file var target_room: String
@export var entrance_id: int

func _on_body_entered(body: Node2D) -> void:
	if body is Player:
		if not Global.is_transitioning:
			Global.room_manager.change_room(target_room, entrance_id)
