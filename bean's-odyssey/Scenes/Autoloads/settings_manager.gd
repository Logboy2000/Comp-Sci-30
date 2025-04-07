extends Node

const settings_path = "user://settings.ini"

var config = ConfigFile.new()

var mouse_aim = true

signal settings_applied

# Default settings stored in a dictionary for each section
const DEFAULT_SETTINGS = {
	"general": {
		"language": "en", 
	},
	"display": {
		"window_mode": 0, 
		"vsync": 0,
		"max_fps": 260,
	},
	"audio": {
		"master": 0.5,
		"music": 0.5,
		"sfx": 0.5
	},
	"controls": {
	},
	"silly": {
		"amplify_audio": false,
		"bathroom_audio": false
	}
}

# Constant for section and key names to avoid magic strings
const DISPLAY = "display"
const AUDIO = "audio"
const GENERAL = "general"
const CONTROLS = "controls"
const SILLY = "silly"

func _ready():
	process_mode = Node.PROCESS_MODE_ALWAYS
	if not load_settings():
		load_defaults()
	apply_settings()

func _input(event: InputEvent) -> void:
	# Switch window mode when fullscreen is pressed
	if event.is_action_pressed("fullscreen"):
		var window_mode = get_setting(DISPLAY, "window_mode")
		set_setting(DISPLAY, "window_mode", 1 - window_mode) # Toggle between 0 and 1

func load_settings() -> bool:
	# Try to load the settings file, return false if failed
	var error = config.load(settings_path)
	if error == OK:
		return true
	else:
		print("Settings file not found or could not be loaded.")
		return false

func load_defaults():
	# Load default settings if no settings file is found
	for section in DEFAULT_SETTINGS.keys():
		for key in DEFAULT_SETTINGS[section].keys():
			config.set_value(section, key, DEFAULT_SETTINGS[section][key])
	save_settings_to_file()
	apply_settings()

func save_settings_to_file():
	# Save settings to the file
	var error = config.save(settings_path)
	if error != OK:
		print("Failed to save settings.")

func apply_settings():
	# Efficiently apply only changed settings
	apply_general_settings()
	apply_display_settings()
	apply_audio_settings()
	apply_control_settings()
	apply_silly_settings()
	settings_applied.emit()

func apply_display_settings():
	var window_mode = get_setting(DISPLAY, "window_mode")
	var window_modes = [
		DisplayServer.WINDOW_MODE_WINDOWED,
		DisplayServer.WINDOW_MODE_FULLSCREEN,
		DisplayServer.WINDOW_MODE_WINDOWED,
		DisplayServer.WINDOW_MODE_FULLSCREEN
	]
	var borderless_flags = [false, false, true, true]
	
	# Apply window mode if it differs from the current state
	if window_mode >= 0 and window_mode < window_modes.size():
		DisplayServer.window_set_mode(window_modes[window_mode])
		DisplayServer.window_set_flag(DisplayServer.WINDOW_FLAG_BORDERLESS, borderless_flags[window_mode])
	

	# Apply VSync setting
	var vsync = get_setting(DISPLAY, "vsync")
	DisplayServer.window_set_vsync_mode(vsync)
	
	
	var max_fps = get_setting(DISPLAY, "max_fps")
	if DisplayServer.window_get_vsync_mode() == DisplayServer.VSYNC_DISABLED:
		Engine.max_fps = max_fps
	else:
		Engine.max_fps = 0

func apply_audio_settings():
	var master = get_setting(AUDIO, "master")
	var music = get_setting(AUDIO, "music")
	var sfx = get_setting(AUDIO, "sfx")
	AudioServer.set_bus_volume_db(AudioServer.get_bus_index("Master"), linear_to_db(master))
	AudioServer.set_bus_volume_db(AudioServer.get_bus_index("Music"), linear_to_db(music))
	AudioServer.set_bus_volume_db(AudioServer.get_bus_index("SFX"), linear_to_db(sfx))

func apply_general_settings():
	var language = get_setting(GENERAL, "language")
	TranslationServer.set_locale(language)

func apply_silly_settings():
	var amplify_audio = get_setting(SILLY, "amplify_audio")
	AudioServer.set_bus_effect_enabled(0, 0, amplify_audio)
	var bathroom_audio = get_setting(SILLY, "bathroom_audio")
	AudioServer.set_bus_effect_enabled(0, 1, bathroom_audio)

func apply_control_settings():
	pass

# Utility functions for getting and setting values
func get_setting(section: String, key: String):
	return config.get_value(section, key, DEFAULT_SETTINGS[section][key])

func set_setting(section: String, key: String, value):
	# Only apply settings if the value has changed to avoid unnecessary updates
	
	config.set_value(section, key, value)
	save_settings_to_file()
	if section == DISPLAY:
		apply_display_settings()
	elif section == AUDIO:
		apply_audio_settings()
	elif section == GENERAL:
		apply_general_settings()
	elif section == SILLY:
		apply_silly_settings()
	elif section == CONTROLS:
		apply_control_settings()
	else:
		printerr('Setting section not found')
