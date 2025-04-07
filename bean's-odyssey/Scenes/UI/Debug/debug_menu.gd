class_name DebugMenu extends CanvasLayer
@onready var debug_info: VBoxContainer = $Control/MarginContainer/DebugInfo
@onready var animation_player: AnimationPlayer = $AnimationPlayer
@onready var room_selector: Panel = $Control/MarginContainer/RoomSelector

var labels: Dictionary = {}

func _ready() -> void:
	Global.debug_menu = self
	visible = Global.debug_enabled
	if visible:
		animation_player.play("enter")
	add_label("name", ProjectSettings.get("application/config/name") + Engine.get_architecture_name() + "(v" + ProjectSettings.get("application/config/version")+")")

func _input(event: InputEvent) -> void:
	if event.is_action_pressed("room_selector") and visible:
		room_selector.visible = !room_selector.visible
	
	
	if event.is_action_pressed("toggle_debug"):
		Global.debug_enabled = !Global.debug_enabled
		if Global.debug_enabled:
			visible = true
			animation_player.play("enter")
		else:
			animation_player.play("exit")
	
	
	

func add_label(label_name: String, text: String = "fill this") -> void:
	var label = Label.new()
	label.name = label_name
	label.text = text
	debug_info.add_child(label)
	labels[label_name] = label

func modify_label(label_name: String, new_text: String) -> void:
	if visible:
		if labels.has(label_name):
			var label = labels[label_name]
			label.text = new_text
		else:
			add_label(label_name)
			modify_label(label_name, new_text)

func remove_label(label_name: String) -> void:
	if labels.has(label_name):
		var label = labels[label_name]
		debug_info.remove_child(label)
		labels.erase(label_name)
	else:
		print("Label with name '%s' not found!" % label_name)
