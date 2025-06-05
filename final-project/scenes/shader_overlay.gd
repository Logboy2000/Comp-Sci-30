extends ColorRect

func _ready() -> void:
	SettingsManager.setting_changed.connect(Callable(self, "_setting_changed"))
	visible = Global.rat_mode
	

func _setting_changed(_name, _value):
	visible = Global.rat_mode
