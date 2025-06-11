class_name SavePoint extends Interactable
@export var entrance_id: int = 0

func _process(delta: float) -> void:
	super._process(delta)
	sprite_2d.rotate(10 * delta)

func _interact() -> void:
	Global.save_point(Global.room_manager.current_scene_path, entrance_id)
