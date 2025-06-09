extends Node

signal setting_changed(name, value)

const SETTINGS_PATH = "user://settings_and_save_file_because_they_use_the_same_system.ini"
var _settings = {}

func _input(event: InputEvent) -> void:
	if event.is_action_pressed("fullscreen"):
		set_setting("fullscreen", not get_setting("fullscreen"))
	if event.is_action_pressed("borderless"):
		set_setting("borderless", not get_setting("borderless"))

# Add your initial settings here
func _ready():
	process_mode = Node.PROCESS_MODE_ALWAYS
	# Volume: 0.0 (mute) to 1.0 (max)
	register_setting(
		"volume",
		0.5,
		TYPE_FLOAT,
		func(v): AudioServer.set_bus_volume_db(0, linear_to_db(v)),
	)
	register_setting(
		"fullscreen",
		false,
		TYPE_BOOL,
		func(v):
			if v:
				DisplayServer.window_set_mode(DisplayServer.WINDOW_MODE_FULLSCREEN)
			else:
				DisplayServer.window_set_mode(DisplayServer.WINDOW_MODE_WINDOWED)
	)
	register_setting(
		"borderless",
		false,
		TYPE_BOOL,
		func(v: bool):
			DisplayServer.window_set_flag(DisplayServer.WINDOW_FLAG_BORDERLESS, v)
	)
	register_setting(
		"amped_audio",
		false,
		TYPE_BOOL,
		func(v: bool):
			AudioServer.set_bus_effect_enabled(0, 0, v)
	)
	register_setting(
		"bathroom_audio",
		false,
		TYPE_BOOL,
		func(v: bool):
			AudioServer.set_bus_effect_enabled(0, 1, v)
	)
	register_setting(
		"rat_mode",
		false,
		TYPE_BOOL,
		func(v: bool):
			Global.rat_mode = v
	)
	
	#Player Save
	
	register_setting("has_roll", false, TYPE_BOOL)
	register_setting("save_room", "", TYPE_STRING)
	register_setting("save_entrance_id", 0, TYPE_INT)
	register_setting("max_hp", 3, TYPE_INT)
	register_setting("has_wj", false, TYPE_BOOL)
	
	# Add more settings as needed
	load_settings()
	apply_all_settings()
	


# Register a new setting
func register_setting(setting_name: String, default_value, value_type: int, apply_callback: Callable = Callable()) -> void:
	if _settings.has(setting_name):
		push_warning("Setting '%s' already registered!" % setting_name)
		return
	_settings[setting_name] = {
		"default": default_value,
		"type": value_type,
		"value": default_value,
		"apply": apply_callback
	}

# Get a setting's value
func get_setting(setting_name: String):
	if _settings.has(setting_name):
		return _settings[setting_name]["value"]
	push_error("Setting '%s' not found!" % setting_name)
	return null

# Set a setting's value, with type and optional validation
func set_setting(setting_name: String, value) -> void:
	if not _settings.has(setting_name):
		push_error("Setting '%s' not found!" % setting_name)
		return
	var s = _settings[setting_name]
	if typeof(value) != s["type"]:
		push_error("Type mismatch for setting '%s'!" % setting_name)
		return
	s["value"] = value
	emit_signal("setting_changed", setting_name, value)
	save_settings()
	# Call apply callback if present
	if s.has("apply") and s["apply"] != Callable():
		s["apply"].call(value)

# Reset a setting to default
func reset_setting(setting_name: String) -> void:
	if _settings.has(setting_name):
		set_setting(setting_name, _settings[setting_name]["default"])

# Save all settings to disk
func save_settings() -> void:
	var config = ConfigFile.new()
	for setting_name in _settings.keys():
		config.set_value("settings", setting_name, _settings[setting_name]["value"])
	config.save(SETTINGS_PATH)

# Apply all settings (useful after loading)
func apply_all_settings() -> void:
	for setting_name in _settings.keys():
		var s = _settings[setting_name]
		if s.has("apply") and s["apply"] != Callable():
			s["apply"].call(s["value"])

# Load all settings from disk (or reset to default if not found)
func load_settings() -> void:
	var config = ConfigFile.new()
	var err = config.load(SETTINGS_PATH)
	for setting_name in _settings.keys():
		var val = _settings[setting_name]["default"]
		if err == OK and config.has_section_key("settings", setting_name):
			val = config.get_value("settings", setting_name)
		set_setting(setting_name, val)

func _get(property):
	return get_setting(property)
func _set(property, value):
	set_setting(property, value)
