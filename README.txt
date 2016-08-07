README.txt

Connect Four

To run Connect Four:

Clone this repository:
	git clone https://github.com/mangotang/connect-four

Next:
	cd connect-four
	cd docker
	docker build -t connect-four .
	(don't forget the "." at the end of the line)
	docker run -p 18080:8080 connect-four

To play the game:
	In a browser (I tested on Chrome) go to this URL:
	http://localhost:18080/confour/index.html

To stop the Docker container:
	docker stop `docker ps -q`

Notes about the implementation:
	* if you choose to play as "yellow", the AI will immediately begin the game by taking its turn.
	* When the game is finished, the winner will be announced just below the "Connect Four" title. After this, no more turns can be taken.
	* To play again, refresh the browser page.
	* Notice that the AI takes about 1/2 second to complete its turn. While the AI is thinking, the human player cannot proceed.

