README
====================== 
*(updated section for Evaluation ~~1~~2)*<br>
<span class="change">*All highlighted text shows changed content. Alternatively view commit history on Github for changes</span>

### <a name="top"></a><span class>Content page</span>
1. [Overview](#overview)
2. [Demo](#demo)
3. [Proposed Level of Achievement](#achievement)
4. [Ignition](#ignition)
5. [Planned Features](#features)
6. [System Utility](#utility)
7. [References](#references)
8. [Log](#log)

# Project Title: Quiz Bomb

### <a name="overview"></a>Overview [↑](#top)
A web based quiz game. Play timed quiz with your friends or the world! Each round a player sets a question and other players try to guess it. 

<!-- More description of game. add in visuals -->
### <a name="demo"></a><span class="change">Demo</span> [↑](#top)
[Game Demo][]<br>
[Game Link][]

<!--*Game is optimised for mobile devices-->

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
3. [x]<span class="change">Room status messages</span>
	 * As a player I want to be informed of the changes to the room I'm in

####Second Sprint

3.  <span class="change">[x]Message sending</span>
    * As a player I want to send my answer to the 'game master' for verification
    * As a active/non-active player, everyone should be able to see my answer so that we share funny answers
4. <span class="change">Game logic</span>
    * [x]As the game master, I want answers to be accepted immediately when it matches my answer perfectly
    * [x]As the game master, I want to set the question, answer and question category
    * As players, I want the game master to be rotated each round so that I get to set the question
5.  [x]Form validation
	 * (This is more for backend) This ensures there are no duplicates of any names as well as for security reasons

####Final Sprint

6. social sharing
    * As a player, I want to share with others the game I am playing
7. score leaderboard
    * As a player I want to see how well I (and other players) have performed
8. questions bank
    * As a game master, I want to sample questions when I run out of questions to set 

-------------------
### <a name="utility"></a><span class="change">System Utility</span> [↑](#top)
Methods used for utility testing

* [Prototype][]
* Real User tests and feedbacks
* Cognitive Walkthrough / Heuristic Evaluation / User stories

-------------------
<!-- for later milestone
### Justifications for Apollo 11
 
This section added for teams to use as a template for Evaluation 3.  You should state the level that you wish to get, as well as a justification that consists of what you did to satisfy the minimum requirements for that achievement, against the details in Post @159).

Our team proposes that we should be granted Project Gemini (Intermediate) level of achievement.
As you can see from our log we have been active over all three months of the project and have a record of sustained contribution to our Orbital project.  We have completed Liftoff, and met each other on and off through the months to develop our web application using the recommended Google App Engine using Python.
 
With respect to Mission Control topics, Min attended one session physically, while Wee Sun watched two sessions.  We have used some of the technologies (Bootstrap, Maps API) in our project, but have also watched the Unit Testing sesion although that hasn't made it into our project.
 
With respect to Peer evaluation, we have tried our best to give constructive feedback in the free-text fields, going beyond the minimum requirement for offering feedback to you, our peers. Hopefully you will agree and grant us a minimum of 2.5 / 4 stars for feedback from you. We're hoping for your 3 or 4 ratings for the peer feedback evaluation.
For the four additional features on top of the basic project we would like our peers and the instruction staff to consider the following for the criteria for Project Gemini (culled from Post @159). Hopefully this grants us the 2.5/4 minimum from all of you (please?):
·       Added Facebook system for sending thank yous (as like button by the receiving party): counts again Social integration (see e.g. https://developers.facebook.com/docs/plugins/).
 
·       Google Login: counts against Facebook or OpenID login (other than that provided automatically by Google App Engine), see e.g. https://developers.facebook.com/docs/facebook-login,https://developers.google.com/appengine/articles/openid.
 
·       Added pins and local maps for events: counts against Google Maps API https://developers.google.com/maps/, or OneMap API http://www.onemap.sg/api/help/.
 
·       Adding in auto-suggested pictures for gifts via querying Google Image against the user's description of the gift: counts against Other features.
 
We wished to have been able to complete some form of user testing but we ran out of time. We hope to poll more friends as they return to school at Week 0 and 1 for this, but we understand that this cannot be counted as the project is officially over with Evaluation 3 :-( Oh well.
-->

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

-------------------
### <a name="log"></a>Project Log [↑](#top)
[Log][]

<!-- links -->
[game demo]: http://youtu.be/t_zq7qRYGJk
[prototype]: http://quizbomb.heroku.com
[game link]: http://quizbomb.heroku.com
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

[log]: https://docs.google.com/spreadsheets/d/1e2rd8M_KX9adLv5_JHVMh9-lTx8qztDOJhhcLJqUQAU/edit?usp=sharing

<!-- Style -->
<style>
    .change {
    background-color: #fffbcc;
</style>