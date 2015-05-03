function GameContext(state, renderLoopTimeout, serverLoopTimeout)
{
    this.fps = 0
    this.ping = 0
    this.state = state
    this.renderLoopTimeout = renderLoopTimeout
    this.serverLoopTimeout = serverLoopTimeout
}