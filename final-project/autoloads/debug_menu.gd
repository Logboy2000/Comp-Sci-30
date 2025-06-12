extends Control
@onready var save: Button = %save
@onready var rollbutton: CheckButton = %dashbutton
@onready var wjbutton: CheckButton = %wjbutton

func _ready() -> void:
	await get_tree().process_frame
	rollbutton.button_pressed = Global.player.has_roll
	wjbutton.button_pressed = Global.player.has_wall_jump

func  _input(event: InputEvent) -> void:
	if event.is_action_pressed("debug"):
		visible = !visible


func _on_save_pressed() -> void:
	Global.save_progress()


func _on_dashbutton_toggled(toggled_on: bool) -> void:
	Global.player.has_roll = toggled_on


func _on_wjbutton_toggled(toggled_on: bool) -> void:
	Global.player.has_wall_jump = toggled_on


func _on_quitwosave_pressed() -> void:
	get_tree().quit(69)


func _on_killyourself_pressed() -> void:
	Global.player.die()
