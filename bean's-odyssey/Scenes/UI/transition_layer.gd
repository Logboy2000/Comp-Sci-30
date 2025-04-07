class_name TransitionLayer
extends CanvasLayer

@onready var animation_player: AnimationPlayer = $AnimationPlayer
@onready var room_manager: RoomManager = $"../RoomManager"

var screen_transition: String = "default"
var transitioning: bool = false

func _ready() -> void:
	Global.transition_layer = self

func change_room(room_path: String, fade_out_music: bool = true, extra_delay_seconds: float = 0) -> void:
	if not transitioning:
		# Start of transition
		transitioning = true
		Global.can_pause = false
		get_tree().paused = true
		Audio.fade_out_music()
		
		# Play the animation
		play_transition()
		await animation_player.animation_finished
		
		# Actually change rooms
		room_manager.load_room(room_path)
		
		# Wait Extra Delay
		if (extra_delay_seconds > 0):
			await get_tree().create_timer(extra_delay_seconds).timeout
		
		# Unpause
		transitioning = false
		get_tree().paused = false
		Global.can_pause = true
		
		# Play transition in reverse
		play_transition(true)
		await animation_player.animation_finished
	else:
		push_warning("Already transitioning! Bad bad bad bad bad bad bad baaaaad")

func play_transition(reverse: bool = false, speed_scale: float = 1):
	if reverse:
		animation_player.play_backwards(screen_transition)
	else:
		animation_player.play(screen_transition, -1, speed_scale)
	await animation_player.animation_finished
