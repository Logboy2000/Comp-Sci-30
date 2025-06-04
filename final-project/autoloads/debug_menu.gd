extends Control

@onready var fps: Label = $VBoxContainer/FPS
@onready var node_count: Label = $VBoxContainer/NodeCount


func menu_update():
	fps.text = "FPS: " + str(Engine.get_frames_per_second())
	node_count.text = "Node Count: " + str(get_tree().get_node_count())

func _ready() -> void:
	menu_update()

func  _input(event: InputEvent) -> void:
	if event.is_action_pressed("debug"):
		visible = !visible


func _on_update_timer_timeout() -> void:
	menu_update()
