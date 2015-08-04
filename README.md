## Slowpoke.Net - MMO game server engine

![Logo] (http://media.tumblr.com/224985f9fa1ad61ff67cdee8e1457c14/tumblr_inline_nkatvak4vA1t8c0ku.jpg)

###Project goals
- common MMO game server engine, that could be used to build on top of it MMO like games 
- server features:
  - mechanic engine (character development, social relations, economy, etc ...)
  - physical engine (objects movement, collision detection, gravitation etc ...)
  - map (world location processing, physical engine calculation optimization, etc ...)
  - client session manager (client authorization, action requests processing and world state retrieving, etc ...)
- simple MMO 2d top down shooter game built using Slowpoke engine
- web client


###Current technology stack:
- Backend with .NET: ASP MVC 5, OWIN, SignalR, Entity Framework, Unity, MSSQL
- Frontend:
  - AngularJs for  profile and web site
  - CreateJs (EasyJs, TweenJS,  SoundJS) for view engine
  - TypeScript for client mechanic & physics engine

