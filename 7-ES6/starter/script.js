var box5 = {
	color: 'green',
	position: 1,
	clickMe() {
		console.log(this);
		(() => console.log(this.position) )()
	}
}

box5.clickMe()