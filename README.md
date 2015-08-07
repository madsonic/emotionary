<link rel="stylesheet" href="readme.css">

README
====================== 
*(updated section for Evaluation ~~2~~ 3)*<br>
<span class="change">*All highlighted text shows changed content. Alternatively view tags 'milestone2' and 'milestone3' on Github to compare changes</span>

### <a name="top"></a><span class>Content page</span>
1. [Overview](#overview)
2. [Demo](#demo)
3. [Proposed Level of Achievement](#achievement)
4. [Ignition](#ignition)
5. [Planned Features](#features)
6. [System Utility](#utility)
7. [References](#references)
8. [Log](#log)

# Project Title: ~~Quiz Bomb~~Emotionary

### <a name="overview"></a>Overview [↑](#top)
A web based quiz game. Play timed quiz with your friends or the world! Each round a player sets a question and other players try to guess it.~~
A cross between Pictionary and Emojis. Use Emojis instead drawings and let your friends guess what it is suppose to be!

Game layout is responsive and is playable on both mobile devices and desktop.

<!-- More description of game. add in visuals -->
### <a name="demo"></a><span class="change">Demo</span> [↑](#top)
[Game Demo (milestone 2)][]<br>
[Game Demo (milestone 3)][]<br>
[Game Link][]

-------------------
### <a name="achievement"></a>Proposed Level of Achievement [↑](#top)
Apollo 11

-------------------
### <a name="ignition"></a>Ignition [↑](#top)
[Video][]<br>
[Slides][]

-------------------
### <a name="features"></a>Planned Features [↑](#top)
*[x] indicates completed feature*

####First Sprint

1. [x]Room function (create/join)
    * As a player I want to be able to join room and quickly start a game
    * As a player I want to able to create room so that I can play in a private environment
2. [x]Set nickname
    * As a player I want to be able to set a unique name to be identifiable
3. [x]Room status messages
	 * As a player I want to be informed of the changes to the room I'm in

####Second Sprint

4.  [x]Message sending
    * As a player I want to send my answer to the 'game master' for verification
    * As a active/non-active player, everyone should be able to see my answer so that we share funny answers
5. [x]Game logic
    * As the game master, I want answers to be accepted immediately when it matches my answer perfectly
    * As the game master, I want to set the question, answer and question category
    * As players, I want the game master to be rotated each round so that I get to set the question
6.  [x]Form validation
	 * (This is more for backend) This ensures there are no duplicates of any names as well as for security reasons

####Final Sprint
For the final sprint the game has changed slightly but all previously implemented features still works. Only what is
allowed to set as questions have changed. Question can only be filled up with the emoji keyboard

7. [x]social sharing
    * As a player, I want to share with others the game I am playing (Added OG data and a Facebook share button)
8. [x]uniform emoji
    * As a player, I want to see uniform emoji choices to be independent of platform (mobile/desktop).
9. <span class="change">~~score leaderboard~~ insufficient time</span>
    * As a player I want to see how well I (and other players) have performed
10. <span class="change">~~questions bank~~ insufficient time</span>
    * As a game master, I want to sample questions when I run out of questions to set 
11. <span class="change">[x]Room features</span>
    * As a game master, I want to stop the current game in case I set the questions wrongly
    * As players/gamemaster, I do not want new players to join the room when there is an ongoing game.
13. <span class="change">[x]Destroys empty room automatically
    * (This is more for backend). This ensures there are no rubbish rooms to pollute rooms namespace
14. <span class="change">[x] UX improvement</span>
	* As a player, there should be some feedback when I change room (room name animates)
15. <span class="change">[x]Disconnection</span>
    * As a player, when I lose connection to the game, I want to be aware. (Player has to re-register on connection)

-------------------
### <a name="utility"></a><span class="change">System Utility</span> [↑](#top)
Methods used for utility testing

* [Prototype][]
* [Real User tests and feedbacks][]
* Cognitive Walkthrough / Heuristic Evaluation / User stories

-------------------

### <a name="references"></a>References [↑](#top)

Technology:

* [Socket.io][]
* [Node.js][]
* <span class="change">[Express][]</span>
* [Git][]
* [jQuery][]
* [jQuery event 1][]
* [jQuery event 2][]
* [~~Popup.js~~][] <span class="change">(Replaced with bootstrap modal)</span>
* [Bootstrap][]
* [Sass - CSS preprocessor][]

-------------------
### <a name="log"></a>Project Log [↑](#top)
[Log][]

<!-- links -->
[Game Demo (milestone 2)]: http://youtu.be/l-rWHvoIWG4
[Game Demo (milestone 3)]: http://youtu.be/l-rWHvoIWG4
[Real User tests and feedbacks]: https://docs.google.com/spreadsheets/d/1GQi1M8QyhQVgS020U0mcLAAQEl97xcG4CAncg9z1FhU/edit?usp=sharing
[prototype]: http://emotionary.herokuapp.com
[game link]: http://emotionary.herokuapp.com
[video]: http://youtu.be/HEGBts_DTzo
[slides]: https://docs.google.com/presentation/d/1aR7e_4yMLNAcQ9QlRmh7JdMM8Tlh1obsozhcB6fMlt8/edit?usp=sharing 
[Socket.io]: http://socket.io/
[node.js]: https://nodejs.org/api/all.html
[express]: http://expressjs.com/
[git]: https://progit.org/
[jquery]: http://api.jquery.com/
[jQuery event 1]: http://jqfundamentals.com/chapter/events 
[jQuery event 2]:http://www.mattlunn.me.uk/blog/2012/05/what-does-event-bubbling-mean/
[~~popup.js~~]: http://docs.toddish.co.uk/popup/
[Bootstrap]: http://getbootstrap.com/
[Sass - CSS preprocessor]: http://sass-lang.com/

[log]: https://docs.google.com/spreadsheets/d/1e2rd8M_KX9adLv5_JHVMh9-lTx8qztDOJhhcLJqUQAU/edit?usp=sharing