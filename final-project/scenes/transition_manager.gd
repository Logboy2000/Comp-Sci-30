class_name TransitionManager extends CanvasLayer
@onready var animation_player: AnimationPlayer = $AnimationPlayer

func fade_in():
	await _play_transition(false)
func fade_out():
	await _play_transition(true)

func _play_transition(reverse: bool):
	var transition = "fade"
	if randi_range(0, 100) == 0:
		transition = "bigratjumpscare"
	if reverse:
		animation_player.play_backwards(transition)
	else:
		animation_player.play(transition)
	await animation_player.animation_finished
