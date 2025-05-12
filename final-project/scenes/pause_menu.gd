extends Control

func _ready() -> void:
	visible = false

func _input(event: InputEvent) -> void:
	if event.is_action_pressed("pause"):
		toggle_pause()


func _on_resume_button_pressed() -> void:
	toggle_pause()

func toggle_pause():
	visible = !visible
	get_tree().paused = visible


func _on_quit_button_pressed() -> void:
	get_tree().quit(0)
