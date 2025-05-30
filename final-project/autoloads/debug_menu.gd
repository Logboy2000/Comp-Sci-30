extends Control

@onready var fps: Label = $VBoxContainer/FPS


func menu_update():
	fps.text = "FPS: " + str(Engine.get_frames_per_second())

func _ready() -> void:
	menu_update()

func  _input(event: InputEvent) -> void:
	if event.is_action_pressed("debug"):
		visible = !visible


func _on_update_timer_timeout() -> void:
	menu_update()
