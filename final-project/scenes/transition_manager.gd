class_name TransitionManager extends Control
@onready var animation_player: AnimationPlayer = $AnimationPlayer
var transition = "fade"
const BATMAN_TRANSITION = preload("res://audio/batman_transition.mp3")
func fade_in():
	if randi_range(1, 100) == 1:
		transition = "bigratjumpscare"
		Audio.play_sound(BATMAN_TRANSITION)
	else:
		transition = "fade"
	await _play_transition(false)

func fade_out():
	await _play_transition(true)

func _play_transition(reverse: bool):
	if reverse:
		animation_player.play_backwards(transition)
	else:
		animation_player.play(transition)
	await animation_player.animation_finished
