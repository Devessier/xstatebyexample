Here are a few notes about the implementation of the video player example.

- `mousemove` and `click` events are triggered on mobile devices when the user clicks on an element. `mouvemove` and `mouseleave` events lead to `hover.hovering` and `hover.end` events being sent to the machine, and I discard them on mobile devices as they interfere with the `click` events I'm also listening to.
- When the video is paused, controls can be hidden only on mobile devices.
